export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".cld-sync","favicon.svg","images/00-sb-logo-simple-white.svg","images/01-sb_cis_7.jpg","images/01_details_matter.jpg","images/01_lay_the_table-03.jpg","images/02-sb_aldo2.jpg","images/03_back_in_stock.jpg","images/04-sb_rise_1b.jpg","images/04_lay_the_table-04.jpg","images/05-sb_ka_1.jpg","images/05_come_together-02.jpg","images/06-sb_cis_2.jpg","images/06_shot_so_fresh.jpg","images/07-sb_cis_3.jpg","images/08-sb-boxts.jpg","images/09-sb_ka_3.jpg","images/10-sb_4.jpg","images/11-sb_2.jpg","images/12-sb-berlinb.jpg","images/13-sb_rise_4b.jpg","images/14-sb_cis_6.jpg","images/16-sb_boy_1.jpg","images/17-sb_cis_5.jpg","images/18-sb-denisets.jpg","images/19-sb_cis_9b.jpg","images/20-sb-rentree4.jpg","images/21-sb_cis_8.jpg","images/22-sb_rise_3.jpg","images/23-sb-aluminium3.jpg","images/24-sb_cis_10.jpg","images/ALTI_1.jpg","images/ALTI_2.jpg","images/ALTI_3.jpg","images/ALTI_4.jpg","images/ALTI_5.jpg","images/ALTI_6.jpg","images/CIS_1.jpg","images/CIS_2.jpg","images/CIS_3.jpg","images/CIS_4.jpg","images/CIS_5.jpg","images/CIS_6.jpg","images/CIS_7.jpg","images/CIS_7x.jpg","images/CIS_8.jpg","images/DT1_1.jpg","images/DT1_2.jpg","images/DT1_3.jpg","images/DT1_4.jpg","images/DT1_5.jpg","images/DT1_6.jpg","images/DT1_7.jpg","images/DT_2_1.jpg","images/DT_2_2.jpg","images/DT_2_3.jpg","images/DT_2_4.jpg","images/DT_2_5x.jpg","images/DT_2_6.jpg","images/DT_2_7.jpg","images/Fable_1.jpg","images/Fable_2.jpg","images/Fable_3.jpg","images/Fable_4.jpg","images/Fable_5.jpg","images/Fable_6.jpg","images/GHANA_1.jpg","images/GHANA_10.jpg","images/GHANA_11.jpg","images/GHANA_2.jpg","images/GHANA_3.jpg","images/GHANA_4.jpg","images/GHANA_5.jpg","images/GHANA_6.jpg","images/GHANA_7.jpg","images/GHANA_8.jpg","images/GHANA_9.jpg","images/HIRRS_1.jpg","images/HIRRS_2.jpg","images/HIRRS_3.jpg","images/HIRRS_4.jpg","images/HIRRS_5.jpg","images/HIRRS_6.jpg","images/HSCo_1.jpg","images/HSCo_2.jpg","images/HSCo_3.jpg","images/HSCo_4.jpg","images/HSCo_5.jpg","images/HSCo_6.jpg","images/HSCo_7.jpg","images/HSCo_Mag_1.jpg","images/HSCo_Mag_2.jpg","images/HSCo_Mag_3.jpg","images/HSCo_Mag_4.jpg","images/HSCo_Mag_5.jpg","images/HSCo_Mag_6.jpg","images/KOMBI_1.jpg","images/KOMBI_2.jpg","images/KOMBI_3.jpg","images/KOMBI_4.jpg","images/KOMBI_5.jpg","images/KOMBI_6.jpg","images/LB_1_1.jpg","images/LB_1_2.jpg","images/LB_1_3.jpg","images/LB_1_4.jpg","images/LB_1_5.jpg","images/LB_1_6.jpg","images/LB_2_1.jpg","images/LB_2_2.jpg","images/LB_2_3.jpg","images/LB_2_4.jpg","images/LB_2_5.jpg","images/LB_2_6.jpg","images/LB_2_7.jpg","images/LB_2_8.jpg","images/LOGO-Ai small_Super Bonjour smaller.svg","images/LOGO-Ai.svg","images/LOGO-Figma.svg","images/LOGOFACE-Ai.svg","images/LOUISE_1.jpg","images/LOUISE_2.jpg","images/LOUISE_3.jpg","images/LOUISE_4.jpg","images/More-regular.ttf","images/NIKE_1.jpg","images/NIKE_2.jpg","images/NIKE_3.jpg","images/NIKE_4.jpg","images/NIKE_5.jpg","images/NIKE_6.jpg","images/NP_1.jpg","images/NP_2.jpg","images/NP_6.jpg","images/NP_7.jpg","images/OD_1.jpg","images/OD_2.jpg","images/OD_3.jpg","images/OD_4.jpg","images/OD_5.jpg","images/OD_6.jpg","images/OD_7.jpg","images/Rise_1.jpg","images/Rise_2.jpg","images/Rise_3.jpg","images/Rise_4.jpg","images/Rise_5.jpg","images/Rise_6.jpg","images/SB—Logo FACE White.svg","images/SB—Logo White.svg","images/Saxx_1.jpg","images/Saxx_2.jpg","images/Saxx_3.jpg","images/Saxx_4.jpg","images/Saxx_5.jpg","images/Saxx_6.jpg","images/SuperBonjour.jpeg","images/dialog-center-mobile.jpeg","images/dialog-center.jpeg","images/dialog-icon-mobile.png","images/dialog-icon.png","images/fable-content.jpg","images/home-cursor.png","images/intro/image-0.jpg","images/intro/image-1.jpg","images/intro/image-2.jpg","images/intro/image-3.jpg","images/intro/image-4.jpg","images/intro/image-5.jpg","images/intro/logo.png","images/landing-accra.png","images/landing-rise.png","images/landing-wordmark.png","images/left-cursor.png","images/left-cursor.svg","images/mobile_super_bonjour.svg","images/peace_hand.svg","images/project-davids-tea-1.png","images/project-davids-tea-2.png","images/project-davids-tea-3.png","images/right-cursor.png","images/right-cursor.svg","videos/DT_2.mp4","videos/Fable_6.mp4","videos/LB_2_2v.mp4","videos/NIKE_6.mov","videos/NIKE_6.mp4","videos/NP_3.mp4","videos/NP_4.mp4","videos/NP_5.mp4","videos/NP_7.mov","videos/NP_7.mp4","videos/NP_8.mp4","videos/Rise_7.mp4","videos/video1.mov","videos/video2.mov","videos/video3.mov","videos/video4.mov","videos/video5.mp4","videos/video6.mp4","videos/video7.mp4","videos/video8.mp4"]),
	mimeTypes: {".svg":"image/svg+xml",".jpg":"image/jpeg",".ttf":"font/ttf",".jpeg":"image/jpeg",".png":"image/png",".mp4":"video/mp4",".mov":"video/quicktime"},
	_: {
		client: {"start":"_app/immutable/entry/start.vDqQAqBk.js","app":"_app/immutable/entry/app.C0fNTO9H.js","imports":["_app/immutable/entry/start.vDqQAqBk.js","_app/immutable/chunks/index.BzLGJncJ.js","_app/immutable/chunks/singletons.DvPYfcFk.js","_app/immutable/chunks/index.DhALg-Mm.js","_app/immutable/entry/app.C0fNTO9H.js","_app/immutable/chunks/preload-helper.C1FmrZbK.js","_app/immutable/chunks/index.BzLGJncJ.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
