var pageSize = 15;

var bscStore = Ext.create('Ext.data.Store', {
    fields: [
       { name: 'id' },
       { name: 'mc' }
    ]
});

var driverStore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
       { name: 'yundan_id' },
       { name: 'yundanNum' },
       { name: 'zhuangchedanNum' },
       { name: 'daiShouKuan' },
       { name: 'yhxmoney' },
       { name: 'whxmoney' },
       { name: 'incomeDate' },
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
        getDriverList(nPage);
    }
});

Ext.define('YJWin', {
    extend: 'Ext.window.Window',

    height: 650,
    width: 800,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '收取押金',

    initComponent: function () {
        var me = this;
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
                                    
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'gridpanel',
                        border: true,
                        columnLines: true,
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
                        text: '确定',
                        iconCls: 'dropyes',
                        handler: function () {

                        }
                    },
                     {
                         text: '取消',
                         iconCls: 'back',
                         handler: function () {
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

    height: 650,
    width: 800,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '退还押金',

    initComponent: function () {
        var me = this;
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
                                columnWidth: 1
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

                                }
                            }
                        ]
                    },
                    {
                        xtype: 'gridpanel',
                        border: true,
                        columnLines: true,
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
                        text: '确定',
                        iconCls: 'dropyes',
                        handler: function () {

                        }
                    },
                     {
                         text: '取消',
                         iconCls: 'back',
                         handler: function () {
                             me.close();
                         }
                     }
                ]
            }
        ];
        me.callParent(arguments);
    }
});

function PostYJWin()
{
    var win = new YJWin1();
    win.show(null, function () {


    });
}

function GetYJWin()
{
    var win = new YJWin();
    win.show(null, function () {


    });
}

Ext.onReady(function () {
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
                            width: 120,
                            sortable: false,
                            menuDisabled: true,
                            renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                var str;
                                str = "<a onclick='GetYJ(\"" + value + "\");'>收取押金</a>　<a onclick='PostYJ(\"" + value + "\");'>退还押金</a>";
                                return str;
                            }
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'officeName',
                            sortable: false,
                            menuDisabled: true,
                            text: "办事处"
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'dthyj',
                            sortable: false,
                            menuDisabled: true,
                            text: "待退还押金总额"
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'people',
                            sortable: false,
                            menuDisabled: true,
                            text: "联系人"
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'shenfenzheng',
                            sortable: false,
                            menuDisabled: true,
                            text: "身份证号码"
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'address',
                            sortable: false,
                            menuDisabled: true,
                            text: "地址"
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'tel',
                            sortable: false,
                            menuDisabled: true,
                            text: "联系电话"
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'carNum',
                            sortable: false,
                            menuDisabled: true,
                            text: "车辆车牌"
                        }
                    ],
                    viewConfig: {

                    },
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
                                    displayField: 'mc',
                                    valueField: 'id',
                                    value: ''
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

                                    }
                                },
                                {
                                    xtype: 'button',
                                    iconCls: 'add',
                                    text: '设置',
                                    handler: function () {
                                        //GetYJWin();
                                        PostYJWin();
                                    }
                                }
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
    new DriverView();
});