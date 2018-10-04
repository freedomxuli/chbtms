var pageSize = 20;
//************************************数据源*****************************************
var XLStore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
       { name: 'traderId' },
       { name: 'fromOfficeId' },
       { name: 'fromOfficeName' },
       { name: 'toOfficeId' },
       { name: 'toOfficeName' },
       { name: 'XGQT' }
    ],
    onPageChange: function (sto, nPage, sorters) {
        BindData(nPage);
    }
});

var frombscstore = Ext.create('Ext.data.Store', {
    fields: ['VALUE', 'TEXT'],
    data: [
    ]
});

var tobscstore = Ext.create('Ext.data.Store', {
    fields: ['VALUE', 'TEXT'],
    data: [
    ]
});

var userstore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'UserID', type: 'string' },
        { name: 'UserName', type: 'string' }
    ]
})

var yxstore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'userId', type: 'string' }
    ]
})

function GetfromBsc() {
    CS('CZCLZ.BscMag.GetBsc', function (retVal) {
        frombscstore.loadData(retVal);
        Ext.getCmp("fromOfficeId").setValue(retVal[0]["VALUE"]);
    }, CS.onError)
}

function GettoBsc() {
    CS('CZCLZ.BscMag.GetBsc', function (retVal) {
        tobscstore.loadData(retVal);
        Ext.getCmp("toOfficeId").setValue(retVal[0]["VALUE"]);
    }, CS.onError)
}

function BindData(nPage) {
    CS('CZCLZ.XLMag.GetXLList', function (retVal) {
        XLStore.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize, Ext.getCmp("cx_keyword").getValue());
}
//************************************数据源*****************************************

//************************************页面方法***************************************
function xg(id) {
    CS('CZCLZ.XLMag.GetXLById', function (retVal) {
        if (retVal) {
            var win = new addWin();
            win.show(null, function () {
                GetfromBsc();
                GettoBsc();
                var form = Ext.getCmp('addform');
                form.form.setValues(retVal[0]);
            });
        }
    }, CS.onError, id);
}

function del(id) {
    Ext.MessageBox.confirm("提示", "是否删除你所选?", function (obj) {
        if (obj == "yes") {
            CS('CZCLZ.XLMag.DeleteXL', function (retVal) {
                if (retVal) {
                    BindData(1);
                }
            }, CS.onError, id);
        }
        else {
            return;
        }
    });
}

function SZQTFZR(id, fromOfficeName, toOfficeName) {
    var win = new SZQT({xlid:id});
    win.setTitle(fromOfficeName + "-" + toOfficeName);
    win.show(null, function () {
        CS('CZCLZ.XLMag.GetXL2YH', function (retVal) {
            if (retVal.userdt) {
                userstore.loadData(retVal.userdt);
            }
            if (retVal.yxdt) {
                yxstore.loadData(retVal.yxdt);
            }
            var arr = [];
            if (userstore.data.length > 0) {
                for (var i = 0; i < userstore.data.length; i++) {
                    for (var j = 0; j < yxstore.data.length; j++) {
                        if (userstore.data.items[i].data.UserID == yxstore.data.items[j].data.userId) {
                            arr.push(userstore.findRecord("UserID", userstore.data.items[i].data.UserID));
                        }
                    }
                }
                Ext.getCmp('userpanel').getSelectionModel().select(arr);
            }
        }, CS.onError, id);

    })
}

//************************************页面方法***************************************

//************************************弹出界面***************************************
Ext.define('SZQT', {
    extend: 'Ext.window.Window',

    modal: true,
    width: 450,
    height: 400,
    layout: {
        type: 'fit'
    },
    title: '设置前台负责人',
    id: 'SZQTWin',
    initComponent: function () {
        var me = this;
        var xlid = me.xlid;
        Ext.applyIf(me, {
            items: [
                    {
                        xtype: 'panel',
                        autoScroll: true,
                        dockedItems: [
                        ],
                        buttonAlign: 'center',
                        buttons: [

                                {
                                    xtype: 'button',
                                    width: 100,
                                    text: '确定',
                                    handler: function () {
                                        var value1 = [];
                                        var grid = Ext.getCmp("userpanel");
                                        var rds = grid.getSelectionModel().getSelection();

                                        Ext.MessageBox.confirm("提示", "是否保存你所选?", function (obj) {
                                            if (obj == "yes") {
                                                for (var n = 0, len = rds.length; n < len; n++) {
                                                    var rd = rds[n];
                                                    value1.push(rd.data);
                                                }
                                                CS('CZCLZ.XLMag.SaveXL2YH', function (retVal) {
                                                    if (retVal == 1) {
                                                        Ext.Msg.show({
                                                            title: '提示',
                                                            msg: '保存成功',
                                                            buttons: Ext.MessageBox.OK,
                                                            icon: Ext.MessageBox.INFO,
                                                            closable: false,
                                                            fn: function (btn) {
                                                                if (btn == 'ok') {
                                                                    Ext.getCmp("SZQTWin").close();
                                                                    BindData(1);
                                                                }
                                                            }
                                                        });
                                                    }
                                                }, CS.onError, value1,xlid);
                                            }
                                            else {
                                                return;
                                            }
                                        });
                                    }
                                },
                                {
                                    xtype: 'button',
                                    width: 100,
                                    text: '返回',
                                    handler: function () {
                                        this.up("window").close();
                                    }
                                }
                        ],
                        items: [
                            {
                                xtype: 'form',
                                layout: {
                                    type: 'fit'
                                },
                                id: 'form',
                                region: 'center',
                                items: [
                                    {
                                        xtype: 'gridpanel',
                                        id: 'userpanel',
                                        store: userstore,
                                        selModel: Ext.create('Ext.selection.CheckboxModel', {
                                            selType: 'rowmodel',
                                            mode: 'SIMPLE'
                                        }),
                                        columnLines: true,
                                        columns: [
                                            {
                                                xtype: 'rownumberer',
                                                //这里可以设置你的宽度
                                                width: 35,
                                                sortable: false,
                                                menuDisabled: true,
                                            },
                                            {
                                                dataIndex: 'UserID',
                                                width: 75,
                                                text: 'UserID',
                                                hidden: true,
                                                sortable: false,
                                                menuDisabled: true
                                            },
                                            {
                                                dataIndex: 'UserName',
                                                flex: 1,
                                                text: '用户名称',
                                                sortable: false,
                                                menuDisabled: true
                                            }
                                        ]

                                    }
                                ]
                            }
                        ]
                    }
            ]
        });

        me.callParent(arguments);
    }
});

Ext.define('addWin', {
    extend: 'Ext.window.Window',

    height: 150,
    width: 400,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '线路档案编辑',

    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'form',
                id: 'addform',
                frame: true,
                bodyPadding: 10,
                title: '',
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: '线路ID',
                        id: 'traderId',
                        name: 'traderId',
                        labelWidth: 70,
                        hidden: true,
                        anchor: '100%'
                    },
                    {
                        xtype: 'combobox',
                        id: 'fromOfficeId',
                        name: 'fromOfficeId',
                        fieldLabel: '起始办事处',
                        editable: false,
                        store: frombscstore,
                        queryMode: 'local',
                        displayField: 'TEXT',
                        valueField: 'VALUE',
                        labelWidth: 70,
                        allowBlank: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'combobox',
                        id: 'toOfficeId',
                        name: 'toOfficeId',
                        fieldLabel: '到达办事处',
                        editable: false,
                        store: tobscstore,
                        queryMode: 'local',
                        displayField: 'TEXT',
                        valueField: 'VALUE',
                        labelWidth: 70,
                        allowBlank: false,
                        anchor: '100%'
                    }
                ],
                buttonAlign: 'center',
                buttons: [
                    {
                        text: '确定',
                        handler: function () {
                            var form = Ext.getCmp('addform');
                            if (form.form.isValid()) {
                                //取得表单中的内容
                                var values = form.form.getValues(false);
                                var me = this;
                                CS('CZCLZ.XLMag.SaveXL', function (retVal) {
                                    if (retVal) {
                                        Ext.Msg.show({
                                            title: '提示',
                                            msg: '保存成功!',
                                            buttons: Ext.MessageBox.OK,
                                            icon: Ext.MessageBox.INFO
                                        });
                                        BindData(1);
                                    }
                                    me.up('window').close()
                                }, CS.onError, values);
                            }
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

//************************************弹出界面***************************************

//************************************主界面*****************************************
Ext.onReady(function () {
    Ext.define('XLView', {
        extend: 'Ext.container.Viewport',

        layout: {
            type: 'fit'
        },

        initComponent: function () {
            var me = this;
            me.items = [
                {
                    xtype: 'gridpanel',
                    id: 'XLGrid',
                    store: XLStore,
                    columnLines: true,
                    columns: [Ext.create('Ext.grid.RowNumberer'),
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'fromOfficeName',
                            sortable: false,
                            menuDisabled: true,
                            width: 200,
                            text: '起始办事处'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'toOfficeName',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '到达办事处'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'XGQT',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '相关前台'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'traderId',
                            sortable: false,
                            menuDisabled: true,
                            text: '操作',
                            width: 200,
                            renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                return "<a href='JavaScript:void(0)' onclick='SZQTFZR(\"" + value + "\",\"" + record.data.fromOfficeName + "\",\"" + record.data.toOfficeName
                                    + "\")'>设置前台负责人</a>&nbsp;<a href='JavaScript:void(0)' onclick='xg(\""
                                    + value + "\")'>修改</a>&nbsp;<a href='JavaScript:void(0)' onclick='del(\""
                                    + value + "\")'>删除</a>";
                            }
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
                                    xtype: 'textfield',
                                    id: 'cx_keyword',
                                    labelWidth: 60,
                                    fieldLabel: '关键字'
                                },
                                {
                                    xtype: 'buttongroup',
                                    title: '',
                                    items: [
                                        {
                                            xtype: 'button',
                                            iconCls: 'search',
                                            text: '查询',
                                            handler: function () {
                                                BindData(1);
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype: 'buttongroup',
                                    title: '',
                                    items: [
                                        {
                                            xtype: 'button',
                                            iconCls: 'add',
                                            text: '新增',
                                            handler: function () {
                                                var win = new addWin();
                                                win.show();
                                                GetfromBsc();
                                                GettoBsc();
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'pagingtoolbar',
                            displayInfo: true,
                            store: XLStore,
                            dock: 'bottom'
                        }
                    ]
                }
            ];
            me.callParent(arguments);
        }
    });

    new XLView();
    BindData(1);

})
//************************************主界面*****************************************