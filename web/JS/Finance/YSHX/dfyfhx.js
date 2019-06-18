﻿
//-----------------------------------------------------------全局变量-----------------------------------------------------------------
var pageSize = 15;

//-----------------------------------------------------------数据源-------------------------------------------------------------------
//预付store
var yfStore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
        { name: 'isbj' },
        { name: 'isxz' },
        { name: 'id' },
        { name: 'yundan_id' },
        { name: 'yundanNum' },
        { name: 'zhuangchedanNum' },
        { name: 'moneyDaofu' },
        { name: 'yhxmoney' },
        { name: 'whxmoney' },
        { name: 'hxje' },
        { name: 'incomeDate' },
        { name: 'officeId' },
        { name: 'officeName' },
        { name: 'fahuoPeople' },
        { name: 'fahuoTel' },
        { name: 'shouhuoPeople' },
        { name: 'shouhuoTel' },
        { name: 'shouhuoAddress' },
        { name: 'ddofficeName' },
        { name: 'songhuoType' },
        { name: 'payType' },
        { name: 'moneyYunfei' },
        { name: 'UserName' },
        { name: 'memo' }
    ],
    onPageChange: function (sto, nPage, sorters) {
        getyfList(nPage);
    }
});

//选中运单
var selYdStore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'isbj' },
        { name: 'isxz' },
        { name: 'id' },
        { name: 'yundan_id' },
        { name: 'yundanNum' },
        { name: 'zhuangchedanNum' },
        { name: 'moneyDaofu' },
        { name: 'yhxmoney' },
        { name: 'whxmoney' },
        { name: 'hxje' },
        { name: 'incomeDate' },
        { name: 'officeId' },
        { name: 'officeName' },
        { name: 'fahuoPeople' },
        { name: 'fahuoTel' },
        { name: 'shouhuoPeople' },
        { name: 'shouhuoTel' },
        { name: 'shouhuoAddress' },
        { name: 'ddofficeName' },
        { name: 'songhuoType' },
        { name: 'payType' },
        { name: 'moneyYunfei' },
        { name: 'UserName' },
        { name: 'memo' }
    ],
    data: [
    ]
});

//办事处store
var bscStore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'officeId' },
        { name: 'officeName' }
    ]
});

//-----------------------------------------------------------页面方法-----------------------------------------------------------------
//获取预付运费核销
function getyfList(nPage) {
    var hxzt = "";//Ext.getCmp("cx_hxzt").getValue();
    var bscid = Ext.getCmp("cx_bsc").getValue();
    var kssj = Ext.getCmp("start_time").getValue();
    var jssj = Ext.getCmp("end_time").getValue();
    var fhr = Ext.getCmp("cx_people").getValue();
    var ydbh = Ext.getCmp("cx_yundannum").getValue();
    CS('CZCLZ.Finance.GetDfyfHxListByPage', function (retVal) {
        yfStore.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize, hxzt, bscid, kssj, jssj, fhr, ydbh);
}

//-----------------------------------------------------------界    面-----------------------------------------------------------------
Ext.define('iViewport', {
    extend: 'Ext.container.Viewport',

    layout: {
        type: 'border'
    },

    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'gridpanel',
                    region: 'center',
                    id: 'yfgrid',
                    store: yfStore,
                    columnLines: true,
                    selModel: Ext.create('Ext.selection.CheckboxModel', {
                        checkOnly: true,
                        listeners: {
                            //选择
                            select: function (model, record, index) {
                                //预存
                                var n = 1;
                                if (selYdStore.data.length > 0) {
                                    for (var i = 0; i < selYdStore.data.length; i++) {
                                        if (selYdStore.data.items[i].data.id == record.data.id) {
                                            n--;
                                            selYdStore.data.items[i].data.hxje = record.data.hxje;
                                        }
                                    }
                                }
                                if (n == 1) {
                                    selYdStore.add(record.data);
                                }
                                //未核、实核总计
                                var whje = 0;//未核销金额
                                if (record.data.whxmoney != '' && record.data.whxmoney != null) {
                                    whje = record.data.whxmoney;
                                }
                                var szwhx = 0;
                                if (Ext.getCmp('sz_whx') != '0' && Ext.getCmp('sz_whx') != '') {
                                    szwhx = Ext.getCmp('sz_whx')
                                }
                                Ext.getCmp('sz_whx').setValue(szwhx + whje);

                                var dhje = 0;//本次核销金额
                                if (record.data.hxje != '' && record.data.hxje != null) {
                                    dhje = record.data.hxje;
                                }
                                var szshx = 0;
                                if (Ext.getCmp('sz_shx') != '0' && Ext.getCmp('sz_shx') != '') {
                                    szshx = Ext.getCmp('sz_shx')
                                }
                                Ext.getCmp('sz_shx').setValue(szshx + dhje);
                            },
                            deselect: function (model, record, index) {//取消选中时产生的事件

                                //预存
                                for (var i = 0; i < selYdStore.data.length; i++) {
                                    if (selYdStore.data.items[i].data.id == record.data.id) {
                                        selYdStore.remove(selYdStore.data.items[i]);
                                    }
                                }
                                console.log(selYdStore);
                            }
                        }
                    }),
                    plugins: [
                        Ext.create('Ext.grid.plugin.CellEditing', {
                            clicksToEdit: 1,
                            listeners: {
                                'beforeedit': function (editor, c, e) {
                                    Ext.getCmp('yfgrid').getSelectionModel().setLocked(true);
                                },
                                'edit': function (editor, c, e) {
                                    Ext.getCmp('yfgrid').getSelectionModel().setLocked(false);
                                }
                            }
                        })
                    ],
                    columns: [
                        Ext.create('Ext.grid.RowNumberer'),
                            {
                                xtype: 'gridcolumn',
                                text: '操作',
                                dataIndex: 'yundan_id',
                                width: 90,
                                sortable: false,
                                menuDisabled: true,
                                align: "center",
                                renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                    var str;
                                    str = "<a onclick='LookGoods(\"" + value + "\");'>查看货物</a>";
                                    return str;
                                }
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'yundanNum',
                                sortable: false,
                                menuDisabled: true,
                                text: "运单号",
                                width: 90
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'zhuangchedanNum',
                                sortable: false,
                                menuDisabled: true,
                                text: "装车单号",
                                width: 90
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'moneyDaofu',
                                sortable: false,
                                menuDisabled: true,
                                text: "到付",
                                width: 90
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'yhxmoney',
                                sortable: false,
                                menuDisabled: true,
                                text: "已核销",
                                width: 90
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'whxmoney',
                                sortable: false,
                                menuDisabled: true,
                                text: "未核销",
                                width: 90
                            },
                            {
                                header: "本次核销",
                                width: 100,
                                sortable: false,
                                dataIndex: 'hxje',
                                menuDisabled: true,
                                xtype: 'numbercolumn',
                                editor: {
                                    xtype: "numberfield",
                                    allowNegative: false,
                                    selectOnFocus: true
                                },
                                align: "center"
                            },
                            {
                                xtype: 'datecolumn',
                                dataIndex: 'incomeDate',
                                width: 90,
                                format: 'Y-m-d',
                                text: '最新核销时间',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'officeName',
                                sortable: false,
                                menuDisabled: true,
                                text: "办事处",
                                width: 90
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'fahuoPeople',
                                sortable: false,
                                menuDisabled: true,
                                text: "发货人",
                                width: 90
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'fahuoTel',
                                sortable: false,
                                menuDisabled: true,
                                text: "发货电话",
                                width: 90
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'shouhuoPeople',
                                sortable: false,
                                menuDisabled: true,
                                text: "收货人",
                                width: 90
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'shouhuoTel',
                                sortable: false,
                                menuDisabled: true,
                                text: "收货电话",
                                width: 90
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'shouhuoAddress',
                                sortable: false,
                                menuDisabled: true,
                                text: "收货地址",
                                width: 90
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'ddofficeName',
                                sortable: false,
                                menuDisabled: true,
                                text: "到达站",
                                width: 90
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'songhuoType',
                                sortable: false,
                                menuDisabled: true,
                                text: "送货方式",
                                width: 90,
                                renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                    if (value == 0) {
                                        return "自提";
                                    } else {
                                        return "送货";
                                    }
                                }
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'payType',
                                sortable: false,
                                menuDisabled: true,
                                text: "结算方式",
                                width: 130,
                                renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                    var str = "";
                                    if (value == 11) {
                                        str = "现金";
                                    } else if (value == 1) {
                                        str = "欠付";
                                    } else if (value == 2) {
                                        str = "到付";
                                    } else if (value == 3) {
                                        str = "回单付";
                                    } else if (value == 4) {
                                        str = "现付+欠付";
                                    } else if (value == 5) {
                                        str = "现付+到付";
                                    } else if (value == 6) {
                                        str = "到付+欠付";
                                    } else if (value == 7) {
                                        str = "现付+回单付";
                                    } else if (value == 8) {
                                        str = "欠付+回单付";
                                    } else if (value == 9) {
                                        str = "到付+回单付";
                                    } else if (value == 10) {
                                        str = "现付+到付+欠付";
                                    }
                                    return str;
                                }
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'moneyYunfei',
                                sortable: false,
                                menuDisabled: true,
                                text: "运费",
                                width: 90
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'UserName',
                                sortable: false,
                                menuDisabled: true,
                                text: "制单人",
                                width: 90
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'memo',
                                sortable: false,
                                menuDisabled: true,
                                text: "备注",
                                width: 90
                            }
                    ],
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'top',
                            items: [
                                {
                                    xtype: 'buttongroup',
                                    items: [
                                        {
                                            xtype: "button",
                                            text: "未核销",
                                            arrowAlign: "right",
                                            id: 'cx_hxzt2',
                                            width: 100,
                                            menu: [
                                                {
                                                    text: "所有",
                                                    handler: function () {
                                                        Ext.getCmp('cx_hxzt2').setText('所有');
                                                        Ext.getCmp('hxsz').hide();
                                                        Ext.getCmp('cx_hxzt').setValue('');
                                                        Ext.getCmp('saveHx').hide();
                                                        getyfList(1);
                                                    }
                                                },
                                                {
                                                    text: "未核销",
                                                    handler: function () {
                                                        Ext.getCmp('cx_hxzt2').setText('未核销');
                                                        Ext.getCmp('hxsz').show();
                                                        Ext.getCmp('cx_hxzt').setValue('0');
                                                        Ext.getCmp('saveHx').show();
                                                        getyfList(1);
                                                    }
                                                },
                                                {
                                                    text: "已核销",
                                                    handler: function () {
                                                        Ext.getCmp('cx_hxzt2').setText('已核销');
                                                        Ext.getCmp('hxsz').hide();
                                                        Ext.getCmp('cx_hxzt').setValue('1');
                                                        Ext.getCmp('saveHx').hide();
                                                        getyfList(1);
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'combobox',
                                    labelAlign: 'right',
                                    displayField: 'text',
                                    valueField: 'val',
                                    queryMode: 'local',
                                    id: 'cx_hxzt',
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['val', 'text'],
                                        data: [
                                            { "val": "", "text": "所有" },
                                            { "val": "0", "text": "未核销" },
                                            { "val": "1", "text": "已核销" }
                                        ]
                                    }),
                                    hidden: true,
                                    value: '0'
                                },
                                {
                                    xtype: 'buttongroup',
                                    title: '',
                                    items: [
                                        {
                                            xtype: "button",
                                            text: "选中运单",
                                            iconCls: "add",
                                            arrowAlign: "right",
                                            menu: [
                                                {
                                                    text: "导出excel",
                                                    handler: function () {

                                                    }
                                                },
                                                {
                                                    text: "核销日志",
                                                    handler: function () {
                                                        if (selYdStore.data.items.length != 1) {
                                                            Ext.Msg.alert('提示', "请单个选择查询。");
                                                            return;
                                                        }
                                                        var win = new LogWin();
                                                        win.show(null, function () {
                                                            var id = selYdStore.data.items[0].data.id;
                                                            CS('CZCLZ.Finance.GetHxLog', function (retVal) {
                                                                logStore.loadData(retVal);
                                                            }, CS.onError, id);
                                                        });
                                                    }
                                                },
                                                {
                                                    text: "清除核销",
                                                    handler: function () {
                                                        Ext.MessageBox.confirm('确认', '取消核销将删除所有的核销收款记录,确认吗?', function (btn) {
                                                            if (btn == 'yes') {
                                                                for (var i = 0; i < selYdStore.data.items.length; i++) {
                                                                    var id = selYdStore.data.items[i].data.id;
                                                                    var ydid = selYdStore.data.items[i].data.yundan_id;
                                                                    CS('CZCLZ.Finance.DeleteIncomeHxLog', function (retVal) {
                                                                        getyfList(1);
                                                                    }, CS.onError, "3", id, ydid);
                                                                }
                                                            }
                                                        });
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'buttongroup',
                                    items: [
                                        {
                                            xtype: "button",
                                            text: "保存核销结果",
                                            iconCls: "save",
                                            id: 'saveHx',
                                            handler: function () {
                                                var xzlist = [];
                                                for (var i = 0; i < selYdStore.data.items.length; i++) {
                                                    var whx = selYdStore.data.items[i].data.whxmoney;
                                                    var hxje = selYdStore.data.items[i].data.hxje;
                                                    if (whx < hxje) {
                                                        Ext.Msg.alert('提示', "运单【" + gx[i].data.yundanNum + "】本次核销金额大于未核销金额。");
                                                        return;
                                                    } else {
                                                        xzlist.push(selYdStore.data.items[i].data);
                                                    }
                                                }
                                                var shxjg = Ext.getCmp('sz_shx').getValue();//
                                                var yhxjg = Ext.getCmp('sz_yhx').getValue();//
                                                var hxrq = Ext.getCmp('sz_hxrq').getValue(); //
                                                if (shxjg != yhxjg) {
                                                    Ext.Msg.alert('提示', "实核金额和应核金额不符，请重新分摊！");
                                                    return;
                                                }
                                                if (hxrq == '') {
                                                    Ext.Msg.alert('提示', "日期必填！");
                                                    return;
                                                }
                                                CS('CZCLZ.Finance.SaveDFYFHx', function (retVal) {
                                                    if (retVal) {
                                                        Ext.Msg.show({
                                                            title: '提示',
                                                            msg: '保存成功!',
                                                            buttons: Ext.MessageBox.OK,
                                                            icon: Ext.MessageBox.INFO
                                                        });
                                                        getyfList(1);
                                                    }
                                                }, CS.onError, xzlist, hxrq);
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            layout: {
                                type: 'column'
                            },
                            margin: '0 20 0 20',
                            border: false,
                            id: 'hxsz',
                            items: [
                                {
                                    xtype: 'textfield',
                                    id: 'sz_whx',
                                    width: 160,
                                    labelWidth: 100,
                                    height: 30,
                                    fieldLabel: '未核总额',
                                    columnWidth: 0.5,
                                    padding: '5 10 5 10',
                                    readOnly: true,
                                    fieldStyle: 'background-color: Gainsboro;background-image: none;'
                                },
                                {
                                    xtype: 'textfield',
                                    id: 'sz_shx',
                                    width: 160,
                                    labelWidth: 100,
                                    height: 30,
                                    fieldLabel: '实核总额',
                                    columnWidth: 0.5,
                                    padding: '5 10 5 10',
                                    readOnly: true,
                                    fieldStyle: 'background-color: Gainsboro;background-image: none;'
                                },
                                {
                                    xtype: 'textfield',
                                    id: 'sz_yhx',
                                    width: 160,
                                    labelWidth: 100,
                                    height: 30,
                                    fieldLabel: '应核销金额',
                                    columnWidth: 0.4,
                                    padding: '5 0 5 10'
                                },
                                {
                                    xtype: 'button',
                                    text: '分摊',
                                    columnWidth: 0.09,
                                    margin: '5 0 0 0 ',
                                    height: 30,
                                    handler: function () {
                                        var ftjg = Ext.getCmp('sz_yhx').getValue();//分摊金额
                                        var jfje = ftjg;//金额计费
                                        var grid = Ext.getCmp('yfgrid');
                                        var gx = grid.getSelectionModel().getSelection();
                                        for (var i = 0; i < gx.length; i++) {
                                            var h = grid.getStore().indexOf(gx[i]);
                                            var whx = grid.store.getAt(h).data.whxmoney;
                                            var je = 0;//实际运单核销金额
                                            var id = grid.store.getAt(h).data.id;
                                            if (jfje > 0) {
                                                if (jfje >= whx) {
                                                    je = whx;
                                                    jfje -= whx;
                                                } else {
                                                    je = jfje;
                                                    jfje = 0;
                                                }
                                            }
                                            grid.store.getAt(h).set('hxje', je);

                                            for (var b = 0; b < selYdStore.data.length; b++) {
                                                if (selYdStore.data.items[b].data.id == id) {
                                                    selYdStore.data.items[b].data.hxje = je;
                                                }
                                            }
                                        }
                                        Ext.getCmp('sz_shx').setValue(ftjg - jfje);
                                    }
                                },
                                {
                                    xtype: 'datefield',
                                    id: 'sz_hxrq',
                                    width: 160,
                                    labelWidth: 100,
                                    height: 30,
                                    format: 'Y-m-d',
                                    fieldLabel: '核销日期',
                                    columnWidth: 0.5,
                                    padding: '5 10 5 18'
                                }
                            ]
                        },
                        {
                            xtype: 'toolbar',
                            dock: 'top',
                            items: [
                                {
                                    xtype: 'combobox',
                                    id: 'cx_bsc',
                                    width: 160,
                                    fieldLabel: '到达站',
                                    editable: false,
                                    labelWidth: 50,
                                    store: bscStore,
                                    queryMode: 'local',
                                    displayField: 'officeName',
                                    valueField: 'officeId'
                                },
                                {
                                    xtype: 'datefield',
                                    id: 'start_time',
                                    width: 160,
                                    labelWidth: 60,
                                    format: 'Y-m-d',
                                    fieldLabel: '运单时间'
                                },
                                {
                                    xtype: 'label',
                                    text: '~'
                                },
                                {
                                    xtype: 'datefield',
                                    id: 'end_time',
                                    width: 100,
                                    format: 'Y-m-d'
                                },
                                {
                                    xtype: 'textfield',
                                    id: 'cx_people',
                                    width: 160,
                                    labelWidth: 60,
                                    fieldLabel: '发货人'
                                },
                                {
                                    xtype: 'textfield',
                                    id: 'cx_yundannum',
                                    width: 160,
                                    labelWidth: 60,
                                    fieldLabel: '运单编号'
                                },
                                {
                                    xtype: 'button',
                                    iconCls: 'search',
                                    text: '查询',
                                    handler: function () {
                                        getyfList(yfStore.currentPage);
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'pagingtoolbar',
                            displayInfo: true,
                            store: yfStore,
                            dock: 'bottom'
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});

Ext.onReady(function () {
    new iViewport();
    CS('CZCLZ.BscMag.GetOtherBsc', function (retVal) {
        bscStore.loadData(retVal);
        Ext.getCmp('cx_bsc').setValue(retVal[0].officeId);
        ////Ext.getCmp('sz_hxrq').setValue(new Date());
        getyfList(1);
    }, CS.onError)
});