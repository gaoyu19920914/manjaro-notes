# manjaro-notes
Notes about Manjaro installation and settings, with a strong personal taste.
一些与 Manjaro 安装和设置有关的笔记。具有强烈的个人色彩。


# Prior to the installation 安装前的准备
1. If we are looking for a Windows+Linux dual boot, then first install Windows. 如果想安装 Windows+Linux 双系统，那么为了避免 Windows 搞乱磁盘分区，先安装 Windows。（这家伙不管三七二十一，不读取已有分区，不给用户选择的机会） 
2. Then boot in Windows, find Disk Management and make a new partition for Manjaro. Right click on the newly allocated partition, make sure the property 'partition style' of the new 'volume' is GPT.  然后在 Windows 中的 “磁盘管理” 划分并找到预留空间，点右键，查看属性，确定分区方法是GPT。
3. Then turn off the fast startup in Control Panel > Power Options > Choose what the power buttons do > uncheck 'Turn on fast startup (recommended)' （电源选项-选择按下电源键的作用-高级选项-取消勾选“打开快速启动”）
4. Then turn off the secure boot in the BIOS 然后关闭BIOS选项里的 secure boot

# Installation 安装过程
1. 初始页面：不管时间和时区，后面再调整，用默认的UTC就行，键盘就默认us，语言默认en_US。驱动要根据机器的配置情况判断：有旧的 Nvidia 显卡就选 no free，否则选 free 即可。然后选择 Boot，进入桌面。
2. 双击 Install Manjaro Linux，进入安装导航。（按以往经验，先不连接网络，后面设置镜像和更新源服务器，可能会更快）
3. Region: Asia; Zone: Shanghai; numbers and dates format: en_US.UTF-8 显示为American English (United States) 
4. 分区：选择替换分区（replace a partition），然后选取目标分区。这里会自动检测到 Windows 的100 MiB 的引导分区，并将其选中作为 EFI system partition 
5. 选择 LibreOffice 套件（或者不选，回头装 wps 或自己喜欢的办公软件）
6. 看一下 Summary 确认一下选项，点击安装
7. 安装完成。
8. 附上网上查到的已有 windows 的情况下的分区相关设置。其实选择替换分区就不用手动分区了。这里仅作参考，并未实际使用过。

	| 挂载点 | 磁盘格式 | 分区相关 | 标签 |
	| ---- | ---- | ---- | ---- |
	| /boot/efi | fat32 | 保留已有的 Windows 10 的启动分区（小于1 GB） | boot,esp |
	| /boot | ext4 | 1GB | boot |
	| / | ext4 | 剩下所有容量 | root |

9. 关于不要 swap 分区的说明：现有 linux 内核可以通过 swapfile 代替 swap 分区，并且更加灵活好调整，可在本文件中搜索 swapfile 知道如何设置、如何开关。

	```
	sudo fallocate -l 4G /swapfile 
	sudo mkswap /swapfile
	``` 
	参考[这个链接](https://wiki.manjaro.org/index.php?title=Swap#Using_a_Swapfile)。 

# After Installation 安装后的更改
1. 设定主板时间为当地时间，避免 Windows 和 linux 时间不同 
	system settings - time and date - hardware clock in local time zone
2. 设定显示全局缩放，从而显示适合的大小
	system settings - display and monitor - display configuration - global scale: 125% 
3. 更改更新服务器： 
	`sudo pacman-mirrors -i -c China -m rank`  
	然后勾选 ustc 的，再刷新缓存 
	`sudo pacman -Syy`
	参考[这个链接](https://mirrors.ustc.edu.cn/help/manjaro.html)
4. 添加 archlinuxcn 源（免于自己每次从源代码打包安装软件，前提是要信任这个源，例如用这个源安装 RStudio 就很方便） 
	参考[这个链接](https://mirrors.ustc.edu.cn/help/archlinuxcn.html)：
	在 /etc/pacman.conf 文件末尾添加两行（具体链接哪里都行，archlinuxcn 官方好像在欧洲也有服务器）：
	```sh
	[archlinuxcn]
	Server = https://mirrors.ustc.edu.cn/archlinuxcn/$arch
	```
	然后在 Add/Remove Software 中安装 `archlinuxcn-keyring` 包，以导入 GPG key。
5. 打开AUR、Snap、Flatpak
	（pamac - settings – preferences – AUR – enable and check for updates)
	（为后续装字体行便利，内容是否安全需要自己判断，因为是用户的源） 
	（这里我的取舍是先都打开，不过AUR放在最后用，另外两个都是官方发布渠道，可以放心安装，从来源的安全性讲，flatpak > snap > AUR ）
  （有关这个顺序，最近又有新的思考，优先 AUR 这种传统的软件渠道）
6. 添加中文语言 
	system settings - locale - add - 中文（中国）zh_CN.UTF-8 
7. 添加中文输入法（fcitx5），这一步可以多次重启，等待系统更新反应好。
	`sudo pacman -S fcitx5 fcitx5-chinese-addons fcitx5-qt fcitx5-gtk kcm-fcitx5 fcitx5-pinyin-moegirl fcitx5-pinyin-zhwiki`
	确保fctix5在运行，再在 system settings - personalization - regional settings - input method 更改（这一步等效于开始菜单中搜索并运行 fcitx5 configuration）
	如果重启后没有自动运行，可以在autostart中添加自启动（这一步新版fcitx5安装好后已不用手动添加）。
  输入法设置的部分参考了以下链接 Credits to these links about the settings of fcitx5 Input Method Engine(IME):
	[链接一](https://www.zhihu.com/question/333951476)，
  [链接二](https://blog.lhwcrt.top/tech/welcome-to-fcitx5/)，和
  [链接三](https://manateelazycat.github.io/linux/2020/06/19/fcitx5-is-awesome.html)
  [其他链接：Elementary OS 使用 ibus 拼音](https://elementaryos.stackexchange.com/questions/18121/elementary-os-5-0-juno-is-not-using-ibus-as-input-method)
  
8. 添加字体（中文的和英文的）
	- 英文：
		通过开机自动挂载 windows 10 分区，然后利用软链接载入字体。
		1. 挂载命令： 
			`sudo mkdir /windows`
			`sudo mount -t ntfs /dev/nvme0n1p3 /windows` (这一步注意看清楚磁盘名字。这里的nvme0n1p3要根据你的硬盘进行替换，找到安装 Windows 的硬盘)
			如果说已经挂载了（如在 Manjaro 文件管理器 Dolphin 点击过 Windows 磁盘），则可以右键 unmount，无需重启，重新挂载到 /windows 路径）。
      
		2. 链接：
			先创建新文件夹： 
			`sudo mkdir /usr/share/fonts/WindowsFonts` 
			再链接过去： 
			`sudo ln -s /windows/Windows/Fonts /usr/share/fonts/WindowsFonts` 
			然后刷新字体列表： 
			`fc-cache --force`
      
		3. 把mount写在启动命令中，（修改fstab文件实现）一劳永逸：
			1. 查看 windows 分区的 UUID 
				`lsblk -f`
			2. 将 Windows 分区直接挂载到目录下：
				`sudo vim /etc/fstab` 
      3. 修改文件末尾，添加一行 win 分区的挂载命令，比如挂载到 /windows： 
				`UUID=上一步查看到对应分区的UUID /windows ntfs noatime,rw,user,uid=1000,gid=1000,dmask=022,fmask=133,windows_names,auto 0 0`
  
	- 中文： 
		常规的 Linux 系统中文字体较为缺乏，可以自己安装。安装好后可以在 System settings-Appearance-Fonts 中统一设置为 Noto Sans CJK SC
		```sh
		sudo pacman -S ttf-roboto noto-fonts ttf-dejavu 
		sudo pacman -S wqy-bitmapfont wqy-microhei wqy-microhei-lite wqy-zenhei 
		sudo pacman -S noto-fonts-cjk adobe-source-han-sans-cn-fonts adobe-source-han-serif-cn-fonts
		```
		参考[链接](https://zhuanlan.zhihu.com/p/90634218)
	

9. 安装常用软件
	1. Zotero，NutStore（通过archlinuxcn），Koi（自动切换深色模式，通过AUR安装），Flameshot（临时截图贴图工具），NeteaseMusic（国内可以装。国外可用网页版+Tampermonkey脚本“网易云音乐高音质支持”，绕开版权限制），vim，wps-office，ttf-wps-fonts，org.kde.discover
	2. 以上可通过 pamac 或第4步，添加 archlinuxcn 源后搜索并点击按钮直接安装
		（注意事项：要先安装 jdk 才能给 LibreOffice 添加 Zotero 插件。
	3. 对 Linux 支持极差的软件的安装（如微信、TIM、qq）：
		1. 搜索 deepin-wine-wechat deepin-wine-qq 安装即可
		2. （旧版繁琐的 tim 安装方法）搜索 deepin.com.qq.office 安装，之后安装依赖：gnome-settings-daemon，然后复制 /etc/xdg/autostart/org.gnome.SettingsDaemon.Xsettings.desktop 到 /home/gaoyu/.config/autostart，然后在 system settings - Workspace - startup and shutdown - Autostart - 勾选  GNOME … plugin，然后点击 Advanced… 勾选 Autostart only in Plasma
		3. 以上均为 AUR 途径安装。
		4. deepin-wine 环境的优化 （这一步分在 deepin-wine5 不再需要）：
			（显示正常时可跳过）设置 wine 运行环境语言（当系统语言非中文时很重要，能避免方块tofu显示）
				`/opt/deepinwine/tools/run.sh` 中将 “WINE_CMD” 那一行修改为： 
				` WINE_CMD="LC_ALL=zh_CN.UTF-8 deepin-wine" `
		5. 设置 wine 应用的分辨率（这里以微信为例，其他软件自行更换路径）： 
				```
				env WINEPREFIX="$HOME/.deepinwine/Deepin-WeChat" deepin-wine5 winecfg
				```
			  在弹出窗口的wine设置-显示页面最底部，修改 DPI.
		6. （旧版 wine 的方法）设置 wine 字体替换： 
				`WINEPREFIX=~/.deepinwine/Deepin-XXXX/ deepin-wine regedit`
				找 HKEY_CURRENT_USER/Software/Wine/Fonts/Replacement 
		 
10. 连接设备的疑难杂症
	1. 设置蓝牙键盘开机登陆前自动连接（方便输入账号密码） 
	设置 `/etc/bluetooth/main.conf` 中的下面两行： 
	```
	[Policy] 
	AutoEnable=true
	``` 
	（无需再）安装 bltui blueman 进行高级设置
	2. 如果 HDMI 连接了支持耳机的显示器，却无法检测到音频设备，则需要输入 `systemctl --user restart pulseaudio` 临时解决
	3. 永久解决休眠后 HDMI 音频无响应：
		system settings - hardware - audio - advanced - Automatically switch all running streams when a new output becomes available - check
		如果还不行，可以继续参考[这里](https://wiki.archlinux.org/index.php/PulseAudio/Troubleshooting#No_sound_after_resume_from_suspend)进行设置。
	4. 多显示器分辨率问题解释：
		以 surface 外接 1920x1080 显示器为例（其中位置x轴向右，y轴向下，坐标为显示器左上角点的坐标。需要先计算最小总分辨率，设置为 --fb参数）
		运行 `xrandr --fb 3840x3984 --output eDP-1 --mode 2736x1824 --scale 1x1 --pos 0x2160 --output HDMI-1 --mode 1920x1080 --scale 2x2 --pos 0x0`。
		此时外接显示器 plasma 桌面可能仅有 1/4 大小（因为`--scale 2x2`，需要重新运行 `plasmashell` 进程，即可。
		（注意，通过此方法调整分辨率时，由于改变了总分辨率，因此触控屏无法“指哪打哪”）
	5. 多显示器分辨率解决：
		可将以下内容另存为 `dualscreen.sh` 
		
		```sh
		#!/bin/sh
		sleep 1
		xrandr --fb 3840x3984 --output eDP-1 --mode 2736x1824 --scale 1x1 --pos 0x2160 --output HDMI-1 --mode 1920x1080 --scale 2x2 --pos 0x0
		sleep 1
		killall plasmashell
		kstart5 plasmashell
		```
		
		将以下内容另存为 `singlescreen.sh`
		
		```sh
		#!/bin/sh
		xrandr --output HDMI-1 --off
		```
		需要时双击即可运行，也可以将 dualscreen.sh 通过`chmod +x dualscreen.sh`增加运行权限，然后再在 autostart 选中此文件，即可开机自动调整分辨率（只有连接了外接显示器，设置才有用）。
	6. 触控板锁屏后无法保持自然滚动，解决办法如下：
		1. `sudo vim /usr/share/X11/xorg.conf.d/40-libinput.conf`
		2. 在 `identifier "libinput pointer catchall"` 的 `Driver "libinput"` 后添加 `Option "NaturalScrolling" "on"` 
		3. 如果还不行，再在 identifier touchpad 部分同样添加这一句 `Option "NaturalScrolling" "on"` 
	7.  [enable camera on surface pro 6](https://github.com/linux-surface/linux-surface/wiki/Camera-Support) （不过这个成像质量真不行，发绿，而且目前Zoom和腾讯会议都无法检测到摄像头）
		1. 运行 cam -l 查看是否已经能够检测到摄像头
		2. 更改 `/etc/default/grub`中的`GRUB_CMDLINE_LINUX_DEFAULT`行，在其引号内末尾加入 `acpi_enforce_resources=lax`
		3. 跟教程，重启，装 `libcamera`
	8. surface pro 6 启动自动旋转屏幕：安装 `kded-rotation-git`

11. 设置自动关屏，为笔记本省电
	system settings - power management - energy saving - screen energy saving - check
	同时 设置 suspend session - Automatically Sleep after 5 min - check
12. 其他参考资料（链接均已失效，可搜索同名内容参考）：fcitx5的安装、Manjaro安装体验小结

13. 日常使用小技巧
	1. 解压： `unar *.zip -e GB2312` 以防打开中文环境生成的压缩包时出现乱码
	2. 如果 vim 每次退出后都提醒 `Warning: Color name "BACKGROUND" is not defined`，运行 `xrdb /dev/null` 一次，就OK了。
	3. firefox 设置触摸屏滚动（而非类似鼠标左键按下选中文字）
		1. `sudo -H vim /etc/environment`
		2. 添加一行`MOZ_USE_XINPUT2=1`
		3. 重启
		4. 设置自动导入 ris 文件到 zotero（针对nature.com等未能正确标明文件类型的网站）
			1. `vim ris-mime.xml`
			2. paste the following content into the file:
				```xml
				<?xml version="1.0"?>  
				<mime-info xmlns='http://www.freedesktop.org/standards/shared-mime-info'>  
				  <mime-type type="application/x-research-info-systems type">  
				      <comment>.ris file</comment>  
				      <glob pattern="*.ris"/>  
				  </mime-type>  
				</mime-info>  
				```
			3. `xdg-mime install ris-mime.xml` 注册一下

14. 美化
	1. 任务栏挪到上方，右键点击进入编辑模式-添加部件-下载 application title，并选择加粗，自定义桌面显示文字
	2. 安装 latte-dock替代任务栏
	3. 安装 fluent-dark 主题，图标、配色、鼠标
	4. 调整 workspace behavior-desktop effects，选中 torch 改为400ms，每个都看看，喜欢就打开。

15.  工作需要：装QIIME2
	1. 安装 Miniconda3
		1. `wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh`
		2. `bash Miniconda3-latest-Linux-x86_64.sh`
		3. 装在默认路径
		4. 选yes运行`conda init` 从而保证能够自动启动
		5. 新开terminal
		6. 设置[TUNA源](https://mirrors.tuna.tsinghua.edu.cn/help/anaconda/)
		7. `conda update conda`
	2. 装 QIIME2 2020.11
		```shell
		wget https://data.qiime2.org/distro/core/qiime2-2020.11-py36-linux-conda.yml
		conda env create -n qiime2-2020.11 --file qiime2-2020.11-py36-linux-conda.yml
		# OPTIONAL CLEANUP
		rm qiime2-2020.11-py36-linux-conda.yml
		```
	3. 使用
		`conda activate qiime2-2020.11`
	4. 分配 16G 的 [swapfile](https://wiki.manjaro.org/index.php?title=Swap#Using_a_Swapfile)
		1. 开
			```shell
			sudo fallocate -l 16G /swapfile
			sudo mkswap /swapfile
			sudo chmod u=rw,go= /swapfile
			sudo swapon /swapfile
			sudo bash -c "echo /swapfile none swap defaults 0 0 >> /etc/fstab"
			```
		2. 关
			```shell
			sudo swapoff /swapfile
			sudo rm /swapfile
			```
			then edit `/etc/fstab` to remove the mount of /swapfile as swap
