//办事处分组 0 总部 1 普通网点 
var pageSize = 20;
//************************************数据源*****************************************
var BscStore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
        { name: 'officeId' },
        { name: 'officeCode' },
        { name: 'officeName' },
        { name: 'officeGroup' },
        { name: 'officeTel' },
        { name: 'officePeople' },
        { name: 'officeAddress' },
        { name: 'officeHead' },
        { name: 'officeMemo' },
        { name: 'status' },
        { name: 'addtime' },
        { name: 'adduser' },
        { name: 'updatetime' },
        { name: 'updateuser' },
        { name: 'xh' }
    ],
    //sorters: [{ property: 'b', direction: 'DESC'}],
    onPageChange: function (sto, nPage, sorters) {
        BindData(nPage);
    }
});
function BindData(nPage) {
    CS('CZCLZ.BscMag.GetBscList', function (retVal) {
        BscStore.setData({
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
    CS('CZCLZ.BscMag.GetBscById', function (retVal) {
        if (retVal) {
            var win = new addWin({ id: id });
            win.show(null, function () {
                var form = Ext.getCmp('addform');
                form.form.setValues(retVal[0]);
            });
        }
    }, CS.onError, id);
}

function del(id) {
    CS('CZCLZ.YDMag.DelBscByOfficeIsExistCheck', function (retVal) {
        if (retVal.length > 0) {
            Ext.Msg.show({
                title: '提示',
                msg: '该办事处存在运单，无法删除!',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.INFO
            });
            return;
        }
        Ext.MessageBox.confirm("提示", "是否删除你所选?", function (obj) {
            if (obj == "yes") {
                CS('CZCLZ.BscMag.DeleteBsc', function (retVal) {
                    if (retVal) {
                        BindData(1);
                    }
                }, CS.onError, id);
            }
            else {
                return;
            }
        });
    }, CS.onError, id);
}

//************************************页面方法***************************************

//************************************弹出界面***************************************
Ext.define('addWin', {
    extend: 'Ext.window.Window',

    height: 400,
    width: 400,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '办事处档案编辑',

    initComponent: function () {
        var me = this;
        var offid = me.id;
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
                        fieldLabel: '办事处ID',
                        id: 'officeId',
                        name: 'officeId',
                        labelWidth: 70,
                        hidden: true,
                        anchor: '100%'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '办事处代码',
                        id: 'officeCode',
                        name: 'officeCode',
                        labelWidth: 70,
                        allowBlank: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '办事处名称',
                        id: 'officeName',
                        name: 'officeName',
                        labelWidth: 70,
                        allowBlank: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'combobox',
                        id: 'officeGroup',
                        name: 'officeGroup',
                        fieldLabel: '办事处分组',
                        editable: false,
                        store: Ext.create('Ext.data.Store', {
                            fields: ['VALUE', 'TEXT'],
                            data: [
                                { 'VALUE': 0, 'TEXT': '总部' }, { 'VALUE': 1, 'TEXT': '普通网点' }
                            ]
                        }),
                        queryMode: 'local',
                        displayField: 'TEXT',
                        valueField: 'VALUE',
                        labelWidth: 70,
                        allowBlank: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '单据前缀',
                        id: 'officeHead',
                        name: 'officeHead',
                        labelWidth: 70,
                        allowBlank: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '电话',
                        id: 'officeTel',
                        name: 'officeTel',
                        labelWidth: 70,
                        anchor: '100%'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '联系人',
                        id: 'officePeople',
                        name: 'officePeople',
                        labelWidth: 70,
                        anchor: '100%'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '地址',
                        id: 'officeAddress',
                        name: 'officeAddress',
                        labelWidth: 70,
                        anchor: '100%'
                    },
                    {
                        xtype: 'textareafield',
                        id: 'officeMemo',
                        name: 'officeMemo',
                        fieldLabel: '备注',
                        labelWidth: 70,
                        anchor: '100%'
                    },
                    {
                        xtype: 'numberfield',
                        id: 'xh',
                        name: 'xh',
                        fieldLabel: '序号',
                        labelWidth: 70,
                        anchor: '100%',
                        minValue: 0,
                        allowBlank: false
                    }
                ],
                buttonAlign: 'center',
                buttons: [
                    {
                        text: '确定',
                        handler: function () {
                            //if (Ext.getCmp("officeHead").getValue().length > 2) {
                            //    Ext.Msg.show({
                            //        title: '提示',
                            //        msg: '单据前缀只能两位!',
                            //        buttons: Ext.MessageBox.OK,
                            //        icon: Ext.MessageBox.INFO
                            //    });
                            //    return;
                            //}

                            var form = Ext.getCmp('addform');
                            if (form.form.isValid()) {
                                //取得表单中的内容
                                var values = form.form.getValues(false);
                                var me = this;
                                CS('CZCLZ.BscMag.SaveBsc', function (retVal) {
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
    Ext.define('BscView', {
        extend: 'Ext.container.Viewport',

        layout: {
            type: 'fit'
        },

        initComponent: function () {
            var me = this;
            me.items = [
                {
                    xtype: 'gridpanel',
                    id: 'BscGrid',
                    store: BscStore,
                    columnLines: true,
                    columns: [Ext.create('Ext.grid.RowNumberer'),
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'officeCode',
                        sortable: false,
                        menuDisabled: true,
                        width: 100,
                        text: '办事处代码'
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'officeName',
                        sortable: false,
                        menuDisabled: true,
                        flex: 1,
                        text: '办事处名称'
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'officeGroup',
                        sortable: false,
                        menuDisabled: true,
                        width: 100,
                        text: '办事处分组',
                        renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                            var str = "";
                            if (value == 0) {
                                str = "总部";
                            } else if (value == 1) {
                                str = "普通网点";
                            }
                            return str;
                        }
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'officeHead',
                        sortable: false,
                        menuDisabled: true,
                        width: 100,
                        text: '单据前缀'
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'officeTel',
                        sortable: false,
                        menuDisabled: true,
                        width: 120,
                        text: '电话'
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'officePeople',
                        sortable: false,
                        menuDisabled: true,
                        width: 200,
                        text: '联系人'
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'officeAddress',
                        sortable: false,
                        menuDisabled: true,
                        width: 100,
                        text: '地址'
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'officeMemo',
                        sortable: false,
                        menuDisabled: true,
                        flex: 1,
                        text: '备注'
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'officeId',
                        sortable: false,
                        menuDisabled: true,
                        text: '操作',
                        width: 100,
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
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'pagingtoolbar',
                            displayInfo: true,
                            store: BscStore,
                            dock: 'bottom'
                        }
                    ]
                }
            ];
            me.callParent(arguments);
        }
    });

    new BscView();
    BindData(1);
})
//************************************主界面*****************************************