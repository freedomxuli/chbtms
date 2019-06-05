
//-----------------------------------------------------------全局变量-----------------------------------------------------------------
var pageSize = 15;

//-----------------------------------------------------------数据源-------------------------------------------------------------------
var clientStore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
        { name: 'clientId' },
        { name: 'people' },
        { name: 'tel' },
        { name: 'sumMoney' },
        { name: 'yhxMoney' },
        { name: 'whxMoney' },
        { name: 'limit' },
        { name: 'period' },
        { name: 'dj' },
        { name: 'sq_people' }
    ],
    onPageChange: function (sto, nPage, sorters) {
        getClientSQList(nPage);
    }
});

var djStore = Ext.create('Ext.data.Store', {
    fields: [
       { name: 'creditId' },
       { name: 'dj' }
    ]
});
//-----------------------------------------------------------页面方法-----------------------------------------------------------------
function getClientSQList(nPage) {
    var client = Ext.getCmp("cx_client").getValue();
    CS('CZCLZ.KHMag.GetClientSQByPage', function (retVal) {
        clientStore.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize, client);
}

function SQ(client) {
    var win = new sqWin({ client: client });
    win.show(null, function () {
        CS('CZCLZ.KHMag.LoadCredit', function (retVal) {
            djStore.loadData(retVal);
            CS('CZCLZ.KHMag.GetClientSQById', function (ret) {
                Ext.getCmp('creditId').setValue(ret);
                ld(ret);
            }, CS.onError, client);
        }, CS.onError);
    });
}

function ld(v) {
    if (v == "") {
        Ext.getCmp('limit').setValue('');
        Ext.getCmp('period').setValue('');
    } else {
        CS('CZCLZ.KHMag.GetCreditLd', function (ret) {
            Ext.getCmp('limit').setValue(ret.limit);
            Ext.getCmp('period').setValue(ret.period);
        }, CS.onError, v);
    }
}
//-----------------------------------------------------------授权界面-----------------------------------------------------------------
Ext.define('sqWin', {
    extend: 'Ext.window.Window',

    height: 150,
    width: 550,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '授权设置',
    id: 'sqWin',
    initComponent: function () {
        var me = this;
        var clientid = me.client;
        me.items = [
            {
                xtype: 'panel',
                region: 'center',
                layout: {
                    type: 'column'
                },
                items: [
                    {
                        xtype: 'combobox',
                        id: 'creditId',
                        columnWidth: 0.3,
                        height: 20,
                        editable: false,
                        labelWidth: 0,
                        store: djStore,
                        queryMode: 'local',
                        displayField: 'dj',
                        valueField: 'creditId',
                        padding: 6,
                        listeners: {
                            'select': function (o) {
                                ld(o.value);
                            }
                        }
                    },
                    {
                        xtype: 'textareafield',
                        id: 'limit',
                        columnWidth: 0.3,
                        height: 20,
                        labelWidth: 0,
                        padding: 6,
                        readOnly: true
                    },
                    {
                        xtype: 'textareafield',
                        id: 'period',
                        columnWidth: 0.3,
                        height: 20,
                        labelWidth: 0,
                        padding: 6,
                        readOnly: true
                    }
                ],
                buttonAlign: 'center',
                buttons: [
                    {
                        text: '授权',
                        handler: function () {
                            var id = Ext.getCmp('creditId').getValue();
                            CS('CZCLZ.KHMag.SaveClientCredit', function (ret) {
                                Ext.Msg.show({
                                    title: '提示',
                                    msg: '保存成功!',
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.INFO
                                });
                                getClientSQList(1);
                                Ext.getCmp('sqWin').close();
                            }, CS.onError, id, clientid);
                        }
                    },
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
                    store: clientStore,
                    columns: [
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'people',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '客户名'
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
                            dataIndex: 'sumMoney',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '总欠款'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'whxMoney',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '未付欠款'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'dj',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '信用等级'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'limit',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '信用额度'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'period',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '信用周期'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'sq_people',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '授权人'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'clientId',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '操作',
                            renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                var str;
                                str = "<a onclick='SQ(\"" + value + "\");'>授权</a>";
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
                                    xtype: 'textfield',
                                    id: 'cx_client',
                                    width: 160,
                                    labelWidth: 60,
                                    fieldLabel: '客户姓名'
                                },
                                {
                                    xtype: 'button',
                                    iconCls: 'search',
                                    text: '查询',
                                    handler: function () {
                                        getClientSQList(1);
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'pagingtoolbar',
                            displayInfo: true,
                            store: clientStore,
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
    new MainView();
    getClientSQList(1);
});
