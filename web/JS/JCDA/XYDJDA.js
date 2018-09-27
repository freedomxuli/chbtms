//办事处分组 0 总部 1 普通网点 
var pageSize = 20;
//************************************数据源*****************************************
var XydjStore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
       { name: 'creditId' },
       { name: 'grade' },
       { name: 'minlimit' },
       { name: 'maxlimit' },
       { name: 'period' },
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
function BindData(nPage) {
    CS('CZCLZ.XydjMag.GetXydjList', function (retVal) {
        XydjStore.setData({
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
    CS('CZCLZ.XydjMag.GetXydjById', function (retVal) {
        if (retVal) {
            var win = new addWin();
            win.show(null, function () {
                var form = Ext.getCmp('addform');
                form.form.setValues(retVal[0]);
            });
        }
    }, CS.onError, id);
}

function del(id) {
    Ext.MessageBox.confirm("提示", "是否删除你所选?", function (obj) {
        if (obj == "yes") {
            CS('CZCLZ.XydjMag.DeleteXydj', function (retVal) {
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

    height: 200,
    width: 400,
    layout: {
        type: 'fit'
    },
    closeAction:'destroy',
    modal:true,
    title: '信用等级档案编辑',

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
                        fieldLabel: '信用等级ID',
                        id: 'creditId',
                        name: 'creditId',
                        labelWidth: 70,
                        hidden:true,
                        anchor: '100%'
                    },
                    {
                        xtype: 'numberfield',
                        fieldLabel: '信用等级',
                        id: 'grade',
                        name: 'grade',
                        labelWidth: 70,
                        allowDecimals: false,
                        allowBlank: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'numberfield',
                        fieldLabel: '最小额度',
                        id: 'minlimit',
                        name: 'minlimit',
                        labelWidth: 70,
                        allowBlank: false,
                        allowDecimals: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'numberfield',
                        fieldLabel: '最大额度',
                        id: 'maxlimit',
                        name: 'maxlimit',
                        labelWidth: 70,
                        allowBlank: false,
                        allowDecimals: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'numberfield',
                        fieldLabel: '信用周期',
                        id: 'period',
                        name: 'period',
                        labelWidth: 70,
                        allowBlank: false,
                        allowDecimals: false,
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
                                CS('CZCLZ.XydjMag.SaveXydj', function (retVal) {
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
Ext.onReady(function() {
    Ext.define('XydjView', {
        extend: 'Ext.container.Viewport',

        layout: {
            type: 'fit'
        },

        initComponent: function() {
            var me = this;
            me.items = [
                {
                    xtype: 'gridpanel',
                    id: 'XydjGrid',
                    store: XydjStore,
                    columnLines: true,
                    columns: [Ext.create('Ext.grid.RowNumberer'),
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'grade',
                            sortable: false,
                            menuDisabled: true,
                            width:200,
                            text: '信用等级',
                            
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'maxlimit',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '最大额度'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'period',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '信用周期',
                            renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                var str = "";
                                if (value) {
                                    str = value + "天";
                                }
                                return str;
                            }
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'officeId',
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
                                                win.show();
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'pagingtoolbar',
                            displayInfo: true,
                            store: XydjStore,
                            dock: 'bottom'
                        }
                    ]
                }
            ];
            me.callParent(arguments);
        }
    });
    
    new XydjView();
    BindData(1);
})
//************************************主界面*****************************************