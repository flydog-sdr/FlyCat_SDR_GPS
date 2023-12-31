// Copyright (c) 2016-2023 John Seamons, ZL4VO/KF6VO

var mfg = {
   ver_maj: 0,
   ver_min: 0,
   
   serno: 0,
   next_serno: -1,
   
   model_i: 1,    // KiwiSDR 2
   model: 2,
   cur_model: -1,
   MODEL_BIAS: 1,
   model_s: [ 'KiwiSDR 1', 'KiwiSDR 2' ],
   
   pie_size: 25,

   __last__: null
};

function mfg_main()
{
}

function mfg_msg(param)
{
   //console.log('mfg_msg: '+ param[0]);
   
   switch (param[0]) {

         case "keepalive":
				//console.log('MFG keepalive');
		      kiwi_clearTimeout(mfg.keepalive_timeoout);
            mfg.keepalive_rx_time = Date.now();
            mfg.keepalive_timeoout = setTimeout(function() {
         
               // in case the timeout somehow didn't get cancelled (which shouldn't happen)
               var diff = Date.now() - mfg.keepalive_rx_time;
               if (diff > 75000)
                  mfg_close();
            }, 90000);
				break;
   }
}

function mfg_close()
{
   // don't show message if reload countdown running
   kiwi_clearTimeout(mfg.keepalive_timeoout);
   if (kiwi.no_reopen_retry) {
	      w3_hide('id-kiwi-msg-container');      // in case password entry panel is being shown
         w3_show_block('id-kiwi-container');
         wait_then_reload_page(0, 'Server has closed connection.', 'mfg');
   } else
   if (isUndefined(adm.mfg_keepalive) || adm.mfg_keepalive == true) {
      if (!mfg.reload_rem) {
	      w3_hide('id-kiwi-msg-container');      // in case password entry panel is being shown
         w3_show_block('id-kiwi-container');
         //kiwi_show_msg('Server has closed connection.');
         //if (dbgUs) console.log('mfg close'); else
            wait_then_reload_page(60, 'Server has closed connection. Will retry.', 'mfg');
      }
   }
}

function kiwi_ws_open(conn_type, cb, cbp)
{
	return open_websocket(conn_type, cb, cbp, mfg_msg, mfg_recv, null, mfg_close);
}

function mfg_html()
{
	var s =
      w3_div('w3-container w3-section w3-dark-grey|width:800px',
         w3_div('w3-text-aqua',
            '<h4><strong>Manufacturing interface</strong>&nbsp;&nbsp;' +
            '<small>(software version v'+ mfg.ver_maj +'.'+ mfg.ver_min +')</small></h4>'
         ),

         w3_text('id-ee-status w3-bold'),
      
         w3_col_percent('w3-margin-T-8 w3-valign/',
            w3_div('id-ee-write w3-btn w3-round-large w3-margin-T-8||onclick="mfg_ee_write()"'), 45,
            '&nbsp;', 15,
            w3_button('id-power-off w3-css-magenta', 'click to halt<br>and power off', 'mfg_power_off'), 40
         ),
         '<br>',

         w3_col_percent('',
            w3_button('id-seq-override w3-yellow', '', 'mfg_seq_override'), 45,
            '<input id="id-seq-input" class="w3-input w3-border w3-width-auto w3-hover-shadow w3-hidden" type="text" size=4 onchange="mfg_seq_set()">', 15,
            w3_select('', 'write EEPROM with model:', '', 'mfg.model_i', mfg.model_i, mfg.model_s, 'mfg_model_cb'), 40
         ),
         '<hr>',

         w3_div('w3-valign',
            w3_button('w3-aqua', 'Click to write micro-SD card', 'sd_backup_click_cb'),

            w3_div('w3-margin-L-64',
               w3_div('id-sd-progress-container w3-progress-container w3-round-large w3-css-lightGray w3-show-inline-block',
                  w3_div('id-sd-progress w3-progressbar w3-round-large w3-light-green w3-width-zero',
                     w3_div('id-sd-progress-text w3-container')
                  )
               ),
            
               w3_inline('w3-margin-T-8/',
                  w3_div('id-sd-backup-time'),
                  w3_div('id-sd-backup-icon w3-margin-left'),
                  w3_div('id-sd-backup-msg w3-margin-left')
               )
            )
         ),
         '<hr>',

         w3_div('id-output-msg class-mfg-status w3-scroll-down w3-small')
      );
	
	var el = w3_innerHTML('id-mfg', s);
	el.style.top = el.style.left = '10px';

	w3_width_height('id-sd-progress-container', 300);
	w3_width_height('id-output-msg', null, 300);

   sd_backup_init();
   sd_backup_focus();
}

function mfg_model_cb(path, idx, first)
{
   mfg.model_i = +idx;
   mfg.model = mfg.model_i + mfg.MODEL_BIAS;
   mfg_set_button_text();
}

function mfg_recv(data)
{
	var stringData = arrayBufferToString(data);
	params = stringData.substring(4).split(" ");

	for (var i=0; i < params.length; i++) {
		param = params[i].split("=");
      console.log('mfg_recv: '+ param[0]);
		
		switch (param[0]) {     // #msg-proc
			case "ver_maj":
				mfg.ver_maj = parseFloat(param[1]);
				break;

			case "ver_min":
				mfg.ver_min = parseFloat(param[1]);
				mfg_html();
				break;

			case "serno":
				mfg.serno = parseFloat(param[1]);
				console.log("MFG next_serno="+ mfg.next_serno + " serno="+ mfg.serno);
				
				mfg_set_button_text();

				w3_innerHTML('id-seq-override', 'next serial number = #'+ mfg.next_serno +'<br>click to override');
				el = w3_remove('id-seq-input', 'w3-visible');
				el.value = mfg.next_serno;
			   mfg_set_status();
				break;
			
			case "next_serno":
				mfg.next_serno = parseFloat(param[1]);
				break;

			case "model":
			   mfg.cur_model = parseFloat(param[1]);
			   mfg_set_status();
				console.log("MFG cur_model="+ mfg.cur_model);
			   break;

			case "microSD_done":
				sd_backup_write_done(parseFloat(param[1]));
				break;

			default:
				console.log('MFG UNKNOWN: '+ param[0] +'='+ param[1]);
				break;
		}
	}
}

function mfg_set_status()
{
   var invalid = (mfg.cur_model == -1 || mfg.serno == -1);
   var status = invalid? '(invalid)' : ('KiwiSDR '+ mfg.cur_model +', #'+ mfg.serno);
   w3_innerHTML('id-ee-status', 'current EEPROM data: '+ status);
}

function mfg_set_button_text()
{
   var button_text;
   
   if (mfg.serno <= 0) {		// write serno = 0 to force invalid for testing
      //button_text = 'invalid, click to write EEPROM<br>with next serial number: '+ mfg.next_serno +
      //   '<br>and model: KiwiSDR '+ mfg.model;
      button_text = 'invalid, click to write EEPROM with:<br>model KiwiSDR '+ mfg.model +', #'+ mfg.next_serno;
      button_color = 'red';
   } else {
      //button_text = 'valid, serial number = '+ mfg.serno +'<br>click to change to '+ mfg.next_serno +
      //   '<br>and model: KiwiSDR '+ mfg.model;
      button_text = 'valid, click to change EEPROM to:<br>model KiwiSDR '+ mfg.model +', #'+ mfg.next_serno;
      button_color = '#4CAF50';		// w3-green
   }
   
   var el = w3_innerHTML('id-ee-write', button_text);
   w3_background_color(el, button_color);
}

function mfg_ee_write()
{
	ext_send("SET write model="+ mfg.model);
}

function mfg_seq_override()
{
	w3_add('id-seq-input', 'w3-visible');
}

function mfg_seq_set()
{
	mfg.next_serno = parseFloat(w3_el('id-seq-input').value).toFixed(0);
	if (mfg.next_serno >= 0 && mfg.next_serno <= 99999999) {
		ext_send("SET set_serno="+ mfg.next_serno);
		mfg_set_button_text();
	}
}

function mfg_power_off()
{
	var el = w3_innerHTML('id-power-off', 'halting and<br>powering off...');
	w3_background_color(el, 'red');
	ext_send("SET mfg_power_off");
}
