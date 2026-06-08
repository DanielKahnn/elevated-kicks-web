<#
  Elevated Kicks — Shopify Product Image Uploader
  ─────────────────────────────────────────────────────────────────────────────
  HOW TO RUN:
    1. Open PowerShell
    2. cd "C:\Users\Danie\Desktop\elevated-kicks-web"
    3. .\scripts\upload-product-images.ps1 -AdminToken "shpat_YOUR_TOKEN_HERE"

  Get your token:
    Shopify Admin → Settings → Apps → Develop apps → Create an app
    → Configuration → Admin API scopes: write_products → Save → Install
    → API credentials → Reveal token once → copy it
#>
param(
  [Parameter(Mandatory)][string]$AdminToken
)

$StoreDomain  = "elevatedkickshou.myshopify.com"
$BaseUrl      = "https://$StoreDomain/admin/api/2024-01"
$LocalImgBase = "$env:USERPROFILE\Desktop\ek-product-images"

$Headers = @{
  "X-Shopify-Access-Token" = $AdminToken
  "Content-Type"            = "application/json"
}

# ─── Product → (ShopifyID, local-folder, image URLs list) ───────────────────
$Products = @(
  @{ id="9853888921902";  folder="jordan-1-retro-high-og"; urls=@(
      "https://cdn.sanity.io/images/pu5wtzfc/production/0e1095ef69c6d4525d1311f6ca2fc6b7f95d68b1-2000x1250.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/c934475c24ed226c5d8e05be2ca11861531c19a0-1200x1200.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/98083d379051b37f224f2dfdd4c1aee2d172e523-1200x1027.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/8c6500981f20cb9155051a52beb7c60e9d82e02b-1200x750.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/deda8dc622830fedbec23f428e3285171db5e5f3-1200x750.jpg") },
  @{ id="9853909336366";  folder="jordan-5-reimagined-black-metallic"; urls=@(
      "https://cdn.sanity.io/images/pu5wtzfc/production/1d4884fe235f647ab1cf70b2731cb3e30f2e690f-2000x1333.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/511e152999031edaf0069b7959b08aae6106ee86-1440x1800.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/8fa0ae32d23766ba47bf41e4e35d66cb8f06ff30-2000x1250.png",
      "https://cdn.sanity.io/images/pu5wtzfc/production/cda9457f5b9e304b2d26b67f165a3f44b096b455-2000x1250.png",
      "https://cdn.sanity.io/images/pu5wtzfc/production/77c3b7a3160fa9d225967eaf024f91f8ac9d5902-2000x1250.png") },
  @{ id="9854189928750";  folder="jordan-3-black-cat"; urls=@(
      "https://cdn.sanity.io/images/pu5wtzfc/production/9c2254a350039f8313a01360d6160a796c0f2881-1966x1229.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/567f1129c451ba0ac145692309acc24c3650713e-2160x1440.webp",
      "https://cdn.sanity.io/images/pu5wtzfc/production/fc6eb6aa5d28291750fde8d40060a5acabcc084e-2160x1440.webp",
      "https://cdn.sanity.io/images/pu5wtzfc/production/b2d4cd934f2bba3910c7983804a34df43917673a-1728x2160.webp",
      "https://cdn.sanity.io/images/pu5wtzfc/production/6436f91088b3ea372f2143e3a6b0c90c85cba9c61-1728x2160.webp") },
  @{ id="9854193893678";  folder="jordan-3-lucky-shorts"; urls=@(
      "https://sneakernews.com/wp-content/uploads/2025/02/jordan-3-lucky-shorts-CT8532-101-official-images-1.jpg",
      "https://sneakernews.com/wp-content/uploads/2025/02/jordan-3-lucky-shorts-CT8532-101-official-images-3.jpg",
      "https://sneakernews.com/wp-content/uploads/2025/02/jordan-3-lucky-shorts-CT8532-101-official-images-4.jpg",
      "https://sneakernews.com/wp-content/uploads/2025/02/jordan-3-lucky-shorts-CT8532-101-official-images-5.jpg",
      "https://sneakernews.com/wp-content/uploads/2025/02/jordan-3-lucky-shorts-CT8532-101-official-images-6.jpg") },
  @{ id="9854199791918";  folder="jordan-3-a-ma-maniere"; urls=@() },  # replacement URLs inserted by script below
  @{ id="9854203068718";  folder="nike-zoom-field-jaxx"; urls=@(
      "https://cdn.sanity.io/images/pu5wtzfc/production/bb14cd888e7b617acdb05c709213eb1284efec48-2000x1250.png",
      "https://cdn.sanity.io/images/pu5wtzfc/production/ef5274b503ba572279c32945239b627989bb391b-2000x1250.png",
      "https://cdn.sanity.io/images/pu5wtzfc/production/0269b94ab9a550209cc937c2c3b15abb3f72ce7f-2000x2000.png",
      "https://cdn.sanity.io/images/pu5wtzfc/production/34a35b4a7828f5b70b63e75a59b411ebf5ddabb4-2000x2000.png",
      "https://cdn.sanity.io/images/pu5wtzfc/production/0a446cd4ad51633d8d2c1d0e4244ad293-2000x2000.png") },
  @{ id="9854205493550";  folder="jordan-4-white-cement"; urls=@(
      "https://cdn.sanity.io/images/pu5wtzfc/production/5058c64ef0d6df792cb9c939e0fdfc81c7e5b348-1818x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/8a95563b0eebd3c449d489ae9a400f6999844e88-2096x1311.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/59aef27c4158b8e0f76b75768128c857ad2c610b-1966x1229.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/e72f4ddccec8a9172123a43a46eee450b5ce2ce6-1966x1229.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/aa0551718d02d826535fac97e81e3a9e4665be8d-1966x1229.jpg") },
  @{ id="9854208246062";  folder="jordan-12-melo-2025"; urls=@(
      "https://cdn.sanity.io/images/pu5wtzfc/production/7386f5f0efcad31c498897ac47a32fc41cfb6c5d-1966x1229.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/f4cdbfa841c1223993bb2f8fa99edfa8b8e69346-1966x1229.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/3d2af96d54932a854d94b4d85745a55e53e7ca1a-1966x1229.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/32e7b591db8d458b696655fc6a0cf0441922f12c-1818x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/21568cacfd282c126a5cf14b0c3600e47267fa11-1966x1229.jpg") },
  @{ id="9854210605358";  folder="jordan-1-rare-air"; urls=@(
      "https://cdn.sanity.io/images/pu5wtzfc/production/dcb79e9f9641f0e43aaff78e39f788e5abf11fd02-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/3df482d0f4bda53cea1c2b5c3534f7f16617f5be-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/613736c222fa6ca3ec198d8508d6cd4c08518b83-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/4e7b49f28b8dce470baab2002196d787208dc703-1818x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/683e144e3e8a4ff58e9afc19932624330f00dd1c-1966x1229.jpg") },
  @{ id="9854213947694";  folder="kobe-9-masterpiece"; urls=@(
      "https://cdn.sanity.io/images/pu5wtzfc/production/6bbebad31d4212445eac5f9445414423ae8c87f0-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/d6a24e199bd09a15d086041f553f2dd8533d47a8-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/e00a90b6dc5354efb06b94730f526307da6777c0-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/8dd506d0009bfd19592f90dae5c449fd14a616b8-2000x2000.png",
      "https://cdn.sanity.io/images/pu5wtzfc/production/096d2770f9d11a178274aa7ab17bab73683b03bb-2000x2000.png") },
  @{ id="9854217650478";  folder="af1-kobe-lakers-home"; urls=@(
      "https://cdn.sanity.io/images/pu5wtzfc/production/80b832c40581f987109812c15f9f4e3e2be3951f-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/9071e941045c9e51b1723dc4666c8ea9eb831226-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/161a626ff16bebdd61b4212ff3c7b88961ef3cfa-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/76f0dfb1f2c0b3b58a14d453a402a3fa100e7c7-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/7255e17f15573023fc7a6404c29d48531bd63c45-2000x2000.jpg") },
  @{ id="9854227054894";  folder="nike-victory-tour-4-golf"; urls=@(
      "https://cdn.sanity.io/images/pu5wtzfc/production/0333663273286341b3c923e1ce601e751fdfa75d-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/48f297689ec4176e301b4d802dc28a99dd16ec7c-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/24e7693454e71a9dc5b3516cd29279707c0983be-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/9359a80d2cca9506c6fbcf41ee9166a2c5dd5c8a-1966x1229.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/28ec69fad830a83732488095ef7c70203c11b242-1966x1229.jpg") },
  @{ id="9854228857134";  folder="jordan-11-legend-blue"; urls=@(
      "https://cdn.sanity.io/images/pu5wtzfc/production/afa8847e47b57a22a7a28095af20a46134c97fd6-1440x1800.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/b693e1a65e7afb858555282f345db6053f8a6b3b-1440x1800.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/ba89538356a4382792cdc0037533701a98054af7-1440x1800.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/b635d8c190e6eb49f6196ac498ababb4b4eb0f28-1440x1800.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/aa8665aac37249aab82705865792d5de82bc9045-1818x2000.png") },
  @{ id="9854231347502";  folder="jordan-14-black-toe"; urls=@(
      "https://cdn.sanity.io/images/pu5wtzfc/production/d8393f6298c548a2b74e246dbff48ee309d80a3e-2000x1250.png",
      "https://cdn.sanity.io/images/pu5wtzfc/production/38e9a1171a062335fd51dba957e09f33c4771e74-2000x1250.png",
      "https://cdn.sanity.io/images/pu5wtzfc/production/49cf6ec9aa6059944f8ceab11f574931c455502d-2000x2000.png",
      "https://cdn.sanity.io/images/pu5wtzfc/production/ac9cfa4a4eb44508b3aba9807ebed6e1ce3bbdc5-2000x2000.png",
      "https://cdn.sanity.io/images/pu5wtzfc/production/8466c06cb5bbe62476cf5654ee9b2631e4db5573-1818x2000.png") },
  @{ id="9854233477422";  folder="jordan-1-unc"; urls=@(
      "https://cdn.sanity.io/images/pu5wtzfc/production/de7851f76985ca5eb3dbe06c9f4dde623c7f5e34-2000x1250.png",
      "https://cdn.sanity.io/images/pu5wtzfc/production/952d9ea6bbc1d72597b783e7e2e92bd9acb70297-4288x3039.png",
      "https://cdn.sanity.io/images/pu5wtzfc/production/f546cbb8e7be22f26eb4957d802ef747885e56ce-4288x3039.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/7afdee5ace9c0818dcf9ad64bfe94408aa1e284f-2500x1563.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/55e88d061edd94deb3c8dd254e854a30a4934da0-1200x1200.jpg") },
  @{ id="9854238458158";  folder="af1-retro-lettering"; urls=@(
      "https://sneakernews.com/wp-content/uploads/2024/11/nike-air-force-1-low-retro-lettering-hv5752-410-1.jpg",
      "https://sneakernews.com/wp-content/uploads/2024/11/nike-air-force-1-low-retro-lettering-hv5752-410-2.jpg",
      "https://sneakernews.com/wp-content/uploads/2024/11/nike-air-force-1-low-retro-lettering-hv5752-410-3.jpg",
      "https://sneakernews.com/wp-content/uploads/2024/11/nike-air-force-1-low-retro-lettering-hv5752-410-4.jpg",
      "https://sneakernews.com/wp-content/uploads/2024/11/nike-air-force-1-low-retro-lettering-hv5752-410-5.jpg") },
  @{ id="9854239867182";  folder="jordan-3-rare-air"; urls=@(
      "https://cdn.sanity.io/images/pu5wtzfc/production/89fbc6d9e4c4d8360c52d93e18d530887f9b9647-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/3249fffe0aaa0aeb911706702aad2013ae466e0d-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/02d7d9919132c99df717f5939534506b03c45acd-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/f57788e6659534db3ce389a086ec598b606b400a-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/f6910b4fd4aebdc7c902e9768138e27e4a6ea1c-3000x1875.jpg") },
  @{ id="9854244389166";  folder="af1-bison-black"; urls=@(
      "https://cdn.sanity.io/images/pu5wtzfc/production/94e18d74f55e2745cac6e0a91b6c8a8026c1d0af-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/7e16c4ed211aa5288feb5480b5059d2c0c4f3d61-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/77204ad41cc518c20e43b749bd857b5f0c800d3e-2000x1250.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/0760c16adf30d6887a3278e6f7a17b8f5529a368-2000x1250.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/a5c4288733409336ce012d0a6c50b17536866918-2000x1250.jpg") },
  @{ id="9854246584622";  folder="sb-dunk-low-aluminum"; urls=@(
      "https://cdn.sanity.io/images/pu5wtzfc/production/bca7979a2d29c4f78b35c9eeb7d3bded8a5f038b-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/0350c2e0daf67df9e0b98f06e937c3640684f40d-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/45a734cd131ef85e98b33a24a0f2cbb509c4b93c-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/5afc0f5c180ad380329fb7f5f534f56c890e41a7-1818x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/d070a51284729dd36ae51a8e3ad1f07ad57e88fd-1966x1229.jpg") },
  @{ id="9854250549550";  folder="foamposite-black-volt"; urls=@(
      "https://cdn.sanity.io/images/pu5wtzfc/production/3e052ed2a1d050768f1ea65d85d9b4abb6f6f642-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/6cf50a51ac9e376c9e5f4a40f44c82f2553e4ffe-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/1cb8853a12ce270af3603ff7930fb12bd0ae57de-1818x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/19dc9dfd3ffdde47e8c87977bd1c20296b8487aa-1966x1229.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/eafbf490a7d7a1b223cfbb942920566e7cbf6e9f-1966x1229.jpg") },
  @{ id="9867054186798";  folder="jordan-3-pure-money"; urls=@(
      "https://cdn.sanity.io/images/pu5wtzfc/production/460aa6564bbb277f8da52b644daeaa55bf9f2db1-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/8116c14a50c597106f151d922a988c3e1c31f045-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/30e69f7c61d8a4394a2956eb606625c516ddfe2f-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/45da33fda43179768d920550b67741137068e8f5-3000x3000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/6d0a493f33283ff7d906f3ab05533ce2cc2b14c0-1818x2000.jpg") },
  @{ id="9867055202606";  folder="jordan-5-grape"; urls=@(
      "https://cdn.sanity.io/images/pu5wtzfc/production/701e047d0b7d8f2b77b2c25ba7a177fb1bc64843-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/fd0831521ff3a81d9f3c427481f50f3f41093847-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/3560732009903a6268d7e11bb2ec13ce2a361f6a-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/bede915e79319f69711d073669a263c2f1119f42-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/c2d37c1b17c8c8bfca73e0b7212b4eeb469612a9-1818x2000.jpg") },
  @{ id="10050754281774"; folder="jordan-1-shattered-backboard"; urls=@(
      "https://sneakernews.com/wp-content/uploads/2025/04/shattered-backboard-jordan-1s-1.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/ebc2a8e0444cc4705dfe2956e1fd7e70f9e6e247-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/de9913eb6f2ba8f5d53e7673c9074cb39d5-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/36c750e5c94d999f010fd92af5634bfac98-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/6b2207cebf41bc724439beff0fb1db39d5-2000x2000.jpg") },
  @{ id="10050754511150"; folder="kobe-iii-halo"; urls=@(
      "https://cdn.sanity.io/images/pu5wtzfc/production/87b8fbd4288406795a456aa6ea27afc1cb2fe9c3-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/a5aa811e2465822eb463dfc30d3ca6f423bda228-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/54411ce573d3c64e20ee1452a11da8c960f1e9b4-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/ad10c59bccc6233fab2323dd45d1dab72f9eb4c3-1818x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/8486c194fcff5941f1a307c39acc17e5ba074a04-1966x1229.jpg") },
  @{ id="10050754740526"; folder="jordan-1-self-expression"; urls=@(
      "https://cdn.sanity.io/images/pu5wtzfc/production/521429d632f55d5bacb438732a99f02e2f74f4ed-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/7784045228c5bb4d80a426ecc854fe84a321e215-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/0b56f66714a21573dacc5181a2b6f4fe0267de2c-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/43afac64c435c9609e7f1f9df50a77a85f750d8f-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/3e14e88e926e880f564bd5a178efbb6ee1f230b3-2000x2000.jpg") },
  @{ id="10050754806062"; folder="kobe-iv-protro"; urls=@(
      "https://static.nike.com/a/images/f_jpg,b_rgb:FFFFFF,q_auto,h_800,w_800,c_pad/csx6rif2benryxkcnkp1/AJ7782_010_A_PREM",
      "https://cdn.sanity.io/images/pu5wtzfc/production/421ac2f17dd774d45f6531ebee21afb9e93d1086-2000x1250.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/6b8bf25008f40b754f7113eb5d842e9670aa6c76-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/b72a7ba09864a31ed9763098f4a28244aab5d023-2000x2000.jpg",
      "https://cdn.sanity.io/images/pu5wtzfc/production/05566246122f20eea5b6b6f6a33178a36f373ce7-2000x2000.jpg") }
)

# ─── Helper: Upload one image via base64 (local file) ────────────────────────
function Upload-LocalImage {
  param($ProductId, $FilePath)
  $bytes  = [System.IO.File]::ReadAllBytes($FilePath)
  $b64    = [Convert]::ToBase64String($bytes)
  $fname  = Split-Path $FilePath -Leaf
  $body   = @{ image = @{ attachment = $b64; filename = $fname } } | ConvertTo-Json -Depth 5
  try {
    $r = Invoke-RestMethod -Uri "$BaseUrl/products/$ProductId/images.json" `
         -Method POST -Headers $Headers -Body $body -ContentType "application/json"
    return $r.image.id
  } catch { return $null }
}

# ─── Helper: Upload one image via src URL (Shopify fetches it) ───────────────
function Upload-UrlImage {
  param($ProductId, $Url)
  $body = @{ image = @{ src = $Url } } | ConvertTo-Json -Depth 3
  try {
    $r = Invoke-RestMethod -Uri "$BaseUrl/products/$ProductId/images.json" `
         -Method POST -Headers $Headers -Body $body -ContentType "application/json"
    return $r.image.id
  } catch { return $null }
}

# ─── Helper: Get existing image count ────────────────────────────────────────
function Get-ExistingImageCount {
  param($ProductId)
  try {
    $r = Invoke-RestMethod -Uri "$BaseUrl/products/$ProductId/images.json" `
         -Method GET -Headers $Headers
    return $r.images.Count
  } catch { return 0 }
}

# ─── Main upload loop ─────────────────────────────────────────────────────────
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════"
Write-Host "  ELEVATED KICKS — Shopify Image Upload"
Write-Host "  Store: $StoreDomain"
Write-Host "═══════════════════════════════════════════════════════"
Write-Host ""

$totalOk = 0; $totalFail = 0

foreach ($p in $Products) {
  $productId    = $p.id
  $folder       = $p.folder
  $localFolder  = Join-Path $LocalImgBase $folder
  $localFiles   = if (Test-Path $localFolder) {
                    Get-ChildItem $localFolder -File | Sort-Object Name
                  } else { @() }

  # Check how many images already exist on Shopify
  $existing = Get-ExistingImageCount -ProductId $productId
  if ($existing -ge 5) {
    Write-Host "SKIP  $folder  (already has $existing images on Shopify)"
    continue
  }

  Write-Host ""
  Write-Host "── $folder  [ID $productId] ──────────────"
  Write-Host "   Local files: $($localFiles.Count)  |  Shopify already has: $existing"

  $uploaded = 0

  # 1️⃣  Upload local files first (most reliable)
  foreach ($file in $localFiles) {
    if ($uploaded -ge 5) { break }
    $imgId = Upload-LocalImage -ProductId $productId -FilePath $file.FullName
    if ($imgId) {
      Write-Host "   ✓ local  $($file.Name)  → img ID $imgId"
      $uploaded++; $totalOk++
      Start-Sleep -Milliseconds 300  # stay under rate limit
    } else {
      Write-Host "   ✗ local  $($file.Name)  FAILED"
      $totalFail++
    }
  }

  # 2️⃣  If still under 5 images, try remaining URLs via src
  if ($uploaded -lt 5 -and $p.urls.Count -gt 0) {
    $urlIndex = $localFiles.Count   # skip URLs we already have locally
    while ($uploaded -lt 5 -and $urlIndex -lt $p.urls.Count) {
      $url   = $p.urls[$urlIndex]
      $imgId = Upload-UrlImage -ProductId $productId -Url $url
      if ($imgId) {
        Write-Host "   ✓ url    $([System.IO.Path]::GetFileName($url))  → img ID $imgId"
        $uploaded++; $totalOk++
        Start-Sleep -Milliseconds 300
      } else {
        Write-Host "   ✗ url    $url  FAILED"
        $totalFail++
      }
      $urlIndex++
    }
  }

  Write-Host "   → $uploaded image(s) uploaded for this product"
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════"
Write-Host "  DONE  ✓ $totalOk uploaded   ✗ $totalFail failed"
Write-Host "═══════════════════════════════════════════════════════"
Write-Host ""
Write-Host "Visit your store: https://elevated-kicks-web.vercel.app"
