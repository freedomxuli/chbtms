﻿//-----------------------------------------------------------全局变量-----------------------------------------------------------------
var pageSize = 15;
//-----------------------------------------------------------数据源-------------------------------------------------------------------
//办事处store
var bscStore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'officeId' },
        { name: 'officeName' }
    ]
});

//回扣store
var hkStore = createSFW4Store({
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
        { name: 'moneyHuikou' },
        { name: 'yhxmoney' },
        { name: 'whxmoney' },
        { name: 'hxje' },
        { name: 'expenseDate' },
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
        gethkList(nPage);
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
        { name: 'moneyHuikou' },
        { name: 'yhxmoney' },
        { name: 'whxmoney' },
        { name: 'hxje' },
        { name: 'expenseDate' },
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

var HPStore = Ext.create('Ext.data.Store', {
    fields: [{ name: 'yundan_goods_id' },
    { name: 'yundan_chaifen_id' },
    { name: 'yundan_goodsName' },
    { name: 'yundan_goodsPack' },
    { name: 'yundan_goodsAmount' },
    { name: 'yundan_goodsWeight' },
    { name: 'yundan_goodsVolume' },
    { name: 'status' },
    { name: 'addtime' },
    { name: 'adduser' },
    { name: 'SP_ID' }
    ],
    data: [
    ]
});

var logStore = Ext.create('Ext.data.Store', {
    fields: [{ name: 'id' },
    { name: 'income_id' },
        { name: 'incomeDate' },
    { name: 'money' },
    { name: 'memo' },
    { name: 'addtime' },
    { name: 'adduser' },
    { name: 'UserXM' }
    ],
    data: [
    ]
});
//-----------------------------------------------------------页面方法-----------------------------------------------------------------
//获取办事处
function GetBsc() {
    CS('CZCLZ.BscMag.GetBsc2', function (retVal1) {
        bscStore.loadData(retVal1);
    }, CS.onError)
}

//获取预付运费核销
function gethkList(nPage) {
    var hxzt = Ext.getCmp("cx_hxzt").getValue();
    var bscid = Ext.getCmp("cx_bsc").getValue();
    var kssj = Ext.getCmp("start_time").getValue();
    var jssj = Ext.getCmp("end_time").getValue();
    var fhr = Ext.getCmp("cx_people").getValue();
    var ydbh = Ext.getCmp("cx_yundannum").getValue();
    CS('CZCLZ.Finance.GetHkHxListByPage', function (retVal) {
        selYdStore.removeAll();
        hkStore.removeAll();
        hkStore.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize, hxzt, bscid, kssj, jssj, fhr, ydbh);
}

function setVal() {
    var whx = 0;
    var swhx = 0;
    var grid = Ext.getCmp('hkgrid').store;
    for (var a = 0; a < grid.data.items.length; a++) {
        if (grid.data.items[a].data.isxz == 1) {
            whx += grid.data.items[a].data.whxmoney == null ? 0 : grid.data.items[a].data.whxmoney;
            swhx += grid.data.items[a].data.hxje == null ? 0 : grid.data.items[a].data.hxje;
        }
    }

    Ext.getCmp('sz_whx').setValue(whx);
    Ext.getCmp('sz_shx').setValue(swhx);
}

function LookGoods(ydid) {
    var win = new HPWin();
    win.show(null, function () {
        CS('CZCLZ.Finance.GetHPList', function (retVal) {
            HPStore.loadData(retVal);
        }, CS.onError, ydid);
    });
}

//-----------------------------------------------------------日志界面-----------------------------------------------------------------
Ext.define('LogWin', {
    extend: 'Ext.window.Window',

    height: 300,
    width: 500,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '日志',

    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'panel',
                layout: {
                    type: 'fit'
                },
                items: [
                    {
                        xtype: 'gridpanel',
                        region: 'center',
                        border: true,
                        store: logStore,
                        columnLines: true,
                        columns: [
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'id',
                                flex: 1,
                                menuDisabled: true,
                                sortable: false,
                                hidden: true
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'income_id',
                                flex: 1,
                                menuDisabled: true,
                                sortable: false,
                                hidden: true
                            },
                            {
                                xtype: 'datecolumn',
                                dataIndex: 'incomeDate',
                                width: 90,
                                format: 'Y-m-d',
                                text: '核销日期',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'money',
                                width: 130,
                                text: '核销金额',
                                menuDisabled: true,
                                sortable: false

                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'memo',
                                flex: 1,
                                text: '备注',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'UserXM',
                                width: 90,
                                text: '操作人',
                                menuDisabled: true,
                                sortable: false
                            }
                        ]
                    }
                ],
                buttonAlign: 'center',
                buttons: [
                    {
                        text: '取消',
                        handler: function () {
                            this.up('window').close();
                        }
                    }
                ]
            }
        ];
        me.callParent(arguments);
    }
});
//-----------------------------------------------------------货品界面-----------------------------------------------------------------
Ext.define('HPWin', {
    extend: 'Ext.window.Window',

    height: 400,
    width: 600,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '货品查看',

    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'panel',
                layout: {
                    type: 'fit'
                },
                items: [
                    {
                        xtype: 'gridpanel',
                        id: 'hpgrid',
                        region: 'center',
                        border: true,
                        store: HPStore,
                        columnLines: true,
                        columns: [
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'SP_ID',
                                flex: 1,
                                text: "商品ID",
                                menuDisabled: true,
                                sortable: false,
                                hidden: true
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'yundan_goodsName',
                                flex: 1,
                                text: "货品名称",
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'yundan_goodsPack',
                                flex: 1,
                                text: '包装',
                                menuDisabled: true,
                                sortable: false

                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'yundan_goodsAmount',
                                flex: 1,
                                text: '件数',
                                menuDisabled: true,
                                sortable: false

                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'yundan_goodsWeight',
                                flex: 1,
                                text: '重量',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'yundan_goodsVolume',
                                flex: 1,
                                text: '体积',
                                menuDisabled: true,
                                sortable: false
                            }
                        ]
                    }
                ],
                buttonAlign: 'center',
                buttons: [
                    {
                        text: '取消',
                        handler: function () {
                            this.up('window').close();
                        }
                    }
                ]
            }
        ];
        me.callParent(arguments);
    }
});

//-----------------------------------------------------------界    面-----------------------------------------------------------------
Ext.define('hkListView', {
    extend: 'Ext.container.Viewport',

    layout: {
        type: 'fit'
    },
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'panel',
                layout: {
                    type: 'border'
                },
                items: [
                    {
                        xtype: 'panel',
                        height: 90,
                        region: 'north',
                        layout: {
                            type: 'border'
                        },
                        items: [
                            {
                                xtype: 'panel',
                                layout: {
                                    type: 'column'
                                },
                                region: 'west',
                                width: 800,
                                border: false,
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
                                            var grid = Ext.getCmp('hkgrid');
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
                                region: 'center',
                                border: false
                            }
                        ]

                    },
                    {
                        xtype: 'gridpanel',
                        id: 'hkgrid',
                        region: 'center',
                        store: hkStore,
                        border: true,
                        columnLines: true,
                        plugins: [
                            Ext.create('Ext.grid.plugin.CellEditing', {
                                clicksToEdit: 1                                                                                                                                                                                                                                                                      //设置单击单元格编辑  
                            })
                        ],
                        listeners: {
                            'beforeedit': function (editor, e) {
                                var grid = Ext.getCmp('hkgrid').store;
                                for (var a = 0; a < grid.data.items.length; a++) {
                                    if (grid.data.items[a].data.isxz == 1) {
                                        grid.data.items[a].data.isbj = true;
                                    }
                                }
                            },
                            'edit': function (editor, e) {
                                var yhze = isNaN(Number(Ext.getCmp('sz_yhx').getValue())) ? 0 : Number(Ext.getCmp('sz_yhx').getValue());
                                yhze += isNaN(Number(e.record.data.hxje)) ? 0 : Number(e.record.data.hxje);
                                Ext.getCmp('sz_yhx').setValue(yhze);

                                var grid = Ext.getCmp('hkgrid').store;
                                for (var a = 0; a < grid.data.items.length; a++) {
                                    if (grid.data.items[a].data.isxz == 1) {
                                        grid.data.items[a].data.isbj = false;
                                    }
                                }
                                //合计
                                setVal();
                                //选择预存
                                if (selYdStore.data.length > 0) {
                                    for (var i = 0; i < selYdStore.data.length; i++) {
                                        if (selYdStore.data.items[i].data.id == e.record.data.id) {
                                            selYdStore.data.items[i].data.hxje = e.record.data.hxje;
                                        }
                                    }
                                }
                            }
                        },
                        selModel: Ext.create('Ext.selection.CheckboxModel', {
                            selType: 'checkboxmodel',
                            mode: 'SIMPLE',
                            checkOnly: true,
                            listeners: {
                                beforedeselect: function (model, record, index) {
                                    if (record.data.isbj) {
                                        return false;
                                    }
                                },
                                deselect: function (model, record, index) {//取消选中时产生的事件
                                    record.data.isxz = 0;
                                    //合计
                                    setVal();
                                    //选择预存
                                    for (var i = 0; i < selYdStore.data.length; i++) {
                                        if (selYdStore.data.items[i].data.id == record.data.id) {
                                            selYdStore.remove(selYdStore.data.items[i]);
                                        }
                                    }
                                },
                                select: function (model, record, index) {//record被选中时产生的事件
                                    record.data.isxz = 1;
                                    //合计
                                    setVal();
                                    //选择预存
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
                                }
                            }
                        }),
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
                                width: 120
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'zhuangchedanNum',
                                sortable: false,
                                menuDisabled: true,
                                text: "装车单号",
                                width: 120
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'moneyHuikou',
                                sortable: false,
                                menuDisabled: true,
                                text: "回扣",
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
                                dataIndex: 'expenseDate',
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
                        viewConfig: {
                            forceFit: false,
                            getRowClass: function (record, index, rowParams, store) {
                                if (record.data.status == "startCatalog") {
                                    return "getRowClassLock";
                                }
                            }
                        },
                        dockedItems: [
                            {
                                xtype: 'toolbar',
                                dock: 'top',
                                items: [
                                    {
                                        xtype: 'combobox',
                                        //fieldLabel: '性质',
                                        labelAlign: 'right',
                                        //labelWidth: 80,
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
                                        editable: false,
                                        width: 100
                                    },
                                    {
                                        xtype: 'combobox',
                                        id: 'cx_bsc',
                                        width: 160,
                                        fieldLabel: '办事处',
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
                                            gethkList(hkStore.currentPage);
                                        }
                                    }
                                ]
                            },
                            {
                                xtype: 'pagingtoolbar',
                                displayInfo: true,
                                store: hkStore,
                                dock: 'bottom'
                            }
                        ]
                    }
                ],
                dockedItems: [
                    {
                        xtype: 'toolbar',
                        dock: 'top',
                        items: [
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
                                                                CS('CZCLZ.Finance.DeleteExpenseHxLog', function (retVal) {
                                                                    gethkList(1);
                                                                }, CS.onError, "4", id, ydid);
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
                                title: '',
                                items: [
                                    {
                                        xtype: "button",
                                        text: "保存核销结果",
                                        iconCls: "save",
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

                                            CS('CZCLZ.Finance.SaveHKHx', function (retVal) {
                                                if (retVal) {
                                                    Ext.Msg.show({
                                                        title: '提示',
                                                        msg: '保存成功!',
                                                        buttons: Ext.MessageBox.OK,
                                                        icon: Ext.MessageBox.INFO
                                                    });
                                                    gethkList(1);
                                                }
                                            }, CS.onError, xzlist, hxrq);
                                        }
                                    }
                                ]
                            },
                        ]
                    }
                ]
            }
        ];
        me.callParent(arguments);
    }
})

Ext.onReady(function () {
    new hkListView();
    Ext.getCmp('cx_hxzt').setValue('');
    GetBsc();
    gethkList(1);
    Ext.getCmp('sz_hxrq').setValue(new Date());
});