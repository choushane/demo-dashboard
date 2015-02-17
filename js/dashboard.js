// If dataTable with provided ID exists, destroy it.
function destroy_dataTable(table_id) {
    var table = $("#" + table_id);
    var ex = document.getElementById(table_id);
    if ($.fn.DataTable.fnIsDataTable(ex)) {
        table.hide().dataTable().fnClearTable();
        table.dataTable().fnDestroy();
    }
}

//DataTables
//Sort file size data.
jQuery.extend(jQuery.fn.dataTableExt.oSort, {
    "file-size-units": {
        K: 1024,
        M: Math.pow(1024, 2),
        G: Math.pow(1024, 3),
        T: Math.pow(1024, 4),
        P: Math.pow(1024, 5),
        E: Math.pow(1024, 6)
    },

    "file-size-pre": function (a) {
        var x = a.substring(0, a.length - 1);
        var x_unit = a.substring(a.length - 1, a.length);
        if (jQuery.fn.dataTableExt.oSort['file-size-units'][x_unit]) {
            return parseInt(x * jQuery.fn.dataTableExt.oSort['file-size-units'][x_unit], 10);
        }
        else {
            return parseInt(x + x_unit, 10);
        }
    },

    "file-size-asc": function (a, b) {
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    },

    "file-size-desc": function (a, b) {
        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    }
});

//DataTables
//Sort numeric data which has a percent sign with it.
jQuery.extend(jQuery.fn.dataTableExt.oSort, {
    "percent-pre": function (a) {
        var x = (a === "-") ? 0 : a.replace(/%/, "");
        return parseFloat(x);
    },

    "percent-asc": function (a, b) {
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    },

    "percent-desc": function (a, b) {
        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    }
});

//DataTables
//Sort IP addresses
jQuery.extend(jQuery.fn.dataTableExt.oSort, {
    "ip-address-pre": function (a) {
        // split the address into octets
        //
        var x = a.split('.');

        // pad each of the octets to three digits in length
        //
        function zeroPad(num, places) {
            var zero = places - num.toString().length + 1;
            return new Array(+(zero > 0 && zero)).join("0") + num;
        }

        // build the resulting IP
        var r = '';
        for (var i = 0; i < x.length; i++)
            r = r + zeroPad(x[i], 3);

        // return the formatted IP address
        //
        return r;
    },

    "ip-address-asc": function (a, b) {
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    },

    "ip-address-desc": function (a, b) {
        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    }
});

/*******************************
 Data Call Functions
 *******************************/

var dashboard = {};

function moduleData(module, onData,id) {
    var module_url = 'module.php?module=';

    $.getJSON(module_url + module + "&id=" + id)
    .done(function(data) {
        if (data.error) {
            console.log('Module error [' + module + ']', data.error);
        } else {
            onData(data.data);
        }
    });
}

dashboard.fillElement = function(module, $el){
    moduleData(module, function(data) {
        $el.text(data);
    });
};
dashboard.getPs = function () {
    moduleData("ps", function (data) {
        destroy_dataTable("ps_dashboard");
        $("#filter-ps").val("").off("keyup")
            .on("keyup", function () {
                psTable.fnFilter(this.value);
            });

        var psTable = $("#ps_dashboard").dataTable({
            aaData: data,
            aoColumns: [
                { sTitle: "USER" },
                { sTitle: "PID" },
                { sTitle: "%CPU" },
                { sTitle: "%MEM" },
                { sTitle: "VSZ" },
                { sTitle: "RSS" },
                { sTitle: "TTY" },
                { sTitle: "STAT" },
                { sTitle: "START" },
                { sTitle: "TIME" },
                { sTitle: "COMMAND" }
            ],
            bPaginate: true,
            sPaginationType: "full_numbers",
            bFilter: true,
            sDom: "lrtip",
            bAutoWidth: false,
            bInfo: false
        }).fadeIn();
    });
};

dashboard.getNetStat = function () {
    moduleData("netstat", function (data) {
        destroy_dataTable("netstat_dashboard");

        $("#netstat_dashboard").dataTable({
            aaData: data,
            aoColumns: [
                { sTitle: "Number of Connections" },
                { sTitle: "IP Address" }
            ],
            aaSorting: [
                [0, "desc"]
            ],
            iDisplayLength: 5,
            bPaginate: true,
            sPaginationType: "full_numbers",
            bFilter: true,
            sDom: "lrtip",
            bAutoWidth: false,
            bInfo: false
        }).fadeIn();
    });
};


dashboard.getUsers = function () {
    moduleData("users", function (data) {
        destroy_dataTable("users_dashboard");

        $("#users_dashboard").dataTable({
            aaData: data,
            aoColumns: [
                { sTitle: "Type" },
                { sTitle: "User" },
                { sTitle: "Home" }
            ],
            aaSorting: [
                [0, "desc"]
            ],
            iDisplayLength: 5,
            bPaginate: true,
            sPaginationType: "full_numbers",
            bFilter: false,
            bAutoWidth: false,
            bInfo: false
        }).fadeIn();
    });
    $("select[name='users_dashboard_length']").val("5");
};

dashboard.getOnline = function () {
    moduleData("online", function (data) {
        destroy_dataTable("online_dashboard");

        $("#online_dashboard").dataTable({
            aaData: data,
            aoColumns: [
                { sTitle: "Who" },
                { sTitle: "From" },
                { sTitle: "Login At" },
                { sTitle: "Idle" }
            ],
            aaSorting: [
                [0, "desc"]
            ],
            iDisplayLength: 5,
            bPaginate: true,
            sPaginationType: "full_numbers",
            bFilter: false,
            bAutoWidth: false,
            bInfo: false
        }).fadeIn();
    });
    $("select[name='online_dashboard_length']").val("5");
};

dashboard.getLastLog = function () {
    moduleData("lastlog", function (data) {
        destroy_dataTable("lastlog_dashboard");

        $("#lastlog_dashboard").dataTable({
            aaData: data,
            aoColumns: [
                { sTitle: "Who" },
                { sTitle: "From" },
                { sTitle: "When" }
            ],
            aaSorting: [
                [2, "desc"]
            ],
            iDisplayLength: 5,
            bPaginate: true,
            sPaginationType: "full_numbers",
            bFilter: false,
            bAutoWidth: false,
            bInfo: false
        }).fadeIn();
    });
    $("select[name='lastlog_dashboard_length']").val("5");
};

dashboard.page = function () {
    moduleData("page", function (data) {
	if(data)
	    $("#page").val(data);
    });
};
dashboard.temperature = function () {
    moduleData("temperature", function (data) {
	if($("#ttem").val() == 'C'){
   	    $("#T1").removeClass("F-64");
   	    $("#T1").addClass("C-64");
   	    $("#t1").removeClass("F-20");
   	    $("#t1").addClass("C-20");
   	    $("#t2").removeClass("F-20");
   	    $("#t2").addClass("C-20");
	    $("#temperature").text(data);
	}else{
   	    $("#T1").removeClass("C-64");
   	    $("#T1").addClass("F-64");
   	    $("#t1").removeClass("C-20");
   	    $("#t1").addClass("F-20");
   	    $("#t2").removeClass("C-20");
   	    $("#t2").addClass("F-20");
          var F=Number(data)*9/5 + 32;
	  $("#temperature").text(F.toFixed(1));
	}
    },$("#page").val());
};
dashboard.getCC1 = function () {
    moduleData("CC", function (data) {
	var x = 100-Number(data[0]);
	$("#c1").val(x.toFixed(2));
	$("#cc1").text(x.toFixed(2)+"%");
    },$("#page").val());
};
dashboard.getMem = function () {
    moduleData("MEM", function (data) {
	var total = Number(data['total']);
	var free = Number(data['free']);
	var aa = Number(data['active'])/total*100;
	var bb = Number(data['buffer'])/total*100;
	var cc = Number(data['free'])/total*100;
	var dd = Number(data['used'])/total*100;
	var ff = Number(data['inactive'])/total*100;
	if(total > 1024)
	{
	    total/=1024;
	    if(total > 1024)
	    {
	        total/=1024;
	        $("#total").text(total.toFixed(1) +"G");    
	    }else
	        $("#total").text(total.toFixed(1) +"M");    
	}
	if(free > 1024)
	{
	    free/=1024;
	    $("#free").text(free.toFixed(1) +"M");    
	}else
	{
	    $("#free").text(free.toFixed(1) +"K");    
	}
	$( "#active-bar" ).progressbar({
                value: Math.round(aa)
        });
	$( "#buffer-bar" ).progressbar({
                value: Math.round(bb)
        });
         $( "#free-bar" ).progressbar({
                value: Math.round(cc)
        });
         $( "#used-bar" ).progressbar({
                value:  Math.round(dd)
        });
         $( "#inactive-bar" ).progressbar({
                value:  Math.round(ff)
        });

	$('#ram').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            type: 'category',
            labels: {
                rotation: -45,
                style: {
                    fontSize: '8px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: ' '
            }
        },
legend: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        tooltip: {
            pointFormat: 'ram: <b>{point.y:.1f} %</b>'
        },
        series: [{
            data: [
                ['Used', Math.round(dd)],
                ['Active', Math.round(aa)],
                ['Inactive', Math.round(ff)],
                ['Buffer', Math.round(bb)],
                ['Free', Math.round(cc)],
            ],
        }]
    });


    },"1");
};
dashboard.getOK1 = function () {
    moduleData("OK", function (data) {
	if($("#m1"))
	{
	    if (data == "1")
	    {
		$("#m1").attr("class","online");
	    }else{
		$("#m1").attr("class","offline");
	    }
	}
    },"1");
};
var OK_2=0;
dashboard.getOK2 = function () {
    moduleData("OK", function (data) {
	if($("#m2"))
	{
	if (data == "1")
            {
                $("#m2").attr("class","online");
	   OK_2=0;
            }else{
                //$("#m2").attr("class","offline");
	   	OK_2++;
		if(OK_2 >5)
                    $("#m2").attr("class","offline");
            }
	}
    },"2");
};
var OK_3=0;
var OK_4=0;
var OK_5=0;
var OK_6=0;
dashboard.getOK3 = function () {
    moduleData("OK", function (data) {
	if($("#m3"))
	{
	if (data == "1")
            {
                $("#m3").attr("class","online");
	   OK_3=0;
            }else{
                //$("#m3").attr("class","offline");
	   	OK_3++;
		if(OK_3 >5)
                    $("#m3").attr("class","offline");
            }

	}
    },"3");
};
dashboard.getOK4 = function () {
    moduleData("OK", function (data) {
	if($("#m4"))
	{
		if (data == "1")
            {
                $("#m4").attr("class","online");
	   OK_4=0;
            }else{
                //$("#m3").attr("class","offline");
	   	OK_4++;
		if(OK_4 >5)
                    $("#m4").attr("class","offline");
            }

	}
    },"4");
};
dashboard.getOK5 = function () {
    moduleData("OK", function (data) {
	if($("#m5"))
	{
		if (data == "1")
            {
                $("#m5").attr("class","online");
OK_5=0;
            }else{
                //$("#m3").attr("class","offline");
                OK_5++;
                if(OK_5 >5)
                    $("#m5").attr("class","offline");
            }   

	}
    },"5");
};
dashboard.getOK6 = function () {
    moduleData("OK", function (data) {
	if($("#m6"))
	{
		if (data == "1")
            {
                $("#m6").attr("class","online");

OK_6=0;
            }else{
                //$("#m3").attr("class","offline");
                OK_6++;
                if(OK_6 >5)
                    $("#m6").attr("class","offline");
            }   

	}
    },"6");
};
dashboard.getdel = function () {
    moduleData("del", function (data) {
    });
};
dashboard.getCC2 = function () {
    moduleData("CC", function (data) {
	var x = 100-Number(data[1]);
	$("#c2").val(x.toFixed(2));
	$("#cc2").text($("#c2").val()+"%");
    },$("#page").val());
};
dashboard.getV = function () {
    var v = 0;
    var i = 0;
    moduleData("VV", function (data) {
	$("#vv").text(data+" V");
        v=Number(data);
    },$("#page").val());
    moduleData("II", function (data) {
	$("#ii").text(data+" mA");
        i=Number(data)/1000;
	var nn = v*i;
	if(nn > 0)
	    $("#ww").text(nn.toFixed(2) + "W");
    },$("#page").val());
    
};
dashboard.getI = function () {
};
dashboard.getSD = function () {
    moduleData("SD", function (data) {
	if(data)
	{
	    $('#mysd').html("");
	    $("#sd-total").text(data['total']);
	    $("#sd-free").text(data['free']);
	    $("#mysd").attr('data-percent',data['percent']);
	    $("#mysd").attr('data-text',data['percent']+"%");
	    $('#mysd').circliful();
	}
    },$("#page").val());
};
dashboard.getRam = function () {
    moduleData("mem", function (data) {
        var ram_total = data[1];
        var ram_used = Math.round((data[2] / ram_total) * 100);
        var ram_free = Math.round((data[3] / ram_total) * 100);

        $("#ram-total").text(ram_total);
        $("#ram-used").text(data[2]);
        $("#ram-free").text(data[3]);

        $("#ram-free-per").text(ram_free);
        $("#ram-used-per").text(ram_used);
    });
};

dashboard.getMemcached = function () {
    moduleData("memcached", function (data) {

        var i;
        var max = 0, read = 0, written = 0, used = 0;
        for(i=0;i<data.length;i++) {
            var parts = data[i].split(":") ;
            if (parts[0] == 'limit_maxbytes') {
                max = parts[1]/1024/1024;
            } else if (parts[0] == 'bytes_read') {
                read = parts[1]/1024/1024;
            } else if (parts[0] == 'bytes_written') {
                written = parts[1]/1024/1024;
            } else {
                used = parts[1]/1024/1024;
            }
        }
        used = Math.round(used);
        max = Math.round(max);

        var free = Math.round(max - used);
        var per_used = Math.round((used / max) * 100);
        var per_free = Math.round((free / max) * 100);

        $("#memcached-total").text(max);
        $("#memcached-used").text(used);
        $("#memcached-free").text(free);

        $("#memcached-free-per").text(per_free);
        $("#memcached-used-per").text(per_used);
    });
};

dashboard.getDf = function () {
    moduleData("df", function (data) {
        var table = $("#df_dashboard");
        var ex = document.getElementById("df_dashboard");
        if ($.fn.DataTable.fnIsDataTable(ex)) {
            table.hide().dataTable().fnClearTable();
            table.dataTable().fnDestroy();
        }

        table.dataTable({
            aaData: data,
            aoColumns: [
                { sTitle: "Filesystem" },
                { sTitle: "Size", sType: "file-size" },
                { sTitle: "Used", sType: "file-size" },
                { sTitle: "Avail", sType: "file-size" },
                { sTitle: "Use%", sType: "percent" },
                { sTitle: "Mounted" }
            ],
	    iDisplayLength: 5,
            bPaginate: true,
            sPaginationType: "full_numbers",
            bFilter: false,
            bAutoWidth: true,
            bInfo: false
        }).fadeIn();
    });
};

dashboard.getArp = function () {
    moduleData("arp", function (data) {
        var table = $("#arp_dashboard");
        var ex = document.getElementById("arp_dashboard");
        if ($.fn.DataTable.fnIsDataTable(ex)) {
            table.hide().dataTable().fnClearTable();
            table.dataTable().fnDestroy();
        }

        table.dataTable({
            aaData: data,
            aoColumns: [
                { sTitle: "Address" },
                { sTitle: "HWtype" },
                { sTitle: "HWaddress"},
                { sTitle: "Flags Mask" },
                { sTitle: "Iface"}
            ],
            iDisplayLength: 5,
            bPaginate: true,
            bFilter: false,
            bAutoWidth: false,
            bInfo: false
        }).fadeIn();
    });
};

dashboard.getWhereIs = function () {
    moduleData("where", function (data) {
        var table = $("#whereis_dashboard");
        var ex = document.getElementById("whereis_dashboard");
        if ($.fn.DataTable.fnIsDataTable(ex)) {
            table.hide().dataTable().fnClearTable();
            table.dataTable().fnDestroy();
        }

        table.dataTable({
            aaData: data,
            aoColumns: [
                { sTitle: "Software" },
                { sTitle: "Installation" }
            ],
            sPaginationType: "full_numbers",
            iDisplayLength: 5,
            bFilter: false,
            aaSorting: [
                [1, "desc"]
            ],
            bAutoWidth: false,
            bInfo: false
        }).fadeIn();
    });
};

dashboard.getOs = function () {
    this.fillElement("issue", $("#os-info"));
    this.fillElement("hostname", $("#os-hostname"));
    this.fillElement("time", $("#os-time"));
    this.fillElement("uptime", $("#os-uptime"));
};

dashboard.getIp = function () {
    moduleData("ip", function (data) {
        destroy_dataTable("ip_dashboard");
        $("#ip_dashboard").dataTable({
            aaData: data,
            aoColumns: [
                { sTitle: "Interface" },
                { sTitle: "IP" }
            ],
            iDisplayLength: 5,
            bPaginate: true,
            sPaginationType: "two_button",
            bFilter: false,
            bAutoWidth: true,
            bInfo: false
        }).fadeIn();
    });
};

dashboard.getPing = function () {
    var refreshIcon = $('#refresh-ping .icon-refresh');
    refreshIcon.addClass('icon-spin');

    moduleData("ping", function (data) {
        destroy_dataTable("ping_dashboard");

        $("#ping_dashboard").dataTable({
            aaData: data,
            aoColumns: [
                { sTitle: "Host" },
                { sTitle: "Time (in ms)" }
            ],
            aaSorting: [
                [0, "desc"]
            ],
            bPaginate: true,
            sPaginationType: "full_numbers",
            bFilter: true,
            sDom: "lrtip",
            bAutoWidth: false,
            bInfo: false
        }).fadeIn();

        refreshIcon.removeClass('icon-spin');
    });
};

dashboard.getIspeed = function () {
    var rateUpstream = $("#ispeed-rate-upstream");
    var rateDownstream = $("#ispeed-rate-downstream");
    var refreshIcon = $("#refresh-ispeed .icon-refresh");

    // 0 = KB
    // 1 = MB
    var AS = 0;
    var power = AS + 1;
    var result = { 'upstream' :0, 'downstream':0};

    refreshIcon.addClass('icon-spin');

    moduleData("speed", function(data) {
        // round the speed (float to int);
        // dependent on value of AS, calculate speed in MB or KB ps
        result['upstream'] = Math.floor((data['upstream'] / (Math.pow(1024, power))));
        result['downstream'] = Math.floor((data['downstream'] / (Math.pow(1024, power))));
        // update rate of speed on widget
        rateUpstream.text(result['upstream']);
        rateDownstream.text(result['downstream']);

        refreshIcon.removeClass('icon-spin');
    });

    // update unit value in widget
    var leadUpstream = rateUpstream.next(".lead");
    var leadDownstream = rateDownstream.next(".lead");
    leadUpstream.text(AS ? "MB/s" : "KB/s");
    leadDownstream.text(AS ? "MB/s" : "KB/s");
};

dashboard.getSabspeed = function () {
    var rateDownstream = $("#sabspeed-rate-downstream");
    var refreshIcon = $("#refresh-sabspeed .icon-refresh");

    // 0 = KB
    // 1 = MB
    var AS = 0;
    var power = AS;
    var result = { 'downstream' :0};

    refreshIcon.addClass('icon-spin');

    moduleData('sabnzbd', function(data) {
        // round the speed (float to int);
        // dependent on value of AS, calculate speed in MB or KB ps
        result['downstream'] = Math.floor((data['downstream'] / (Math.pow(1024, power))));
        // update rate of speed on widget
        rateDownstream.text(result['downstream']);

        refreshIcon.removeClass('icon-spin');
    });

    // update unit value in widget
    var leadDownstream = rateDownstream.next(".lead");
    leadDownstream.text(AS ? "MB/s" : "KB/s");
};

dashboard.getLoadAverage = function () {
    moduleData("loadavg", function (data) {
        $("#cpu-1min").text(data[0][0]);
        $("#cpu-5min").text(data[1][0]);
        $("#cpu-15min").text(data[2][0]);
        $("#cpu-1min-per").text(data[0][1]);
        $("#cpu-5min-per").text(data[1][1]);
        $("#cpu-15min-per").text(data[2][1]);
    });
    this.fillElement("numberofcores", $("#core-number"));
};

dashboard.getDnsmasqLeases = function () {
    moduleData("dhcpleases", function (data) {
        var table = $("#dnsmasqleases_dashboard");
        var ex = document.getElementById("dnsmasqleases_dashboard");
        if ($.fn.DataTable.fnIsDataTable(ex)) {
            table.hide().dataTable().fnClearTable();
            table.dataTable().fnDestroy();
        }

        table.dataTable({
            aaData: data,
            aoColumns: [
                { sTitle: "Expires At" },
                { sTitle: "MAC Address" },
                { sTitle: "IP Address", sType: "ip-address" },
                { sTitle: "Hostname" }
            ],
            bPaginate: false,
            bFilter: false,
            bAutoWidth: true,
            bInfo: false
        }).fadeIn();
    });
};

dashboard.getBandwidth = function () {
    var refreshIcon = $('#refresh-bandwidth .icon-refresh');
    refreshIcon.addClass('icon-spin');

    moduleData('bandwidth', function (data) {
        $('#bw-int').text(data['0'].interface + ":");
        $('#bw-tx').text(data['0'].tx);
        $('#bw-rx').text(data['0'].rx);

        refreshIcon.removeClass('icon-spin');
    });

};

dashboard.getSwaps = function () {
    moduleData("swap", function (data) {
        var table = $("#swap_dashboard");
        var ex = document.getElementById("swap_dashboard");
        if ($.fn.DataTable.fnIsDataTable(ex)) {
            table.hide().dataTable().fnClearTable();
            table.dataTable().fnDestroy();
        }

        table.dataTable({
            aaData: data,
            aoColumns: [
                { sTitle: "Filename" },
                { sTitle: "Type"},
                { sTitle: "Size", sType: "file-size" },
                { sTitle: "Used", sType: "file-size" },
                { sTitle: "Priority"}
            ],
	    iDisplayLength: 5,
            bPaginate: true,
            bFilter: false,
            bAutoWidth: true,
            bInfo: false
        }).fadeIn();

    });

};


dashboard.redis = function () {
    moduleData("redis_status", function (data) {

        if (data.length == 0)
		{
			$('#redis-installed').addClass('hide');
			$('#redis-not').removeClass('hide');
		}
		else
		{
			$('#version-info').html(data['redis_version']);
			$('#cc-info').html(data['connected_clients']);
			$('#cs-info').html(data['connected_slaves']);
			$('#memory-info').html(data['used_memory_human']);
			$('#totc-info').html(data['total_connections_received']);
			$('#totcp-info').html(data['total_commands_processed']);

			$('#redis-installed').removeClass('hide');
			$('#redis-not').addClass('hide');
		}
	});
};

/**
 * Refreshes all widgets. Does not call itself recursively.
 */
dashboard.getAll = function () {
    for (var item in dashboard.fnMap) {
        if (dashboard.fnMap.hasOwnProperty(item) && item !== "all") {
            try {
                dashboard.fnMap[item].call(dashboard);
            } catch (err) {
            }
        }
    }
};

dashboard.fnMap = {
    page:dashboard.page,
    all: dashboard.getAll,
    mem: dashboard.getMem,
    del: dashboard.getdel,
    cpu1:dashboard.getCC1,
    OK_1:dashboard.getOK1,
    OK_2:dashboard.getOK2,
    OK_3:dashboard.getOK3,
    OK_4:dashboard.getOK4,
    OK_5:dashboard.getOK5,
    OK_6:dashboard.getOK6,
    cpu2:dashboard.getCC2,
    temperature:dashboard.temperature,
    V:dashboard.getV,
    //I:dashboard.getI,
    SD:dashboard.getSD,
//    ps: dashboard.getPs,
//    df: dashboard.getDf,
    os: dashboard.getOs,
//    users: dashboard.getUsers,
//    online: dashboard.getOnline,
//    lastlog: dashboard.getLastLog,
//    whereis: dashboard.getWhereIs,
//    ip: dashboard.getIp,
//    ispeed: dashboard.getIspeed,
//    sabspeed: dashboard.getSabspeed,
    //cpu: dashboard.getLoadAverage,
/*  
    netstat: dashboard.getNetStat,
    dnsmasqleases: dashboard.getDnsmasqLeases,
    bandwidth: dashboard.getBandwidth,
    ping: dashboard.getPing,
    swap: dashboard.getSwaps,
    arp: dashboard.getArp,
    redis: dashboard.redis
*/
};
