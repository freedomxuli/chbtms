//-----------------------------------------------------------全局变量-----------------------------------------------------------------
var pageSize = 15;

//-----------------------------------------------------------数据源-------------------------------------------------------------------
//办事处store
var bscStore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'officeId' },
        { name: 'officeName' }
    ]
});
var inStore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'id' },
        { name: 'incomeDate' },
        { name: 'money' },
        { name: 'memo' }
    ]
});

var exStore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'id' },
        { name: 'expenseDate' },
        { name: 'money' },
        { name: 'memo' }
    ]
});

var driverStore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
        { name: 'driverId' },
        { name: 'officeName' },
        { name: 'people' },
        { name: 'shenfenzheng' },
        { name: 'address' },
        { name: 'tel' },
        { name: 'carNum' },
        { name: 'sumyj' },
        { name: 'sumthyj' },
        { name: 'dthyj' },
        { name: 'kind' }

    ],
    onPageChange: function (sto, nPage, sorters) {
        getDriverList(nPage);
    }
});
//-----------------------------------------------------------页面方法-----------------------------------------------------------------
//获取办事处
function GetBsc() {
    CS('CZCLZ.BscMag.GetBsc2', function (retVal1) {
        bscStore.add({ 'officeId': '', 'officeName': '全部' });
        bscStore.loadData(retVal1, true);
    }, CS.onError)
}

function getDriverList(nPage) {
    var bscid = Ext.getCmp("cx_bsc").getValue();
    var peoplename = Ext.getCmp("cx_people").getValue();
    CS('CZCLZ.Finance.GetYjListByPage', function (retVal) {
        driverStore.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize, bscid, peoplename);
}

function PostYJWin(id, dth) {
    var win = new YJWin1({ driverId: id });
    win.show(null, function () {
        Ext.getCmp('thmoneyze').setValue(dth);
        getexpenseLine(id);
    });
}

function GetYJWin(id) {
    var win = new YJWin({ driverId: id });
    win.show(null, function () {
        getinLine(id);
    });
}

function getinLine(id) {
    CS('CZCLZ.Finance.GetYjIncomeByDriverId', function (ret) {
        inStore.loadData(ret);
    }, CS.onError, id);
}

function getexpenseLine(id) {
    CS('CZCLZ.Finance.GetYjExpenseByDriverId', function (ret) {
        exStore.loadData(ret);
    }, CS.onError, id);
}
//-----------------------------------------------------------弹出界面-----------------------------------------------------------------
Ext.define('YJWin', {
    extend: 'Ext.window.Window',

    height: 500,
    width: 800,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '收取押金',

    initComponent: function () {
        var me = this;
        var driverid = me.driverId;
        me.items = [
            {
                xtype: 'panel',
                layout: {
                    type: 'anchor'
                },
                items: [
                    {
                        xtype: 'panel',
                        layout: {
                            type: 'column'
                        },
                        items: [
                            {
                                xtype: 'datefield',
                                fieldLabel: '登记日期',
                                id: 'sqDate',
                                format: 'Y-m-d',
                                padding: '10 10 10 10',
                                columnWidth: 1
                            },
                            {
                                xtype: 'numberfield',
                                fieldLabel: '收取押金（元）',
                                id: 'sqmoney',
                                minValue: 0,
                                padding: '0 10 10 10',
                                columnWidth: 1
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '备注',
                                id: 'sqmemo',
                                padding: '0 10 10 10',
                                columnWidth: 1
                            }
                        ],
                        buttonAlign: 'center',
                        buttons: [
                            {
                                text: '保存',
                                handler: function () {
                                    var sqdate = Ext.getCmp('sqDate').getValue();
                                    if (sqdate == '') {
                                        Ext.Msg.alert('提示', "登记日期必填！");
                                        return;
                                    }
                                    var sqmoney = Ext.getCmp('sqmoney').getValue();
                                    if (sqmoney == '' || sqmoney == 0) {
                                        Ext.Msg.alert('提示', "收取押金金额必填且不等于0！");
                                        return;
                                    }
                                    var sqmemo = Ext.getCmp('sqmemo').getValue();
                                    CS('CZCLZ.Finance.SaveYjIncome', function (retVal) {
                                        getinLine(driverid);
                                    }, CS.onError, sqdate, driverid, sqmoney, sqmemo);
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'gridpanel',
                        border: true,
                        store: inStore,
                        columnLines: true,
                        columns: [
                            {
                                xtype: 'datecolumn',
                                dataIndex: 'incomeDate',
                                flex: 1,
                                text: '登记时间',
                                format: 'Y-m-d',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'money',
                                flex: 1,
                                text: '收取押金（元）',
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
                            }
                        ]
                    }
                ],
                buttonAlign: 'center',
                buttons: [
                    {
                        text: '关闭',
                        iconCls: 'back',
                        handler: function () {
                            getDriverList(1);
                            me.close();
                        }
                    }
                ]
            }
        ];
        me.callParent(arguments);
    }
});

Ext.define('YJWin1', {
    extend: 'Ext.window.Window',

    height: 500,
    width: 800,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '退还押金',

    initComponent: function () {
        var me = this;
        var driverid = me.driverId;
        me.items = [
            {
                xtype: 'panel',
                layout: {
                    type: 'anchor'
                },
                items: [
                    {
                        xtype: 'panel',
                        layout: {
                            type: 'column'
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: '待退还总额',
                                id: 'thmoneyze',
                                minValue: 0,
                                padding: '10 10 10 10',
                                columnWidth: 1,
                                readOnly: true
                            },
                            {
                                xtype: 'datefield',
                                fieldLabel: '登记日期',
                                id: 'thDate',
                                format: 'Y-m-d',
                                padding: '0 10 10 10',
                                columnWidth: 1
                            },
                            {
                                xtype: 'numberfield',
                                fieldLabel: '退还押金（元）',
                                id: 'thmoney',
                                minValue: 0,
                                padding: '0 10 10 10',
                                columnWidth: 1
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '备注',
                                id: 'thmemo',
                                padding: '0 10 10 10',
                                columnWidth: 1
                            }
                        ],
                        buttonAlign: 'center',
                        buttons: [
                            {
                                text: '保存',
                                handler: function () {
                                    var thDate = Ext.getCmp('thDate').getValue();
                                    if (thDate == '') {
                                        Ext.Msg.alert('提示', "登记日期必填！");
                                        return;
                                    }
                                    var thmoney = Ext.getCmp('thmoney').getValue();
                                    var dthmoney = Ext.getCmp('thmoneyze').getValue();
                                    if (thmoney == '' || thmoney == 0) {
                                        Ext.Msg.alert('提示', "退还押金金额必填且不等于0！");
                                        return;
                                    } else {
                                        if (thmoney > dthmoney) {
                                            Ext.Msg.alert('提示', "退还押金超出待退还金额！");
                                            return;
                                        }
                                    }
                                    var thmemo = Ext.getCmp('thmemo').getValue();
                                    CS('CZCLZ.Finance.SaveYjExpense', function (retVal) {
                                        Ext.getCmp('thmoneyze').setValue(dthmoney - thmoney);
                                        getexpenseLine(driverid);
                                    }, CS.onError, thDate, driverid, thmoney, thmemo);
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'gridpanel',
                        border: true,
                        columnLines: true,
                        store: exStore,
                        columns: [
                            {
                                xtype: 'datecolumn',
                                dataIndex: 'expenseDate',
                                flex: 1,
                                text: '登记时间',
                                format: 'Y-m-d',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'money',
                                flex: 1,
                                text: '退还押金（元）',
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
                            }
                        ]
                    }
                ],
                buttonAlign: 'center',
                buttons: [
                    {
                        text: '关闭',
                        iconCls: 'back',
                        handler: function () {
                            getDriverList(1);
                            me.close();
                        }
                    }
                ]
            }
        ];
        me.callParent(arguments);
    }
});
//-----------------------------------------------------------界    面-----------------------------------------------------------------
Ext.define('DriverView', {
    extend: 'Ext.container.Viewport',

    layout: {
        type: 'fit'
    },
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'gridpanel',
                id: 'drivergrid',
                store: driverStore,
                border: true,
                columnLines: true,
                //selModel: Ext.create('Ext.selection.CheckboxModel', {

                //}),
                columns: [
                    Ext.create('Ext.grid.RowNumberer'),
                    {
                        xtype: 'gridcolumn',
                        text: '操作',
                        dataIndex: 'driverId',
                        width: 140,
                        sortable: false,
                        menuDisabled: true,
                        renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                            var str;
                            str = "<a onclick='GetYJWin(\"" + value + "\");'>收取押金</a>　<a onclick='PostYJWin(\"" + value + "\",\"" + record.data.dthyj + "\");'>退还押金</a>";
                            return str;
                        }
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'dthyj',
                        sortable: false,
                        menuDisabled: true,
                        text: "待退还押金总额",
                        width: 110
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'officeName',
                        sortable: false,
                        menuDisabled: true,
                        text: "办事处",
                        width: 100
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'sumyj',
                        sortable: false,
                        menuDisabled: true,
                        text: "累计押金总额",
                        width: 100
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'sumthyj',
                        sortable: false,
                        menuDisabled: true,
                        text: "累计退还",
                        width: 100
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'kind',
                        sortable: false,
                        menuDisabled: true,
                        text: "司机类型",
                        width: 80,
                        renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                            var str;
                            if (value == 0) {
                                str = "大车";
                            } else if (value == 1) {
                                str = "小车";
                            }
                            return str;
                        }
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'people',
                        sortable: false,
                        menuDisabled: true,
                        text: "联系人姓名",
                        width: 100
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'shenfenzheng',
                        sortable: false,
                        menuDisabled: true,
                        text: "身份证号码",
                        width: 150
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'address',
                        sortable: false,
                        menuDisabled: true,
                        text: "地址",
                        width: 210
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'tel',
                        sortable: false,
                        menuDisabled: true,
                        text: "电话",
                        width: 100
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'carNum',
                        sortable: false,
                        menuDisabled: true,
                        text: "车辆车牌",
                        width: 100
                    }
                ],
                viewConfig: {

                },
                dockedItems: [
                    //{
                    //    xtype: 'toolbar',
                    //    dock: 'top',
                    //    items: [
                    //        {
                    //            xtype: 'button',
                    //            iconCls: 'add',
                    //            text: '收押金',
                    //            handler: function () {
                    //                //GetYJWin();
                    //                GetYJ();
                    //            }
                    //        },
                    //        {
                    //            xtype: 'button',
                    //            iconCls: 'add',
                    //            text: '退押金',
                    //            handler: function () {
                    //                //GetYJWin();
                    //                PostYJWin();
                    //            }
                    //        }
                    //    ]
                    //},
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
                                valueField: 'officeId'
                            },
                            {
                                xtype: 'textfield',
                                id: 'cx_people',
                                width: 160,
                                labelWidth: 60,
                                fieldLabel: '司机姓名'
                            },
                            {
                                xtype: 'button',
                                iconCls: 'search',
                                text: '查询',
                                handler: function () {
                                    getDriverList(1);
                                }
                            }
                            //{
                            //    xtype: 'button',
                            //    iconCls: 'add',
                            //    text: '设置',
                            //    handler: function () {
                            //        //GetYJWin();
                            //        PostYJWin();
                            //    }
                            //}
                        ]
                    },
                    {
                        xtype: 'pagingtoolbar',
                        displayInfo: true,
                        store: driverStore,
                        dock: 'bottom'
                    }
                ]
            }
        ];
        me.callParent(arguments);
    }
})

Ext.onReady(function () {
    new DriverView();
    GetBsc();
    getDriverList(1);
});