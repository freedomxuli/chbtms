//办事处分组 0 总部 1 普通网点 
var pageSize = 20;
//************************************数据源*****************************************
var YwyStore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
       { name: 'employId' },
       { name: 'officeId' },
       { name: 'officeName' },
       { name: 'employCode' },
       { name: 'employName' },
       { name: 'sex' },
       { name: 'depId' },
       { name: 'tel' },
       { name: 'isFire' },
       { name: 'status' },
       { name: 'addtime' },
       { name: 'adduser' },
       { name: 'updatetime' },
       { name: 'updateuser' },
    ],          
    //sorters: [{ property: 'b', direction: 'DESC'}],
    onPageChange: function (sto, nPage, sorters) {
        BindData(nPage);
    }
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
    CS('CZCLZ.YwyMag.GetYwyList', function (retVal) {
        YwyStore.setData({
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
    var win = new addWin();
    win.show(null, function () {
        CS('CZCLZ.BscMag.GetBsc', function (retVal) {
            bscstore.loadData(retVal);
            CS('CZCLZ.YwyMag.GetYwyById', function (ret) {
                if (ret) {
                    var form = Ext.getCmp('addform');
                    form.form.setValues(ret[0]);
                }
            }, CS.onError, id);
        }, CS.onError)
    });
}

function del(id) {
    Ext.MessageBox.confirm("提示", "是否删除你所选?", function (obj) {
        if (obj == "yes") {
            CS('CZCLZ.YwyMag.DeleteYwy', function (retVal) {
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

//************************************页面方法***************************************

//************************************弹出界面***************************************
Ext.define('addWin', {
    extend: 'Ext.window.Window',

    height: 250,
    width: 400,
    layout: {
        type: 'fit'
    },
    closeAction:'destroy',
    modal:true,
    title: '业务员档案编辑',

    initComponent: function() {
        var me = this;
        me.items = [
            {
                xtype: 'form',
                id:'addform',
                frame: true,
                bodyPadding: 10,
                title: '',
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: '业务员ID',
                        id: 'employId',
                        name: 'employId',
                        labelWidth: 70,
                        hidden:true,
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
                        fieldLabel: '姓名',
                        id: 'employName',
                        name: 'employName',
                        labelWidth: 70,
                        allowBlank: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '编码',
                        id: 'employCode',
                        name: 'employCode',
                        labelWidth: 70,
                        anchor: '100%'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '手机',
                        id: 'tel',
                        name: 'tel',
                        labelWidth: 70,
                        anchor: '100%'
                    },
                    {
                        xtype: 'combobox',
                        id: 'isFire',
                        name: 'isFire',
                        fieldLabel: '是否离职',
                        editable: false,
                        value:1,
                        store:  Ext.create('Ext.data.Store', {
                            fields: ['VALUE', 'TEXT'],
                            data: [
                                { 'VALUE': 0, 'TEXT': '是' }, { 'VALUE': 1, 'TEXT': '否' }
                            ]
                        }),
                        queryMode: 'local',
                        displayField: 'TEXT',
                        valueField: 'VALUE',
                        labelWidth: 70,
                        allowBlank: false,
                        anchor: '100%'
                    }
                ],
                buttonAlign:'center',
                buttons:[
                    {
                        text: '确定',
                        handler: function () {
                            var form=Ext.getCmp('addform');
                            if (form.form.isValid())
                            {
                                //取得表单中的内容
                                var values = form.form.getValues(false);
                                var me=this;
                                CS('CZCLZ.YwyMag.SaveYwy', function (retVal) {
                                    if(retVal)
                                    {
                                        Ext.Msg.show({
                                            title: '提示',
                                            msg: '保存成功!',
                                            buttons: Ext.MessageBox.OK,
                                            icon: Ext.MessageBox.INFO
                                        });
                                        BindData(1);
                                    }
                                    me.up('window').close()
                                },CS.onError,values);
                            }
                        }
                    },
                    {
                        text: '取消',
                        handler: function() {
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
    Ext.define('YwyView', {
        extend: 'Ext.container.Viewport',

        layout: {
            type: 'fit'
        },

        initComponent: function() {
            var me = this;
            me.items = [
                {
                    xtype: 'gridpanel',
                    id:'YwyGrid',
                    store: YwyStore,
                    columnLines:true,
                    columns: [Ext.create('Ext.grid.RowNumberer'),
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'officeName',
                            sortable: false,
                            menuDisabled: true,
                            width:200,
                            text: '办事处'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'employName',
                            sortable: false,
                            menuDisabled: true,
                            flex:1,
                            text: '姓名'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'employCode',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '编码'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'tel',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '手机'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'isFire',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '是否离职',
                            renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                var str = "";
                                if (value == 0) {
                                    str = "是"
                                } else if (value == 1) {
                                    str = "否";
                                }
                                return str;
                            }

                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'employId',
                            sortable: false,
                            menuDisabled: true,
                            text: '操作',
                            width:200,
                            renderer : function(value, cellmeta, record, rowIndex, columnIndex, store){ 
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
                                            handler:function(){
                                                var win=new addWin();
                                                win.show(null, function () {
                                                    CS('CZCLZ.BscMag.GetBsc', function (retVal) {
                                                        bscstore.loadData(retVal);
                                                        Ext.getCmp("officeId").setValue(retVal[0]["VALUE"]);
                                                    }, CS.onError)
                                                });
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'pagingtoolbar',
                            displayInfo: true,
                            store: YwyStore,
                            dock: 'bottom'
                        }
                    ]
                }
            ];
            me.callParent(arguments);
        }
    });
    
    new YwyView();
    BindData(1);
   
})
//************************************主界面*****************************************