
//-----------------------------------------------------------全局变量-----------------------------------------------------------------
var pageSize = 15;
//-----------------------------------------------------------数据源-------------------------------------------------------------------
//办事处store
var bscStore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'officeId' },
        { name: 'officeName' }
    ]
});

//核销store
var hxStore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
        { name: 'isbj' },
        { name: 'isxz' },
        { name: 'id' },
        { name: 'zhuangchedanId' },
        { name: 'zhuangchedanNum' },
        { name: 'money' },
        { name: 'yhxmoney' },
        { name: 'whxmoney' },
        { name: 'hxje' },
        { name: 'expenseDate' },
        { name: 'officeId' },
        { name: 'officeName' },
        { name: 'ddofficeName' },
        { name: 'toAdsPeople' },
        { name: 'toAdsTel' },
        { name: 'people' }
    ],
    onPageChange: function (sto, nPage, sorters) {
        gethkList(nPage);
    }
});

//核销选择预存store
var hxSelStore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'isbj' },//编辑
        { name: 'isxz' },//选择
        { name: 'id' },
        { name: 'zhuangchedanId' },
        { name: 'zhuangchedanNum' },
        { name: 'money' },
        { name: 'yhxmoney' },
        { name: 'whxmoney' },
        { name: 'hxje' },
        { name: 'expenseDate' },
        { name: 'officeId' },
        { name: 'officeName' },
        { name: 'ddofficeName' },
        { name: 'toAdsPeople' },
        { name: 'toAdsTel' },
        { name: 'people' }
    ],
    data: [
    ]
});

//日志store
var logStore = Ext.create('Ext.data.Store', {
    fields: [{ name: 'id' },
    { name: 'income_id' },
    { name: 'incomeDate' },
    { name: 'money' },
    { name: 'memo' },
    { name: 'addtime' },
    { name: 'adduser' },
    { name: 'UserXM' }
    ],
    data: [
    ]
});

//货品store
var HPStore = Ext.create('Ext.data.Store', {
    fields: [{ name: 'yundan_goods_id' },
    { name: 'yundan_chaifen_id' },
    { name: 'yundan_goodsName' },
    { name: 'yundan_goodsPack' },
    { name: 'yundan_goodsAmount' },
    { name: 'yundan_goodsWeight' },
    { name: 'yundan_goodsVolume' },
    { name: 'status' },
    { name: 'addtime' },
    { name: 'adduser' },
    { name: 'SP_ID' }
    ],
    data: [
    ]
});
//-----------------------------------------------------------页面方法-----------------------------------------------------------------
//获取办事处
function GetBsc() {
    CS('CZCLZ.BscMag.GetBsc2', function (retVal1) {
        bscStore.loadData(retVal1);
    }, CS.onError)
}

function getHxList(nPage) {
    var hxzt = Ext.getCmp("cx_hxzt").getValue();
    var bscid = Ext.getCmp("cx_bsc").getValue();
    var kssj = Ext.getCmp("start_time").getValue();
    var jssj = Ext.getCmp("end_time").getValue();
    var drivarName = Ext.getCmp("cx_drivarName").getValue();
    var zcdNum = Ext.getCmp("cx_zcdNum").getValue();
    CS('CZCLZ.Finance.GetYfHxOutListByPage', function (retVal) {
        hxSelStore.removeAll();
        hxStore.removeAll();
        hxStore.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize, hxzt, bscid, kssj, jssj, drivarName, zcdNum);
}

//做一个实际金额的联动合计
function setVal() {
    var whx = 0;
    var je = 0;

    for (var b = 0; b < hxSelStore.data.length; b++) {
        if (hxSelStore.data.items[b].data.isxz == 1) {
            whx += isNaN(Number(hxSelStore.data.items[b].data.whxmoney)) == null ? 0 : Number(hxSelStore.data.items[b].data.whxmoney);
            je += isNaN(Number(hxSelStore.data.items[b].data.hxje)) ? 0 : Number(hxSelStore.data.items[b].data.hxje);
        }
    }
    Ext.getCmp('sz_whx').setValue(whx);
    Ext.getCmp('sz_shx').setValue(je);
}

//查看货品
function LookGoods2(zcdid) {
    var win = new HPWin();
    win.show(null, function () {
        CS('CZCLZ.Finance.GetHPList2', function (retVal) {
            HPStore.loadData(retVal);
        }, CS.onError, zcdid);
    });
}

//-----------------------------------------------------------货品界面-----------------------------------------------------------------
Ext.define('HPWin', {
    extend: 'Ext.window.Window',

    height: 400,
    width: 600,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '货品查看',

    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'panel',
                layout: {
                    type: 'fit'
                },
                items: [
                    {
                        xtype: 'gridpanel',
                        id: 'hpgrid',
                        region: 'center',
                        border: true,
                        store: HPStore,
                        columnLines: true,
                        columns: [
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'SP_ID',
                                flex: 1,
                                text: "商品ID",
                                menuDisabled: true,
                                sortable: false,
                                hidden: true
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'yundan_goodsName',
                                flex: 1,
                                text: "货品名称",
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'yundan_goodsPack',
                                flex: 1,
                                text: '包装',
                                menuDisabled: true,
                                sortable: false

                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'yundan_goodsAmount',
                                flex: 1,
                                text: '件数',
                                menuDisabled: true,
                                sortable: false

                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'yundan_goodsWeight',
                                flex: 1,
                                text: '重量',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'yundan_goodsVolume',
                                flex: 1,
                                text: '体积',
                                menuDisabled: true,
                                sortable: false
                            }
                        ]
                    }
                ],
                buttonAlign: 'center',
                buttons: [
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
//-----------------------------------------------------------日志界面-----------------------------------------------------------------
Ext.define('LogWin', {
    extend: 'Ext.window.Window',

    height: 300,
    width: 500,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '日志',

    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'panel',
                layout: {
                    type: 'fit'
                },
                items: [
                    {
                        xtype: 'gridpanel',
                        region: 'center',
                        border: true,
                        store: logStore,
                        columnLines: true,
                        columns: [
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'id',
                                flex: 1,
                                menuDisabled: true,
                                sortable: false,
                                hidden: true
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'income_id',
                                flex: 1,
                                menuDisabled: true,
                                sortable: false,
                                hidden: true
                            },
                            {
                                xtype: 'datecolumn',
                                dataIndex: 'incomeDate',
                                width: 90,
                                format: 'Y-m-d',
                                text: '核销日期',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'money',
                                width: 130,
                                text: '核销金额',
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
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'UserXM',
                                width: 90,
                                text: '操作人',
                                menuDisabled: true,
                                sortable: false
                            }
                        ]
                    }
                ],
                buttonAlign: 'center',
                buttons: [
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
Ext.define('mainView', {
    extend: 'Ext.container.Viewport',

    layout: {
        type: 'fit'
    },
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'panel',
                layout: {
                    type: 'border'
                },
                items: [
                    {
                        xtype: 'panel',
                        height: 90,
                        region: 'north',
                        layout: {
                            type: 'border'
                        },
                        items: [
                            {
                                xtype: 'panel',
                                layout: {
                                    type: 'column'
                                },
                                region: 'west',
                                width: 800,
                                border: false,
                                items: [
                                    {
                                        xtype: 'textfield',
                                        id: 'sz_whx',
                                        width: 160,
                                        labelWidth: 100,
                                        height: 30,
                                        fieldLabel: '未核总额',
                                        columnWidth: 0.5,
                                        padding: '5 10 5 10',
                                        readOnly: true,
                                        fieldStyle: 'background-color: Gainsboro;background-image: none;'
                                    },
                                    {
                                        xtype: 'textfield',
                                        id: 'sz_shx',
                                        width: 160,
                                        labelWidth: 100,
                                        height: 30,
                                        fieldLabel: '实核总额',
                                        columnWidth: 0.5,
                                        padding: '5 10 5 10',
                                        readOnly: true,
                                        fieldStyle: 'background-color: Gainsboro;background-image: none;'
                                    },
                                    {
                                        xtype: 'textfield',
                                        id: 'sz_yhx',
                                        width: 160,
                                        labelWidth: 100,
                                        height: 30,
                                        fieldLabel: '应核销金额',
                                        columnWidth: 0.4,
                                        padding: '5 0 5 10'
                                    },
                                    {
                                        xtype: 'button',
                                        text: '分摊',
                                        columnWidth: 0.09,
                                        margin: '5 0 0 0 ',
                                        height: 30,
                                        handler: function () {
                                            var ftjg = Ext.getCmp('sz_yhx').getValue();//原分摊金额

                                            var jfje = ftjg;//剩余分摊金额
                                            var grid = Ext.getCmp('hxGridId');
                                            var gx = grid.getSelectionModel().getSelection();
                                            for (var i = 0; i < gx.length; i++) {
                                                var h = grid.getStore().indexOf(gx[i]);//行
                                                var id = grid.store.getAt(h).data.id;//核销ID
                                                var whx = grid.store.getAt(h).data.whxmoney;//未核销金额

                                                if (jfje > 0) {
                                                    var je = 0;//本次核销金额
                                                    if (jfje >= whx) {
                                                        je = whx;
                                                        jfje -= whx;
                                                    } else {
                                                        je = jfje;
                                                        jfje = 0;
                                                    }
                                                    grid.store.getAt(h).set('hxje', je);
                                                    for (var b = 0; b < hxSelStore.data.length; b++) {
                                                        if (hxSelStore.data.items[b].data.id == id) {
                                                            hxSelStore.data.items[b].data.hxje = je;
                                                        }
                                                    }
                                                } else {
                                                    break;
                                                }
                                            }
                                            //合计
                                            setVal();
                                            if (Number(jfje) > 0) {
                                                Ext.Msg.alert('提示', "分摊完毕后还剩余" + jfje + "元");
                                                return;
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'datefield',
                                        id: 'sz_hxrq',
                                        width: 160,
                                        labelWidth: 100,
                                        height: 30,
                                        format: 'Y-m-d',
                                        fieldLabel: '核销日期',
                                        columnWidth: 0.5,
                                        padding: '5 10 5 18'
                                    }
                                ]
                            },
                            {
                                region: 'center',
                                border: false
                            }
                        ]

                    },
                    {
                        xtype: 'gridpanel',
                        id: 'hxGridId',
                        region: 'center',
                        store: hxStore,
                        border: true,
                        columnLines: true,
                        plugins: [
                            Ext.create('Ext.grid.plugin.CellEditing', {
                                clicksToEdit: 1                                                                                                                                                                                                                                                                      //设置单击单元格编辑  
                            })
                        ],
                        listeners: {
                            'beforeedit': function (editor, e) {
                                //checkbox置为不可选择
                                var grid = Ext.getCmp('hxGridId').store;
                                for (var a = 0; a < grid.data.items.length; a++) {
                                    if (grid.data.items[a].data.isxz == 1) {
                                        grid.data.items[a].data.isbj = true;
                                    }
                                }
                            },
                            'edit': function (editor, e) {
                                //checkbox置为可选择
                                var grid = Ext.getCmp('hxGridId').store;
                                for (var a = 0; a < grid.data.items.length; a++) {
                                    if (grid.data.items[a].data.isxz == 1) {
                                        grid.data.items[a].data.isbj = false;
                                    }
                                }

                                //预存store更新
                                if (hxSelStore.data.length > 0) {
                                    for (var i = 0; i < hxSelStore.data.length; i++) {
                                        if (hxSelStore.data.items[i].data.id == e.record.data.id) {
                                            hxSelStore.data.items[i].data.hxje = e.record.data.hxje;
                                        }
                                    }
                                }

                                //合计
                                setVal();
                            }
                        },
                        selModel: Ext.create('Ext.selection.CheckboxModel', {
                            selType: 'checkboxmodel',
                            mode: 'SIMPLE',
                            checkOnly: true,
                            listeners: {
                                beforedeselect: function (model, record, index) {
                                    //默认可选，但未选中
                                    if (record.data.isbj) {
                                        return false;
                                    }
                                },
                                deselect: function (model, record, index) {//取消选中时产生的事件
                                    record.data.isxz = 0;
                                    //预存store更新
                                    for (var i = 0; i < hxSelStore.data.length; i++) {
                                        if (hxSelStore.data.items[i].data.id == record.data.id) {
                                            hxSelStore.remove(hxSelStore.data.items[i]);
                                        }
                                    }
                                    //合计
                                    setVal();
                                },
                                select: function (model, record, index) {//record被选中时产生的事件
                                    record.data.isxz = 1;
                                    //预存store更新
                                    var n = 1;
                                    if (hxSelStore.data.length > 0) {
                                        for (var i = 0; i < hxSelStore.data.length; i++) {
                                            if (hxSelStore.data.items[i].data.id == record.data.id) {
                                                n--;
                                            }
                                        }
                                    }
                                    if (n == 1) {
                                        hxSelStore.add(record.data);
                                    }
                                    //合计
                                    setVal();
                                }
                            }
                        }),
                        columns: [
                            Ext.create('Ext.grid.RowNumberer'),
                            {
                                xtype: 'gridcolumn',
                                text: '操作',
                                dataIndex: 'zhuangchedanId',
                                width: 90,
                                sortable: false,
                                menuDisabled: true,
                                align: "center",
                                renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                    var str = '';
                                    str = "<a onclick='LookGoods2(\"" + value + "\");'>查看货物</a>";
                                    return str;
                                }
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'zhuangchedanNum',
                                sortable: false,
                                menuDisabled: true,
                                text: "装车单号",
                                flex: 1
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'money',
                                sortable: false,
                                menuDisabled: true,
                                text: "预付运费",
                                width: 90
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'yhxmoney',
                                sortable: false,
                                menuDisabled: true,
                                text: "已核销",
                                width: 90
                            },
                            {
                                header: "本次核销",
                                width: 100,
                                sortable: false,
                                dataIndex: 'hxje',
                                menuDisabled: true,
                                xtype: 'numbercolumn',
                                editor: {
                                    xtype: "numberfield",
                                    allowNegative: false,
                                    selectOnFocus: true
                                },
                                align: "center"
                            },
                            {
                                xtype: 'datecolumn',
                                dataIndex: 'expenseDate',
                                width: 90,
                                format: 'Y-m-d',
                                text: '核销日期',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'officeName',
                                sortable: false,
                                menuDisabled: true,
                                text: "起始站",
                                width: 90
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'ddofficeName',
                                sortable: false,
                                menuDisabled: true,
                                text: "到达站",
                                width: 90
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'people',
                                sortable: false,
                                menuDisabled: true,
                                text: "司机",
                                width: 90
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'toAdsPeople',
                                sortable: false,
                                menuDisabled: true,
                                text: "到达站联系人",
                                width: 90
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'toAdsTel',
                                sortable: false,
                                menuDisabled: true,
                                text: "到达站联系电话",
                                width: 90
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
                                        labelAlign: 'right',
                                        displayField: 'text',
                                        valueField: 'val',
                                        queryMode: 'local',
                                        id: 'cx_hxzt',
                                        store: Ext.create('Ext.data.Store', {
                                            fields: ['val', 'text'],
                                            data: [
                                                { "val": "", "text": "所有" },
                                                { "val": "0", "text": "未核销" },
                                                { "val": "1", "text": "已核销" }
                                            ]
                                        }),
                                        editable: false,
                                        width: 100
                                    },
                                    {
                                        xtype: 'combobox',
                                        id: 'cx_bsc',
                                        width: 200,
                                        fieldLabel: '办事处',
                                        editable: false,
                                        labelWidth: 50,
                                        store: bscStore,
                                        queryMode: 'local',
                                        displayField: 'officeName',
                                        valueField: 'officeId'
                                    },
                                    {
                                        xtype: 'datefield',
                                        id: 'start_time',
                                        width: 160,
                                        labelWidth: 60,
                                        format: 'Y-m-d',
                                        fieldLabel: '日期'
                                    },
                                    {
                                        xtype: 'label',
                                        text: '~'
                                    },
                                    {
                                        xtype: 'datefield',
                                        id: 'end_time',
                                        width: 100,
                                        format: 'Y-m-d'
                                    },
                                    {
                                        xtype: 'textfield',
                                        id: 'cx_drivarName',
                                        width: 160,
                                        labelWidth: 60,
                                        fieldLabel: '司机'
                                    },
                                    {
                                        xtype: 'textfield',
                                        id: 'cx_zcdNum',
                                        width: 210,
                                        labelWidth: 100,
                                        fieldLabel: '装车单编号'
                                    },
                                    {
                                        xtype: 'button',
                                        iconCls: 'search',
                                        text: '查询',
                                        handler: function () {
                                            getHxList(hxStore.currentPage);
                                        }
                                    }
                                ]
                            },
                            {
                                xtype: 'pagingtoolbar',
                                displayInfo: true,
                                store: hxStore,
                                dock: 'bottom'
                            }
                        ]
                    }
                ],
                dockedItems: [
                    {
                        xtype: 'toolbar',
                        dock: 'top',
                        items: [
                            {
                                xtype: 'buttongroup',
                                title: '',
                                items: [
                                    {
                                        xtype: "button",
                                        text: "选中运单",
                                        iconCls: "add",
                                        arrowAlign: "right",
                                        menu: [
                                            {
                                                text: "导出excel",
                                                handler: function () {

                                                }
                                            },
                                            {
                                                text: "核销日志",
                                                handler: function () {
                                                    if (hxSelStore.data.items.length != 1) {
                                                        Ext.Msg.alert('提示', "请单个选择查询。");
                                                        return;
                                                    }
                                                    var win = new LogWin();
                                                    win.show(null, function () {
                                                        var id = hxSelStore.data.items[0].data.id;
                                                        CS('CZCLZ.Finance.GetHxLog', function (retVal) {
                                                            logStore.loadData(retVal);
                                                        }, CS.onError, id);
                                                    });
                                                }
                                            },
                                            {
                                                text: "清除核销",
                                                handler: function () {
                                                    Ext.MessageBox.confirm('确认', '取消核销将删除所有的核销收款记录,确认吗?', function (btn) {
                                                        if (btn == 'yes') {
                                                            for (var i = 0; i < hxSelStore.data.items.length; i++) {
                                                                var id = hxSelStore.data.items[i].data.id;
                                                                var je = hxSelStore.data.items[i].data.yhxmoney;
                                                                var zcdid = hxSelStore.data.items[i].data.zhuangchedanId;
                                                                CS('CZCLZ.Finance.DeleteExpenseHxLog', function (retVal) {
                                                                    gethkList(1);
                                                                }, CS.onError, "8", id, zcdid, je);
                                                            }
                                                        }
                                                    });
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                xtype: 'buttongroup',
                                title: '',
                                items: [
                                    {
                                        xtype: "button",
                                        text: "保存核销结果",
                                        iconCls: "save",
                                        handler: function () {
                                            var whxjg = Ext.getCmp('sz_whx').getValue();
                                            var shxjg = Ext.getCmp('sz_shx').getValue();
                                            var yhxjg = Ext.getCmp('sz_yhx').getValue();//
                                            var hxrq = Ext.getCmp('sz_hxrq').getValue(); //
                                            if (shxjg > whxjg) {
                                                Ext.Msg.alert('提示', "本次实核销金额大于未核销金额。");
                                                return;
                                            }
                                            //if (shxjg != yhxjg) {
                                            //    Ext.Msg.alert('提示', "实核金额和应核金额不符，请重新分摊！");
                                            //    return;
                                            //}
                                            if (hxrq == '') {
                                                Ext.Msg.alert('提示', "日期必填！");
                                                return;
                                            }

                                            var xzlist = [];
                                            for (var i = 0; i < hxSelStore.data.items.length; i++) {
                                                xzlist.push(hxSelStore.data.items[i].data);
                                            }
                                            console.log(xzlist);
                                            return;
                                            CS('CZCLZ.Finance.SaveYufuOutHx', function (retVal) {
                                                if (retVal) {
                                                    Ext.Msg.show({
                                                        title: '提示',
                                                        msg: '保存成功!',
                                                        buttons: Ext.MessageBox.OK,
                                                        icon: Ext.MessageBox.INFO
                                                    });
                                                    getHxList(1);
                                                }
                                            }, CS.onError, xzlist, hxrq);
                                        }
                                    }
                                ]
                            },
                        ]
                    }
                ]
            }
        ];
        me.callParent(arguments);
    }
})

Ext.onReady(function () {
    new mainView();
    Ext.getCmp('cx_hxzt').setValue('');
    Ext.getCmp('sz_hxrq').setValue(new Date());
    GetBsc();
    getHxList(1);
});