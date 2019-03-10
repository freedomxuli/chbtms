var pageSize = 15;
var cx_role;
var cx_yhm;
var cx_xm;
//************************************数据源*****************************************
var store = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
        { name: 'UserID' },
        { name: 'UserName' },
        { name: 'Password' },
        { name: 'roleId' },
        { name: 'roleName' },
        { name: 'UserXM' },
        { name: 'UserTel' },
        { name: 'csOfficeId' },
        { name: 'csOfficeName' }
    ],
    onPageChange: function (sto, nPage, sorters) {
        getUser(nPage);
    }
});


var roleStore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'roleId' },
        { name: 'roleName' }
    ]
});

var roleStore1 = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'roleId' },
        { name: 'roleName' }
    ]
});

var officeStore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'VALUE' },
        { name: 'TEXT' }
    ]
});


var EmployStore = Ext.create('Ext.data.Store', {
    fields: [
        'employId', 'officeId', 'employName', 'glzt'
    ]
});
var OfficeStore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'userId' },
        { name: 'officeId' },
        { name: 'officeName' },
        { name: 'glzt' }
    ]
});

var offidArr = [];
//************************************数据源*****************************************

//************************************页面方法***************************************
function getUser(nPage) {
    CS('CZCLZ.YHGLClass.GetUserList', function (retVal) {
        store.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize, Ext.getCmp("cx_role").getValue(), Ext.getCmp("cx_yhm").getValue(), Ext.getCmp("cx_xm").getValue());
}


function EditUser(id) {
    var r = store.findRecord("UserID", id).data;
    CS('CZCLZ.YHGLClass.GetRole', function (retVal) {
        if (retVal) {
            roleStore1.loadData(retVal, false);
            var win = new addWin();
            win.show(null, function () {
                showCsOffice();
                win.setTitle("用户修改");
                var form = Ext.getCmp('addform');
                form.form.setValues(r);
                showOffice(id);
            });
        }
    }, CS.onError);

}

//关联业务员显示
function showEmploy(userid, zt) {
    CS('CZCLZ.YwyMag.GetEmployByOffice', function (retVal) {
        EmployStore.removeAll();
        EmployStore.loadData(retVal);

        for (var i = 0; i < EmployStore.data.length; i++) {
            if (EmployStore.getAt(i).data.glzt == 1) {
                Ext.getCmp('emgri').selModel.select(EmployStore.getAt(i), true, false);
            }
        }
    }, CS.onError, userid, offidArr, zt)
}

//关联办事处显示
function showOffice(userId) {
    CS('CZCLZ.BscMag.GetUserBsc', function (retVal) {
        if (retVal.officeGlDt.length > 0) {
            OfficeStore.removeAll();
            OfficeStore.loadData(retVal.officeGlDt);
            for (var i = 0; i < OfficeStore.data.length; i++) {
                if (OfficeStore.getAt(i).data.glzt == 1) {
                    Ext.getCmp('ofgri').selModel.select(OfficeStore.getAt(i), true, false);
                }
            }
            showEmploy(userId, 0);

        }
    }, CS.onError, userId)
}

function showCsOffice() {
    CS('CZCLZ.BscMag.GetBsc', function (retVal) {
        if (retVal.length > 0) {
            officeStore.add([{ 'TEXT': '', 'VALUE': '' }]);
            officeStore.loadData(retVal, true);
        }
    }, CS.onError)
}
//************************************页面方法***************************************

//************************************弹出界面***************************************
Ext.define('addWin', {
    extend: 'Ext.window.Window',
    width: 600,
    height: 480,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '用户管理',
    initComponent: function () {
        var me = this;
        var sm_office = Ext.create('Ext.selection.CheckboxModel');
        var sm_emp = Ext.create('Ext.selection.CheckboxModel');
        me.items = [
            {
                xtype: 'form',
                id: 'addform',
                layout: {
                    type: 'border'
                },
                items: [
                    {
                        xtype: 'panel',
                        region: 'north',
                        height: 200,
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: 'ID',
                                id: 'UserID',
                                name: 'UserID',
                                labelWidth: 70,
                                hidden: true,
                                colspan: 2
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '用户名',
                                id: 'UserName',
                                name: 'UserName',
                                labelWidth: 70,
                                allowBlank: false,
                                anchor: '100%'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '密码',
                                id: 'Password',
                                name: 'Password',
                                labelWidth: 70,
                                allowBlank: false,
                                anchor: '100%'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '真实姓名',
                                id: 'UserXM',
                                name: 'UserXM',
                                labelWidth: 70,
                                allowBlank: false,
                                anchor: '100%'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '电话',
                                id: 'UserTel',
                                name: 'UserTel',
                                labelWidth: 70,
                                anchor: '100%'
                            },
                            {
                                xtype: 'combobox',
                                id: 'roleId',
                                name: 'roleId',
                                anchor: '100%',
                                fieldLabel: '角色',
                                allowBlank: false,
                                editable: false,
                                labelWidth: 70,
                                store: roleStore1,
                                queryMode: 'local',
                                displayField: 'roleName',
                                valueField: 'roleId',
                                value: ''
                            },
                            {
                                xtype: 'combobox',
                                id: 'csOfficeId',
                                name: 'csOfficeId',
                                anchor: '100%',
                                fieldLabel: '从属办事处',
                                allowBlank: false,
                                editable: false,
                                labelWidth: 70,
                                store: officeStore,
                                queryMode: 'local',
                                displayField: 'TEXT',
                                valueField: 'VALUE',
                                value: ''
                            }
                        ]
                    },
                    {
                        xtype: 'panel',
                        region: 'west',
                        width: 150,
                        height: 330,
                        title: '关联办事处',
                        layout: {
                            type: 'fit'
                        },
                        items: [
                            {
                                xtype: 'gridpanel',
                                store: OfficeStore,
                                width: 300,
                                selModel: sm_office,
                                id: 'ofgri',
                                columns: [
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'officeName',
                                        width: 298,
                                        sortable: false,
                                        menuDisabled: true,
                                        text: '办事处名称'
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'userId',
                                        width: 298,
                                        sortable: false,
                                        menuDisabled: true,
                                        hidden: true
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'officeId',
                                        width: 298,
                                        sortable: false,
                                        menuDisabled: true,
                                        hidden: true,
                                        text: '办事处ID'
                                    }
                                ],
                                listeners: {
                                    itemclick: function (value, record, item, index, e, eOpts) {

                                    },
                                    deselect: function (model, record, index) {//取消选中时产生的事件
                                        var userid = record.data.userId == null ? '' : record.data.userId;
                                        var offid = record.data.officeId;
                                        //for (var i = 0; i < EmployStore.data.length; i++) {
                                        //    if (EmployStore.data.items[i].data.officeId == offid) {
                                        //        EmployStore.remove(EmployStore.data.items[i]);
                                        //    }
                                        //}
                                        //Ext.getCmp("emgri").reconfigure(EmployStore);
                                        var index = offidArr.indexOf(offid);
                                        if (index > -1) {
                                            offidArr.splice(index, 1);
                                        }
                                        showEmploy(userid, 1);
                                    },
                                    select: function (model, record, index) {//record被选中时产生的事件
                                        var userid = record.data.userId == null ? '' : record.data.userId;
                                        var offid = record.data.officeId;
                                        offidArr.push(offid);
                                        showEmploy(userid, 1);
                                    }
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'panel',
                        region: 'center',
                        title: '关联业务员',
                        layout: {
                            type: 'fit'
                        },
                        items: [
                            {
                                xtype: 'gridpanel',
                                store: EmployStore,
                                selModel: sm_emp,
                                id: 'emgri',
                                width: 300,
                                columns: [
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'officeId',
                                        width: 298,
                                        sortable: false,
                                        menuDisabled: true,
                                        hidden: true
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'employId',
                                        width: 298,
                                        sortable: false,
                                        menuDisabled: true,
                                        hidden: true
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'employName',
                                        text: '业务员名称',
                                        sortable: false,
                                        menuDisabled: true,
                                    }
                                ]
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
                            var form = Ext.getCmp('addform');
                            if (form.form.isValid()) {
                                var values = form.form.getValues(false);
                                var me = this;

                                var officeGl = [];
                                var selOff = Ext.getCmp('ofgri').getSelectionModel().getSelection();
                                for (var i = 0; i < selOff.length; i++) {
                                    officeGl.push(selOff[i].get("officeId"))
                                }

                                var empGl = [];
                                var selEmp = Ext.getCmp('emgri').getSelectionModel().getSelection();
                                for (var i = 0; i < selEmp.length; i++) {
                                    empGl.push(selEmp[i].get("employId"))
                                }
                                CS('CZCLZ.YHGLClass.SaveUser', function (retVal) {
                                    if (retVal) {
                                        me.up('window').close();
                                        getUser(1);
                                    }
                                }, CS.onError, values, officeGl, empGl);

                            }
                        }
                    },
                    {
                        text: '取消',
                        iconCls: 'back',
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
    Ext.define('YhView', {
        extend: 'Ext.container.Viewport',

        layout: {
            type: 'fit'
        },

        initComponent: function () {
            var me = this;
            me.items = [
                {
                    xtype: 'gridpanel',
                    id: 'usergrid',
                    title: '',
                    store: store,
                    columnLines: true,
                    selModel: Ext.create('Ext.selection.CheckboxModel', {

                    }),
                    columns: [Ext.create('Ext.grid.RowNumberer'),
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'UserName',
                        sortable: false,
                        menuDisabled: true,
                        text: "登录名"
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'roleName',
                        sortable: false,
                        menuDisabled: true,
                        text: "角色"
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'UserXM',
                        sortable: false,
                        menuDisabled: true,
                        text: "姓名"
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'UserTel',
                        sortable: false,
                        menuDisabled: true,
                        text: "电话"
                    },
                    {
                        text: '操作',
                        dataIndex: 'UserID',
                        width: 120,
                        sortable: false,
                        menuDisabled: true,
                        renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                            var str;
                            str = "<a onclick='EditUser(\"" + value + "\");'>修改</a>";
                            return str;
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
                                    xtype: 'combobox',
                                    id: 'cx_role',
                                    width: 160,
                                    fieldLabel: '角色',
                                    editable: false,
                                    labelWidth: 40,
                                    store: roleStore,
                                    queryMode: 'local',
                                    displayField: 'roleName',
                                    valueField: 'roleId',
                                    value: ''
                                },
                                {
                                    xtype: 'textfield',
                                    id: 'cx_yhm',
                                    width: 140,
                                    labelWidth: 50,
                                    fieldLabel: '用户名'
                                },
                                {
                                    xtype: 'textfield',
                                    id: 'cx_xm',
                                    width: 160,
                                    labelWidth: 70,
                                    fieldLabel: '真实姓名'
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
                                                getUser(1);
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
                                                CS('CZCLZ.YHGLClass.GetRole', function (retVal) {
                                                    if (retVal) {
                                                        roleStore1.loadData(retVal, true);
                                                        var win = new addWin();

                                                        win.show(null, function () {
                                                            showOffice('');
                                                        });

                                                    }
                                                }, CS.onError);

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
                                            iconCls: 'delete',
                                            text: '删除',
                                            handler: function () {
                                                var idlist = [];
                                                var grid = Ext.getCmp("usergrid");
                                                var rds = grid.getSelectionModel().getSelection();
                                                if (rds.length == 0) {
                                                    Ext.Msg.show({
                                                        title: '提示',
                                                        msg: '请选择至少一条要删除的记录!',
                                                        buttons: Ext.MessageBox.OK,
                                                        icon: Ext.MessageBox.INFO
                                                    });
                                                    return;
                                                }

                                                Ext.MessageBox.confirm('删除提示', '是否要删除数据!', function (obj) {
                                                    if (obj == "yes") {
                                                        for (var n = 0, len = rds.length; n < len; n++) {
                                                            var rd = rds[n];

                                                            idlist.push(rd.get("UserID"));
                                                        }

                                                        CS('CZCLZ.YHGLClass.DelUser', function (retVal) {
                                                            if (retVal) {
                                                                getUser(1);
                                                            }
                                                        }, CS.onError, idlist);
                                                    }
                                                    else {
                                                        return;
                                                    }
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
                            store: store,
                            dock: 'bottom'
                        }
                    ]
                }
            ];
            me.callParent(arguments);
        }
    });

    new YhView();

    CS('CZCLZ.YHGLClass.GetRole', function (retVal) {
        if (retVal) {
            roleStore.add([{ 'roleId': '', 'roleName': '全部角色' }]);
            roleStore.loadData(retVal, true);
            Ext.getCmp("cx_role").setValue('');
        }
    }, CS.onError, "");

    cx_role = Ext.getCmp("cx_role").getValue();
    cx_yhm = Ext.getCmp("cx_yhm").getValue();
    cx_xm = Ext.getCmp("cx_xm").getValue();

    getUser(1);

})
//************************************主界面*****************************************