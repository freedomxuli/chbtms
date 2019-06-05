//-----------------------------------------------------------全局变量-----------------------------------------------------------------
var pageSize = 15;
var cx_role;
var cx_yhm;
var cx_xm;
//-----------------------------------------------------------数据源-------------------------------------------------------------------
//查询界面角色store
var roleStore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'roleId' },
        { name: 'roleName' }
    ]
});

var yhstore = createSFW4Store({
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

//编辑页面角色store
var roleStore1 = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'roleId' },
        { name: 'roleName' }
    ]
});

//编辑页面从属办事处store
var csbscStore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'VALUE' },
        { name: 'TEXT' }
    ]
});

var officeStore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'officeId' },
        { name: 'officeName' },
        { name: 'glzt' }
    ]
});
var officeSelStore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'officeId' },
        { name: 'officeName' },
        { name: 'glzt' }
    ]
});
var employStore = Ext.create('Ext.data.Store', {
    fields: [
        'employId', 'officeId', 'employName', 'glzt'
    ]
});
var employSelStore = Ext.create('Ext.data.Store', {
    fields: [
        'employId', 'officeId', 'employName', 'glzt'
    ]
});
//-----------------------------------------------------------页面方法-----------------------------------------------------------------
//获取查询页面角色
function loadSearchJs() {
    CS('CZCLZ.YHGLClass.GetRole', function (retVal) {
        if (retVal) {
            roleStore.removeAll();
            roleStore.add([{ 'roleId': '', 'roleName': '全部角色' }]);
            roleStore.loadData(retVal, true);
            Ext.getCmp("cx_role").setValue('');
        }
    }, CS.onError);
}

//获取人员list
function getUser(nPage) {
    cx_role = Ext.getCmp("cx_role").getValue();
    cx_yhm = Ext.getCmp("cx_yhm").getValue();
    cx_xm = Ext.getCmp("cx_xm").getValue();

    CS('CZCLZ.YHGLClass.GetUserList', function (retVal) {
        yhstore.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize, cx_role, cx_yhm, cx_xm);
}

function loadEdit(r) {
    MCS(
        function (ret) {
            var retVal = ret[0].retVal;
            roleStore1.loadData(retVal);
            var retVal2 = ret[1].retVal;
            csbscStore.loadData(retVal2);

            if (r) {
                var form = Ext.getCmp('addform');
                form.form.setValues(r);
            }
        }, CS.onError,
        {
            ctx: 'CZCLZ.YHGLClass.GetRole', args: []
        }
        ,
        {
            ctx: 'CZCLZ.BscMag.GetBsc', args: []
        }
    );
}

function loadGrid(id) {
    MCS(
        function (ret) {
            var retVal = ret[0].retVal;
            officeStore.loadData(retVal);
            var retVal2 = ret[1].retVal;
            employStore.loadData(retVal2);

            var retVal3 = ret[2].retVal;
            var model = Ext.getCmp('ofgrid').getSelectionModel();
            var arr = [];
            officeStore.each(function (record) {
                for (var i = 0; i < retVal3.offDt.length; i++) {
                    if (record.data.officeId == retVal3.offDt[i].officeId) {
                        arr.push(record);
                    }
                }
            });
            model.select(arr);
            
            var model2 = Ext.getCmp('emgrid').getSelectionModel();
            var arr = [];
            employStore.each(function (record) {
                for (var i = 0; i < retVal3.traderDt.length; i++) {
                    if (record.data.employId == retVal3.traderDt[i].traderId) {
                        arr.push(record);
                    }
                }
            });
            model2.select(arr);
        }, CS.onError,
        {
            ctx: 'CZCLZ.YHGLClass.GetBscByCompany', args: []
        },
        {
            ctx: 'CZCLZ.YHGLClass.GetEmployByCompany', args: []
        },
        {
            ctx: 'CZCLZ.YHGLClass.GetUserGlBscAndYwy', args: [id]
        }
    );
}

//关联办事处显示
function showOffice(userId) {
    CS('CZCLZ.BscMag.GetUserBsc', function (retVal) {
        if (retVal.officeGlDt.length > 0) {
            OfficeStore.removeAll();
            OfficeStore.loadData(retVal.officeGlDt);
            for (var i = 0; i < OfficeStore.data.length; i++) {
                if (OfficeStore.getAt(i).data.glzt == 1) {
                    sm_office.select(OfficeStore.getAt(i));
                }
            }
            showEmploy(userId, 0);

        }
    }, CS.onError, userId)
}

//编辑用户
function EditUser(id) {
    var r = yhstore.findRecord("UserID", id).data;
    var win = new addWin({ title: '用户修改' });
    win.show(null, function () {
        loadEdit(r);
        loadGrid(id);
    });
}
//-----------------------------------------------------------用户编辑界面-----------------------------------------------------------------
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
                                store: csbscStore,
                                queryMode: 'local',
                                displayField: 'TEXT',
                                valueField: 'VALUE'
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
                                store: officeStore,
                                width: 300,
                                selModel: sm_office,
                                id: 'ofgrid',
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
                                    deselect: function (model, record, index) {//取消选中时产生的事件
                                        record.data.glzt = 0;

                                        //选择预存
                                        for (var i = 0; i < officeSelStore.data.length; i++) {
                                            if (officeSelStore.data.items[i].data.officeId == record.data.officeId) {
                                                officeSelStore.remove(officeSelStore.data.items[i]);
                                            }
                                        }
                                    },
                                    select: function (model, record, index) {//record被选中时产生的事件
                                        record.data.glzt = 1;

                                        //选择预存
                                        var n = 1;
                                        if (officeSelStore.data.length > 0) {
                                            for (var i = 0; i < officeSelStore.data.length; i++) {
                                                if (officeSelStore.data.items[i].data.officeId == record.data.officeId) {
                                                    n--;
                                                }
                                            }
                                        }
                                        if (n == 1) {
                                            officeSelStore.add(record.data);
                                        }
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
                                store: employStore,
                                selModel: sm_emp,
                                id: 'emgrid',
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
                                ],
                                listeners: {
                                    deselect: function (model, record, index) {//取消选中时产生的事件
                                        record.data.glzt = 0;

                                        //选择预存
                                        for (var i = 0; i < employSelStore.data.length; i++) {
                                            if (employSelStore.data.items[i].data.employId == record.data.employId) {
                                                employSelStore.remove(employSelStore.data.items[i]);
                                            }
                                        }
                                    },
                                    select: function (model, record, index) {//record被选中时产生的事件
                                        record.data.glzt = 1;

                                        //选择预存
                                        var n = 1;
                                        if (employSelStore.data.length > 0) {
                                            for (var i = 0; i < employSelStore.data.length; i++) {
                                                if (employSelStore.data.items[i].data.employId == record.data.employId) {
                                                    n--;
                                                }
                                            }
                                        }
                                        if (n == 1) {
                                            employSelStore.add(record.data);
                                        }
                                    }
                                }
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

                                var xzlist = [];
                                for (var i = 0; i < officeSelStore.data.items.length; i++) {
                                    xzlist.push(officeSelStore.data.items[i].data);
                                }
                                var xzlist2 = [];
                                for (var i = 0; i < employSelStore.data.items.length; i++) {
                                    xzlist2.push(employSelStore.data.items[i].data);
                                }
                                CS('CZCLZ.YHGLClass.SaveUser', function (retVal) {
                                    if (retVal) {
                                        me.up('window').close();
                                        getUser(1);
                                    }
                                }, CS.onError, values, xzlist, xzlist2);

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

//-----------------------------------------------------------界    面-----------------------------------------------------------------
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
                store: yhstore,
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
                                            var win = new addWin();
                                            win.show(null, function () {
                                                loadEdit();
                                                loadGrid();
                                                //showOffice('');
                                            });
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
                        store: yhstore,
                        dock: 'bottom'
                    }
                ]
            }
        ];
        me.callParent(arguments);
    }
});

Ext.onReady(function () {
    new YhView();

    //加载角色
    loadSearchJs();

    getUser(1);

})