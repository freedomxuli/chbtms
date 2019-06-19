//-----------------------------------------------------------全局变量-----------------------------------------------------------------
var pageSize = 15;
var tabN = 1;
//-----------------------------------------------------------数据源-------------------------------------------------------------------
//核销store
var driverStore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
       { name: 'driverId' },
       { name: 'people' },
       { name: 'tel' },
       { name: 'carNum' },
       { name: 'AllMoney' },
       { name: 'HeXiaoMoney' },
       { name: 'WeiHeXiaoMoney' }
    ],
    onPageChange: function (sto, nPage, sorters) {
        getList(nPage);
    }
});

//办事处store
var bscStore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'officeId' },
        { name: 'officeName' }
    ]
});

//已核销store
var yhxStore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
        { name: 'isbj' },//编辑
        { name: 'isxz' },//选择
        { name: 'id' },
        { name: 'yundan_id' },
        { name: 'yundanNum' },
        { name: 'zhuangchedanNum' },
        { name: 'money' },
        { name: 'yhxmoney' },
        { name: 'whxmoney' },
        { name: 'hxje' },
        { name: 'expenseDate' },
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
        getqfList(nPage);
    }
});

//已核销选择store
var yhxSelStore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'isbj' },//编辑
        { name: 'isxz' },//选择
        { name: 'id' },
        { name: 'yundan_id' },
        { name: 'yundanNum' },
        { name: 'zhuangchedanNum' },
        { name: 'money' },
        { name: 'yhxmoney' },
        { name: 'whxmoney' },
        { name: 'hxje' },
        { name: 'expenseDate' },
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

//未核销store
var whxStore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
        { name: 'isbj' },//编辑
        { name: 'isxz' },//选择
        { name: 'id' },
        { name: 'yundan_id' },
        { name: 'yundanNum' },
        { name: 'zhuangchedanNum' },
        { name: 'money' },
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
        getqfList(nPage);
    }
});

//未核销选择store
var whxSelStore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'isbj' },//编辑
        { name: 'isxz' },//选择
        { name: 'id' },
        { name: 'yundan_id' },
        { name: 'yundanNum' },
        { name: 'zhuangchedanNum' },
        { name: 'money' },
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

//日志store
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

//货品store
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
//-----------------------------------------------------------页面方法-----------------------------------------------------------------
//获取办事处
function GetBsc() {
    CS('CZCLZ.BscMag.GetBsc2', function (retVal) {
        bscStore.add([{ 'officeId': '', 'officeName': '全部' }]);
        bscStore.loadData(retVal, true);

        Ext.getCmp('cx_bsc').setValue('');
    }, CS.onError)
}

function getList(nPage) {
    var driver = Ext.getCmp("cx_driver").getValue();
    var bscid = Ext.getCmp("cx_bsc").getValue();
    var kssj = Ext.getCmp("start_time").getValue();
    var jssj = Ext.getCmp("end_time").getValue();

    CS('CZCLZ.Finance.GetDriverDBByPage', function (retVal) {
        driverStore.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize, bscid, kssj, jssj, driver);
}

//操作-核销
function HX(driverId) {
    var win = new HXWin();
    win.show(null, function () {
        Ext.getCmp('driverId').setValue(driverId);
        if (tabN == 1) {
            getWhxList(1);
        } else if (tabN == 2) {
            getYhxList(1);
        }

    });
    win.on("close", function () {
        getList(1);
    });
}

//获取未核销
function getWhxList(nPage) {
    var id = Ext.getCmp('driverId').getValue();
    CS('CZCLZ.Finance.GetDBListByPage', function (retVal) {
        whxSelStore.removeAll();
        whxStore.removeAll();
        whxStore.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize, id, 0);
}

//获取已核销
function getYhxList(nPage) {
    var id = Ext.getCmp('driverId').getValue();
    CS('CZCLZ.Finance.GetDBListByPage', function (retVal) {
        yhxSelStore.removeAll();
        yhxStore.removeAll();
        yhxStore.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize, id, 1);
}

//查看运单货品明细
function LookGoods(ydid) {
    var win = new HPWin();
    win.show(null, function () {
        CS('CZCLZ.Finance.GetHPList', function (retVal) {
            HPStore.loadData(retVal);
        }, CS.onError, ydid);
    });
}
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

//-----------------------------------------------------------核销详情弹出框-----------------------------------------------------------------
Ext.define('HXWin', {
    extend: 'Ext.window.Window',

    height: document.documentElement.clientHeight,
    width: document.documentElement.clientWidth,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '核销设置',
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'tabpanel',
                padding: '10 10 10 10',
                layout: {
                    type: 'fit'
                },
                items: [
                    {
                        xtype: 'panel',
                        itemId: 'tab1',
                        title: '未核销',
                        layout: {
                            type: 'border'
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                id: 'driverId',
                                hidden: true
                            },
                            {
                                xtype: 'gridpanel',
                                region: 'center',
                                id: 'whxGridId',
                                store: whxStore,
                                border: true,
                                columnLines: true,
                                plugins: [
                                    Ext.create('Ext.grid.plugin.CellEditing', {
                                        clicksToEdit: 1                                                                                                                                                                                                                                                                      //设置单击单元格编辑  
                                    })
                                ],
                                listeners: {
                                    'beforeedit': function (editor, e) {
                                        var grid = Ext.getCmp('whxGridId').store;
                                        for (var a = 0; a < grid.data.items.length; a++) {
                                            if (grid.data.items[a].data.isxz == 1) {
                                                grid.data.items[a].data.isbj = true;
                                            }
                                        }
                                    },
                                    'edit': function (editor, e) {
                                        var grid = Ext.getCmp('whxGridId').store;
                                        for (var a = 0; a < grid.data.items.length; a++) {
                                            if (grid.data.items[a].data.isxz == 1) {
                                                grid.data.items[a].data.isbj = false;
                                            }
                                        }

                                        //选择预存
                                        if (whxSelStore.data.length > 0) {
                                            for (var i = 0; i < whxSelStore.data.length; i++) {
                                                if (whxSelStore.data.items[i].data.id == e.record.data.id) {
                                                    whxSelStore.data.items[i].data.hxje = e.record.data.hxje;
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

                                            //选择预存
                                            for (var i = 0; i < whxSelStore.data.length; i++) {
                                                if (whxSelStore.data.items[i].data.id == record.data.id) {
                                                    whxSelStore.remove(whxSelStore.data.items[i]);
                                                }
                                            }
                                        },
                                        select: function (model, record, index) {//record被选中时产生的事件
                                            record.data.isxz = 1;

                                            //选择预存
                                            var n = 1;
                                            if (whxSelStore.data.length > 0) {
                                                for (var i = 0; i < whxSelStore.data.length; i++) {
                                                    if (whxSelStore.data.items[i].data.id == record.data.id) {
                                                        n--;
                                                        whxSelStore.data.items[i].data.hxje = record.data.hxje;
                                                    }
                                                }
                                            }
                                            if (n == 1) {
                                                whxSelStore.add(record.data);
                                            }
                                        }
                                    }
                                }),
                                columns: [
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
                                        dataIndex: 'money',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "短驳费",
                                        width: 140
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

                                },
                                dockedItems: [
                                    {
                                        xtype: 'pagingtoolbar',
                                        displayInfo: true,
                                        store: whxStore,
                                        dock: 'bottom'
                                    }
                                ]
                            },
                            {
                                xtype: 'panel',
                                region: 'south',
                                layout: {
                                    type: 'column'
                                },
                                height: 60,
                                items: [
                                    {
                                        xtype: 'textfield',
                                        id: 'sz_ss',
                                        width: 160,
                                        labelWidth: 70,
                                        fieldLabel: '实收金额',
                                        columnWidth: 0.2,
                                        padding: '15 0 15 15'
                                    },
                                    {
                                        xtype: 'button',
                                        text: '分摊',
                                        columnWidth: 0.09,
                                        margin: '15 0 0 0 ',
                                        handler: function () {
                                            var ftjg = Ext.getCmp('sz_ss').getValue();//原分摊金额
                                            var jfje = ftjg;//所剩分摊金额
                                            var grid = Ext.getCmp('whxGridId');
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

                                                for (var b = 0; b < whxSelStore.data.length; b++) {
                                                    if (whxSelStore.data.items[b].data.id == id) {
                                                        whxSelStore.data.items[b].data.hxje = je;
                                                    }
                                                }
                                            }

                                        }
                                    },
                                    {
                                        xtype: 'datefield',
                                        id: 'sz_hxrq',
                                        width: 160,
                                        labelWidth: 70,
                                        format: 'Y-m-d',
                                        fieldLabel: '核销日期',
                                        columnWidth: 0.3,
                                        padding: '15 15 15 15',
                                        value: new Date()
                                    }
                                ]
                            }
                        ],
                        buttonAlign: 'center',
                        buttons: [
                            {
                                text: '保存核销结果',
                                iconCls: "save",
                                handler: function () {
                                    if (privilege("财务应付核销_短驳费应付核销_核销")) {
                                        var xzlist = [];
                                        for (var i = 0; i < whxSelStore.data.items.length; i++) {
                                            var whx = whxSelStore.data.items[i].data.whxmoney;
                                            var hxje = whxSelStore.data.items[i].data.hxje;
                                            if (whx < hxje) {
                                                Ext.Msg.alert('提示', "运单【" + whxSelStore.data.items[i].data.yundanNum + "】本次核销金额大于未核销金额。");
                                                return;
                                            } else {
                                                xzlist.push(whxSelStore.data.items[i].data);
                                            }
                                        }
                                        var hxrq = Ext.getCmp('sz_hxrq').getValue();
                                        if (hxrq == '' || hxrq == null) {
                                            Ext.Msg.alert('提示', "日期必填！");
                                            return;
                                        }
                                        if (xzlist.length == 0) {
                                            Ext.Msg.alert('提示', "请先选择数据，再保存！");
                                            return;
                                        }
                                        CS('CZCLZ.Finance.SaveDBHx', function (retVal) {
                                            if (retVal) {
                                                Ext.Msg.show({
                                                    title: '提示',
                                                    msg: '保存成功!',
                                                    buttons: Ext.MessageBox.OK,
                                                    icon: Ext.MessageBox.INFO
                                                });
                                                Ext.getCmp('sz_ss').setValue('');
                                                getWhxList(1);
                                            }
                                        }, CS.onError, xzlist, hxrq);
                                    }
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'panel',
                        itemId: 'tab2',
                        title: '已核销',
                        layout: {
                            type: 'border'
                        },
                        items: [
                            {
                                xtype: 'gridpanel',
                                region: 'center',
                                id: 'yhxGridId',
                                store: yhxStore,
                                border: true,
                                columnLines: true,
                                plugins: [
                                    Ext.create('Ext.grid.plugin.CellEditing', {
                                        clicksToEdit: 1                                                                                                                                                                                                                                                                      //设置单击单元格编辑  
                                    })
                                ],
                                selModel: Ext.create('Ext.selection.CheckboxModel', {
                                    selType: 'checkboxmodel',
                                    mode: 'SIMPLE',
                                    checkOnly: true,
                                    listeners: {
                                        deselect: function (model, record, index) {//取消选中时产生的事件
                                            record.data.isxz = 0;

                                            //选择预存
                                            for (var i = 0; i < yhxSelStore.data.length; i++) {
                                                if (yhxSelStore.data.items[i].data.id == record.data.id) {
                                                    yhxSelStore.remove(yhxSelStore.data.items[i]);
                                                }
                                            }
                                        },
                                        select: function (model, record, index) {//record被选中时产生的事件
                                            record.data.isxz = 1;

                                            //选择预存
                                            var n = 1;
                                            if (yhxSelStore.data.length > 0) {
                                                for (var i = 0; i < yhxSelStore.data.length; i++) {
                                                    if (yhxSelStore.data.items[i].data.id == record.data.id) {
                                                        n--;
                                                        yhxSelStore.data.items[i].data.hxje = record.data.hxje;
                                                    }
                                                }
                                            }
                                            if (n == 1) {
                                                yhxSelStore.add(record.data);
                                            }
                                        }
                                    }
                                }),
                                columns: [
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
                                        dataIndex: 'money',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "短驳费",
                                        width: 140
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

                                },
                                dockedItems: [
                                    {
                                        xtype: 'pagingtoolbar',
                                        displayInfo: true,
                                        store: yhxStore,
                                        dock: 'bottom'
                                    }
                                ]
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
                                                    if (privilege("财务应付核销_短驳费应付核销_导出")) {
                                                        var xzlist = [];
                                                        if (tabN == 1) {
                                                            var sel = Ext.getCmp('whxGridId').getSelectionModel().getSelection();
                                                            if (sel.length == 0) {
                                                                Ext.Msg.alert('提示', "请选择导出记录。");
                                                                return;
                                                            }
                                                            for (var i = 0; i < sel.length; i++) {
                                                                xzlist.push(sel[i].data);
                                                            }
                                                        } else if (tabN == 2) {
                                                            var sel = Ext.getCmp('yhxGridId').getSelectionModel().getSelection();
                                                            if (sel.length == 0) {
                                                                Ext.Msg.alert('提示', "请选择导出记录。");
                                                                return;
                                                            }
                                                            for (var i = 0; i < sel.length; i++) {
                                                                xzlist.push(sel[i].data);
                                                            }
                                                        }
                                                        DownloadFile("CZCLZ.Finance.DownLoadDbf", "导出短驳费核销.xls", xzlist);
                                                    }
                                                }
                                            },
                                            {
                                                text: "核销日志",
                                                handler: function () {
                                                    if (tabN == 1) {
                                                        if (whxSelStore.data.items.length != 1) {
                                                            Ext.Msg.alert('提示', "请单个选择查询。");
                                                            return;
                                                        }
                                                    } else if (tabN == 2) {
                                                        if (yhxSelStore.data.items.length != 1) {
                                                            Ext.Msg.alert('提示', "请单个选择查询。");
                                                            return;
                                                        }
                                                    }
                                                    var win = new LogWin();
                                                    win.show(null, function () {
                                                        var id = '';
                                                        if (tabN == 1) {
                                                            id = whxSelStore.data.items[0].data.id;
                                                        } else if (tabN == 2) {
                                                            id = yhxSelStore.data.items[0].data.id;
                                                        }
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
                                                            if (tabN == 1) {
                                                                for (var i = 0; i < whxSelStore.data.items.length; i++) {
                                                                    var id = whxSelStore.data.items[i].data.id;
                                                                    var je = whxSelStore.data.items[i].data.yhxmoney;
                                                                    var ydid = whxSelStore.data.items[i].data.yundan_id;
                                                                    CS('CZCLZ.Finance.DeleteExpenseHxLog', function (retVal) {
                                                                        getWhxList(1);
                                                                    }, CS.onError, "1", id, ydid, je);
                                                                }
                                                            } else if (tabN == 2) {
                                                                for (var i = 0; i < yhxSelStore.data.items.length; i++) {
                                                                    var id = yhxSelStore.data.items[i].data.id;
                                                                    var je = yhxSelStore.data.items[i].data.yhxmoney;
                                                                    var ydid = yhxSelStore.data.items[i].data.yundan_id;
                                                                    CS('CZCLZ.Finance.DeleteExpenseHxLog', function (retVal) {
                                                                        getYhxList(1);
                                                                    }, CS.onError, "1", id, ydid, je);
                                                                }
                                                            }
                                                        }
                                                    });
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ],
                listeners: {
                    'tabchange': function (t, n) {
                        if (n.itemId == 'tab1') {
                            tabN = 1;
                            getWhxList(1);
                        } else if (n.itemId == 'tab2') {
                            tabN = 2;
                            getYhxList(1);
                        }
                    }
                }
            }
        ];
        me.callParent(arguments);
    }
});
//-----------------------------------------------------------界    面-----------------------------------------------------------------
Ext.define('MainView', {
    extend: 'Ext.container.Viewport',

    layout: {
        type: 'fit'
    },

    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'gridpanel',
                    border: 1,
                    columnLines: 1,
                    store: driverStore,
                    columns: [
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'people',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '司机名'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'tel',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '电话'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'carNum',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '车牌号'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'AllMoney',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '已核登记（元）'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'HeXiaoMoney',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '已核销金额（元）'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'WeiHeXiaoMoney',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '未核销金额（元）'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'driverId',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '操作',
                            renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                var str;
                                str = "<a onclick='HX(\"" + value + "\");'>核销</a>";
                                return str;
                            }
                        }
                    ],
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'top',
                            items: [
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
                                    valueField: 'officeId',
                                    hidden: true
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
                                    id: 'cx_driver',
                                    width: 160,
                                    labelWidth: 60,
                                    fieldLabel: '司机姓名'
                                },
                                {
                                    xtype: 'button',
                                    iconCls: 'search',
                                    text: '查询',
                                    handler: function () {
                                        if (privilege("财务应付核销_短驳费应付核销_查询")) {
                                            getList(1);
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'pagingtoolbar',
                            dock: 'bottom',
                            width: 360,
                            displayInfo: true,
                            store: driverStore,
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});

Ext.onReady(function () {
    new MainView();
    GetBsc();
    getList(1);
});
