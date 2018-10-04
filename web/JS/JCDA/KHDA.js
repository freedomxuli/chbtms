var combinList = [];
var pageSize = 20;
//************************************数据源*****************************************
var KHStore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
       { name: 'clientId' },
       { name: 'officeId' },
       { name: 'officeName' },
       { name: 'people' },
       { name: 'tel' },
       { name: 'address' },
       { name: 'peopleCode' },
       { name: 'compName' },
       { name: 'yhyds' },
       { name: 'status' },
       { name: 'addtime' },
       { name: 'adduser' },
       { name: 'updatetime' },
       { name: 'updateuser' }
    ],
    //sorters: [{ property: 'b', direction: 'DESC'}],
    onPageChange: function (sto, nPage, sorters) {
        BindData(nPage);
    }
});

var CombinKHStore = new Ext.data.Store({
    fields: ['clientId', 'officeId', 'officeName', 'people', 'tel', 'address', 'peopleCode', 'compName', 'yhyds']
});

var bscstore = Ext.create('Ext.data.Store', {
    fields: ['VALUE', 'TEXT'],
    data: [
    ]
});

function GetBsc() {
    CS('CZCLZ.BscMag.GetBsc', function (retVal) {
        bscstore.loadData(retVal);
        Ext.getCmp("officeId").setValue(retVal[0]["VALUE"]);
    }, CS.onError)
}

function BindData(nPage) {
    CS('CZCLZ.KHMag.GetKHList', function (retVal) {
        KHStore.setData({
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
    CS('CZCLZ.KHMag.GetKHById', function (retVal) {
        if (retVal) {
            var win = new addWin();
            win.show(null, function () {
                GetBsc();
                var form = Ext.getCmp('addform');
                form.form.setValues(retVal[0]);
            });
        }
    }, CS.onError, id);
}

function del(id) {
    Ext.MessageBox.confirm("提示", "是否删除你所选?", function (obj) {
        if (obj == "yes") {
            CS('CZCLZ.KHMag.DeleteKH', function (retVal) {
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


function combinKH() {
    var grid = Ext.getCmp('KHGrid');
    var selRecord = grid.getSelectionModel().getSelection();
    if (selRecord.length < 1) {
        Ext.Msg.alert('提示', '合并客户操作需要选择两个或以上的客户！');
        return;
    }
    var idArr = [];
    Ext.each(selRecord, function (record) {
        idArr.push(record.data.clientId);
    });
    combinList = idArr;
    CS('CZCLZ.KHMag.CombinKHList', function (retVal) {
        CombinKHStore.loadData(retVal);
    }, CS.onError, idArr);
    var win = Ext.create('CombinKHWindow');
    win.show();
}

//************************************页面方法***************************************

//************************************弹出界面***************************************
Ext.define('CombinKHWindow', {
    extend: 'Ext.window.Window',

    height: 400,
    width: 800,
    resizable: false,
    layout: {
        type: 'border'
    },
    title: '合并客户',
    modal: true,
    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'panel',
                    bodyPadding: 4,
                    layout: 'border',
                    region: 'center',
                    border: false,
                    items: [
                        {
                            xtype: 'panel',
                            border: false,
                            region: 'center',
                            layout: 'border',
                            items: [
                                {
                                    xtype: 'gridpanel',
                                    region: 'center',
                                    selModel: Ext.create('Ext.selection.CheckboxModel'),
                                    id: 'krGrid',
                                    store: CombinKHStore,
                                    columnLines:true,
                                    dockedItems: [
                                        {
                                            xtype: 'toolbar',
                                            dock: 'top',
                                            items: [
                                                {
                                                    xtype: 'buttongroup',
                                                    items: [
                                                        {
                                                            xtype: 'button',
                                                            text: '合并',
                                                            iconCls: 'auth',
                                                            handler: function () {
                                                                var grid = Ext.getCmp('krGrid');
                                                                var selRecord = grid.getSelectionModel().getSelection();
                                                                var count = selRecord.length;
                                                                if (count < 1) {
                                                                    Ext.Msg.alert('提示', "请选择合并主商品！");
                                                                    return;
                                                                }
                                                                else if (count > 1) {
                                                                    Ext.Msg.alert('提示', "只能选择一个主商品！");
                                                                    return;
                                                                }
                                                                Ext.MessageBox.confirm('确认', '是否合并这些商品', function (btn) {
                                                                    if (btn === "yes") {
                                                                        var newid = selRecord[0].data.clientId;
                                                                        CS('CZCLZ.KHMag.CombinKH', function (retVal) {
                                                                            if (retVal) {
                                                                                Ext.Msg.show({
                                                                                    title: '提示',
                                                                                    msg: '合并成功!',
                                                                                    buttons: Ext.MessageBox.OK,
                                                                                    icon: Ext.MessageBox.INFO
                                                                                });
                                                                                BindStore(1);
                                                                                me.close();
                                                                            }
                                                                        }, CS.onError, newid, combinList);
                                                                    }
                                                                });
                                                            }
                                                        },
                                                        {
                                                            xtype: 'button',
                                                            text: '取消',
                                                            iconCls: 'close',
                                                            handler: function () {
                                                                me.close();
                                                            }
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ],
                                    columns: [

                                        {
                                            text: '联系人',
                                            dataIndex: 'people',
                                            menuDisabled: true,
                                            width: 240
                                        },
                                        {
                                            text: '电话',
                                            dataIndex: 'tel',
                                            menuDisabled: true
                                        },
                                        {
                                            text: '地址',
                                            dataIndex: 'address',
                                            menuDisabled: true,
                                            sortable: false
                                        },
                                        {
                                            text: '编码',
                                            dataIndex: 'peopleCode',
                                            menuDisabled: true,
                                            sortable: false
                                        },
                                        {
                                            text: '公司名称',
                                            dataIndex: 'compName',
                                            menuDisabled: true,
                                            sortable: false
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

    height: 300,
    width: 400,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '客户档案编辑',

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
                        fieldLabel: '客户ID',
                        id: 'clientId',
                        name: 'clientId',
                        labelWidth: 70,
                        hidden: true,
                        anchor: '100%'
                    },
                    {
                        xtype: 'combobox',
                        id: 'officeId',
                        name: 'officeId',
                        fieldLabel: '办事处',
                        editable: false,
                        store: bscstore,
                        queryMode: 'local',
                        displayField: 'TEXT',
                        valueField: 'VALUE',
                        labelWidth: 70,
                        allowBlank: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '联系人',
                        id: 'people',
                        name: 'people',
                        labelWidth: 70,
                        allowBlank: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '电话',
                        id: 'tel',
                        name: 'tel',
                        labelWidth: 70,
                        anchor: '100%'
                    },
                     {
                         xtype: 'textfield',
                         fieldLabel: '地址',
                         id: 'address',
                         name: 'address',
                         labelWidth: 70,
                         anchor: '100%'
                     },
                    {
                        xtype: 'textfield',
                        fieldLabel: '编码',
                        id: 'peopleCode',
                        name: 'peopleCode',
                        labelWidth: 70,
                        anchor: '100%'
                    },
                     {
                         xtype: 'textareafield',
                         id: 'compName',
                         name: 'compName',
                         fieldLabel: '公司名称',
                         labelWidth: 70,
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
                                CS('CZCLZ.KHMag.SaveKH', function (retVal) {
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
    Ext.define('KHView', {
        extend: 'Ext.container.Viewport',

        layout: {
            type: 'fit'
        },

        initComponent: function () {
            var me = this;
            me.items = [
                {
                    xtype: 'gridpanel',
                    id: 'KHGrid',
                    store: KHStore,
                    columnLines: true,
                    selModel: Ext.create('Ext.selection.CheckboxModel'),
                    columns: [Ext.create('Ext.grid.RowNumberer'),
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'officeName',
                            sortable: false,
                            menuDisabled: true,
                            width: 200,
                            text: '办事处'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'people',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '联系人'
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
                            dataIndex: 'address',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '地址'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'peopleCode',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '编码'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'compName',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '公司名称'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'yhyds',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '已有运单数'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'clientId',
                            sortable: false,
                            menuDisabled: true,
                            text: '操作',
                            width: 200,
                            renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                return "<a href='JavaScript:void(0)' onclick='xg(\"" + value + "\")'>修改</a>&nbsp;<a href='JavaScript:void(0)' onclick='del(\"" + value + "\")'>删除</a>";
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
                                                GetBsc();
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
                                            iconCls: 'auth',
                                            text: '合并',
                                            handler: function () {
                                                combinKH();
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'pagingtoolbar',
                            displayInfo: true,
                            store: KHStore,
                            dock: 'bottom'
                        }
                    ]
                }
            ];
            me.callParent(arguments);
        }
    });

    new KHView();
    BindData(1);

})
//************************************主界面*****************************************