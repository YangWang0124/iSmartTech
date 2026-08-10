import type { Product } from "../types";

type ProductZh = Pick<Product, "name" | "shortDescription" | "description" | "features">;

const zh: Record<string, ProductZh> = {
  "dahua-4k-turret": { name:"Dahua 800万像素 4K 智能双光半球摄像机", shortDescription:"4K清晰监控，支持智能侦测及全彩夜视。", description:"适用于家庭和小型企业的户外半球摄像机。智能双光技术可在夜间提供清晰彩色画面，人员及车辆侦测有助于减少无效警报。", features:["800万像素超高清分辨率","智能人员及车辆侦测","全彩夜视","IP67防风雨机身"] },
  "hikvision-colorvu": { name:"Hikvision 600万像素 ColorVu 网络摄像机", shortDescription:"全天候可靠监控，提供24小时鲜明彩色画面。", description:"专为入口、车道及零售场所设计，具备低照度彩色成像及高效网络录像。", features:["600万像素高清成像","24小时彩色技术","内置麦克风","防风雨外壳"] },
  "uniview-4ch-kit": { name:"Uniview 四摄像机 PoE 安防套装", shortDescription:"完整的四摄像机安防套装，安装简单方便。", description:"小型场所闭路电视系统所需设备一应俱全：四台防风雨摄像机、PoE录像机、存储硬盘及线缆，组合成实用完整的套装。", features:["四台400万像素半球摄像机","四通道PoE网络录像机","内置2TB监控硬盘","手机远程查看"] },
  "ajax-starter-kit": { name:"Ajax 无线报警入门套装", shortDescription:"精致的无线报警基础套装，支持应用控制和即时通知。", description:"智能入侵防护的灵活起点，包含主机、移动侦测器、门磁及遥控器，适合紧凑型安装。", features:["安全无线通信","即时应用通知","系统轻松扩展","最长15小时备用电源"] },
  "ubiquiti-g5-bullet": { name:"Ubiquiti UniFi Protect G5 枪式摄像机", shortDescription:"专为UniFi Protect生态系统设计的小巧2K PoE摄像机。", description:"简洁的室内外摄像机，提供清晰2K画面、智能侦测，并可通过UniFi Protect统一管理。", features:["2K视频分辨率","AI事件侦测","集成红外灯","UniFi Protect管理"] },
  "tp-link-vigi-nvr": { name:"TP-Link VIGI 八通道 PoE 网络录像机", shortDescription:"内置PoE的八通道网络录像机，让部署更加简单。", description:"通过八个PoE端口、远程管理及灵活硬盘支持，集中管理兼容摄像机的录像和回放。", features:["八通道实时画面","八个内置PoE+端口","4K HDMI输出","远程监控"] },
  "ezviz-doorbell": { name:"EZVIZ 2K Wi-Fi 可视门铃", shortDescription:"通过手机应用随时随地查看访客并进行通话。", description:"电池供电的可视门铃，拥有宽广视角、清晰双向语音及智能人体侦测。", features:["2K视频","176°超广角","双向通话","智能人体侦测"] },
  "seagate-skyhawk-4tb": { name:"Seagate SkyHawk 4TB 监控硬盘", shortDescription:"专为全天候监控录像系统打造的存储设备。", description:"针对持续录像工作负载优化，可可靠安静地支持多路高清视频。", features:["4TB容量","全天候工作设计","支持多达64台摄像机","ImagePerfect固件"] },
  "dahua-16ch-nvr": { name:"Dahua 十六通道 4K 网络录像机", shortDescription:"可扩展的十六通道录像机，支持PoE及智能搜索。", description:"适用于大型住宅及商业场所，提供十六路PoE、4K输出及高容量监控存储空间。", features:["十六路PoE摄像机通道","4K解码及输出","两个SATA硬盘位","AI事件搜索"] },
  "hikvision-intercom-kit": { name:"Hikvision IP 可视对讲套装", shortDescription:"完整的门口机及室内触控屏通信套装。", description:"可通过室内显示屏或手机应用接听访客、开启联网门锁并查看访客截图。", features:["7英寸触控显示屏","1080p门口机","手机应用远程接听","PoE网络连接"] },
  "reolink-solar-camera": { name:"Reolink 4K 太阳能安防摄像机", shortDescription:"配备太阳能板的无线云台监控摄像机。", description:"适用于布线困难的位置，提供大范围4K监控、自动追踪及可持续太阳能充电。", features:["4K无线视频","355°水平及140°垂直旋转","附带太阳能板","人员及车辆侦测"] },
  "ruijie-poe-switch": { name:"Ruijie Reyee 八口 PoE+ 网管交换机", shortDescription:"为摄像机、无线接入点及对讲设备提供云管理PoE连接。", description:"通过八个PoE+端口、简易云管理及拓扑工具，为小型安防网络供电并联网。", features:["八个PoE+端口","120W总PoE功率","云端管理","自动环路防护"] },
  "ajax-motioncam": { name:"Ajax MotionCam 室内移动侦测器", shortDescription:"无线移动防护，支持报警事件照片验证。", description:"通过快速照片验证确认报警原因，智能过滤可忽略宠物及日常活动。", features:["报警照片验证","可忽略20公斤以下宠物","加密无线连接","最长四年电池寿命"] },
  "tp-link-outdoor-ap": { name:"TP-Link Omada 户外 Wi-Fi 6 接入点", shortDescription:"将快速可靠的Wi-Fi延伸至庭院、仓库及户外摄像机。", description:"耐用的双频接入点，可在户外区域及复杂商业环境扩展托管Wi-Fi覆盖。", features:["Wi-Fi 6双频性能","IP67防风雨设计","PoE+供电","Omada集中管理"] },
  "western-digital-8tb": { name:"WD Purple 8TB 监控硬盘", shortDescription:"专为高要求全天候视频系统设计的大容量存储。", description:"为连续多摄像机工作负载而设计，提供充足容量，适合高分辨率系统及更长录像保留时间。", features:["8TB监控容量","全天候可靠性","支持多达64台摄像机","AllFrame技术"] },
  "uniview-thermal-sensor": { name:"Uniview 双光谱热成像摄像机", shortDescription:"热成像与可见光成像结合，用于周界及温度事件侦测。", description:"专业双传感器摄像机，可在低能见度条件下提供早期温度警报及可靠周界监控。", features:["热成像及光学传感器","温度异常警报","火灾及烟雾侦测","IP67户外防护"] },
};

const specKeys: Record<string,string> = { Resolution:"分辨率", Lens:"镜头", "Night vision":"夜视距离", Power:"供电", Warranty:"保修期", Compression:"视频压缩", Channels:"通道数", Storage:"存储", "Camera resolution":"摄像机分辨率", "Remote access":"远程访问", Connection:"连接方式", "Wireless range":"无线范围", Colour:"颜色", App:"应用程序", "Field of view":"视野", Audio:"音频", "Drive bays":"硬盘位", "Maximum storage":"最大存储", Output:"输出", Battery:"电池", Interface:"接口", Cache:"缓存", "Form factor":"规格", "PoE ports":"PoE端口", Camera:"摄像机", Display:"显示屏", "Door control":"门控", Ports:"端口", "PoE budget":"PoE功率", Management:"管理方式", Detection:"侦测", "Detection range":"侦测范围", "Viewing angle":"视角", "Photo resolution":"照片分辨率", Wireless:"无线规格", Bands:"频段", Mounting:"安装方式", Capacity:"容量", Workload:"工作负载", "Thermal resolution":"热成像分辨率", "Optical resolution":"光学分辨率" };
const valueZh = (value:string) => value.replace("included","内置").replace("Up to","最长").replace("open space","空旷环境").replace("Black","黑色").replace("Microphone","麦克风").replace("touch","触控").replace("Wall / pole","墙面 / 杆式").replace("Fire / intrusion","火灾 / 入侵").replace("Four","四").replace("years","年").replace("year","年");

export function localizeProduct(product: Product, language: "en" | "zh"): Product {
  if (language === "en" || !zh[product.id]) return product;
  const translated = zh[product.id];
  return { ...product, ...translated, specifications: Object.fromEntries(Object.entries(product.specifications).map(([key,value]) => [specKeys[key] ?? key, valueZh(value)])) };
}
