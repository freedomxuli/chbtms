//0 大车 1 小车
var kind = queryString.kind;
var pageSize = 20;
//************************************数据源*****************************************
var ClStore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
        { name: 'driverId' },
       { name: 'officeId' },
       { name: 'officeName' },
       { name: 'kind' },
       { name: 'people' },
       { name: 'peopleCode' },
       { name: 'shenfenzheng' },
       { name: 'address' },
       { name: 'tel' },
       { name: 'carNum' },
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
    CS('CZCLZ.ClMag.GetClList', function (retVal) {
        ClStore.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize,kind, Ext.getCmp("cx_keyword").getValue());
}
//************************************数据源*****************************************

//************************************页面方法***************************************
function xg(id) {
    CS('CZCLZ.ClMag.GetClById', function (retVal) {
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
            CS('CZCLZ.ClMag.DeleteCl', function (retVal) {
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

    height: 320,
    width: 400,
    layout: {
        type: 'fit'
    },
    closeAction:'destroy',
    modal:true,
    title: '车辆档案编辑',

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
                        fieldLabel: '车辆ID',
                        id: 'driverId',
                        name: 'driverId',
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
                        fieldLabel: '联系人',
                        id: 'people',
                        name: 'people',
                        labelWidth: 70,
                        allowBlank: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '助记码',
                        id: 'peopleCode',
                        name: 'peopleCode',
                        labelWidth: 70,
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
                        fieldLabel: '身份证',
                        id: 'shenfenzheng',
                        name: 'shenfenzheng',
                        labelWidth: 70,
                        anchor: '100%'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '车牌号',
                        id: 'carNum',
                        name: 'carNum',
                        labelWidth: 70,
                        allowBlank: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'textareafield',
                        id: 'address',
                        name: 'address',
                        fieldLabel: '地址',
                        labelWidth: 70,
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
                                CS('CZCLZ.ClMag.SaveCl', function (retVal) {
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
                                },CS.onError,values,kind);
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
    Ext.define('ClView', {
        extend: 'Ext.container.Viewport',

        layout: {
            type: 'fit'
        },

        initComponent: function() {
            var me = this;
            me.items = [
                {
                    xtype: 'gridpanel',
                    id: 'ClGrid',
                    store: ClStore,
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
                            dataIndex: 'people',
                            sortable: false,
                            menuDisabled: true,
                            width: 200,
                            text: '联系人'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'peopleCode',
                            sortable: false,
                            menuDisabled: true,
                            width: 200,
                            text: '助记码'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'tel',
                            sortable: false,
                            menuDisabled: true,
                            width: 200,
                            text: '电话'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'shenfenzheng',
                            sortable: false,
                            menuDisabled: true,
                            width: 200,
                            text: '身份证'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'address',
                            sortable: false,
                            menuDisabled: true,
                            width: 200,
                            text: '地址'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'carNum',
                            sortable: false,
                            menuDisabled: true,
                            width: 200,
                            text: '车牌号'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'driverId',
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
                                                var win = new addWin();
                                                if (kind == 0) {
                                                    win.setTitle("大车档案编辑");
                                                } else if (kind == 1) {
                                                    win.setTitle("小车档案编辑");
                                                } else { win.setTitle("车辆档案编辑"); }
                                                win.show();
                                                GetBsc();
                                                
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'pagingtoolbar',
                            displayInfo: true,
                            store: ClStore,
                            dock: 'bottom'
                        }
                    ]
                }
            ];
            me.callParent(arguments);
        }
    });
    
    new ClView();
    BindData(1);
})
//************************************主界面*****************************************