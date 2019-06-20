//-----------------------------------------------------------全局变量-----------------------------------------------------------------
var pageSize = 15;

//-----------------------------------------------------------数据源-------------------------------------------------------------------
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
        getHxList(nPage);
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

//办事处store
var bscStore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'officeId' },
        { name: 'officeName' }
    ]
});

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
//-----------------------------------------------------------页面方法-----------------------------------------------------------------
//获取到付运费核销
function getHxList(nPage) {
    var hxzt = Ext.getCmp("cx_hxzt").getValue();
    var bscid = Ext.getCmp("cx_bsc").getValue();
    var kssj = Ext.getCmp("start_time").getValue();
    var jssj = Ext.getCmp("end_time").getValue();
    var drivarName = Ext.getCmp("cx_drivarName").getValue();
    var zcdNum = Ext.getCmp("cx_zcdNum").getValue();
    CS('CZCLZ.Finance.GetDfHxOutListByPage', function (retVal) {
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


function LookGoods(ydid) {
    var win = new HPWin();
    win.show(null, function () {
        CS('CZCLZ.Finance.GetHPList', function (retVal) {
            HPStore.loadData(retVal);
        }, CS.onError, ydid);
    });
}
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

//-----------------------------------------------------------界    面-----------------------------------------------------------------
Ext.define('iViewport', {
    extend: 'Ext.container.Viewport',

    layout: {
        type: 'border'
    },

    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'gridpanel',
                    region: 'center',
                    id: 'hxGridId',
                    store: hxStore,
                    columnLines: true,
                    selModel: Ext.create('Ext.selection.CheckboxModel', {
                        checkOnly: true,
                        listeners: {
                            //选择
                            select: function (model, record, index) {
                                //预存
                                var n = 1;
                                if (hxSelStore.data.length > 0) {
                                    for (var i = 0; i < hxSelStore.data.length; i++) {
                                        if (hxSelStore.data.items[i].data.id == record.data.id) {
                                            n--;
                                            hxSelStore.data.items[i].data.hxje = record.data.hxje;
                                        }
                                    }
                                }
                                if (n == 1) {
                                    hxSelStore.add(record.data);
                                }
                                //未核、实核总计
                                var whje = 0;//未核销金额
                                if (record.data.whxmoney != '' && record.data.whxmoney != null) {
                                    whje = Number(record.data.whxmoney);
                                }
                                var szwhx = 0;
                                if (Ext.getCmp('sz_whx').getValue() != '0' && Ext.getCmp('sz_whx').getValue() != '') {
                                    szwhx = Number(Ext.getCmp('sz_whx').getValue());
                                }
                                Ext.getCmp('sz_whx').setValue(szwhx + whje);

                                var dhje = 0;//本次核销金额
                                if (record.data.hxje != '' && record.data.hxje != null) {
                                    dhje = Number(record.data.hxje);
                                }
                                var szshx = 0;
                                if (Ext.getCmp('sz_shx').getValue() != '0' && Ext.getCmp('sz_shx').getValue() != '') {
                                    szshx = Number(Ext.getCmp('sz_shx').getValue());
                                }
                                Ext.getCmp('sz_shx').setValue(szshx + dhje);
                            },
                            deselect: function (model, record, index) {//取消选中时产生的事件
                                //预存
                                for (var i = 0; i < hxSelStore.data.length; i++) {
                                    if (hxSelStore.data.items[i].data.id == record.data.id) {
                                        hxSelStore.remove(hxSelStore.data.items[i]);
                                    }
                                }
                                //未核、实核总计
                                var whje = 0;//未核销金额
                                if (record.data.whxmoney != '' && record.data.whxmoney != null) {
                                    whje = Number(record.data.whxmoney);
                                }
                                var szwhx = 0;
                                if (Ext.getCmp('sz_whx').getValue() != '0' && Ext.getCmp('sz_whx').getValue() != '') {
                                    szwhx = Number(Ext.getCmp('sz_whx').getValue());
                                }
                                Ext.getCmp('sz_whx').setValue(szwhx - whje);

                                var dhje = 0;//本次核销金额
                                if (record.data.hxje != '' && record.data.hxje != null) {
                                    dhje = Number(record.data.hxje);
                                }
                                var szshx = 0;
                                if (Ext.getCmp('sz_shx').getValue() != '0' && Ext.getCmp('sz_shx').getValue() != '') {
                                    szshx = Number(Ext.getCmp('sz_shx').getValue());
                                }
                                Ext.getCmp('sz_shx').setValue(szshx - dhje);
                            }
                        }
                    }),
                    plugins: [
                        Ext.create('Ext.grid.plugin.CellEditing', {
                            clicksToEdit: 1,
                            listeners: {
                                'beforeedit': function (editor, c, e) {
                                    Ext.getCmp('hxGridId').getSelectionModel().setLocked(true);
                                },
                                'edit': function (editor, c, e) {
                                    Ext.getCmp('hxGridId').getSelectionModel().setLocked(false);
                                    //预存
                                    if (hxSelStore.data.length > 0) {
                                        for (var i = 0; i < hxSelStore.data.length; i++) {
                                            if (hxSelStore.data.items[i].data.id == c.record.data.id) {
                                                hxSelStore.data.items[i].data.hxje = c.value;
                                            }
                                        }
                                    }

                                    //查看行是否被选中
                                    if (Ext.getCmp('hxGridId').getSelectionModel().isSelected(c.record)) {
                                        var yhze = isNaN(Number(Ext.getCmp('sz_shx').getValue())) ? 0 : Number(Ext.getCmp('sz_shx').getValue());
                                        yhze += isNaN(Number(c.value)) ? 0 : Number(c.value);
                                        yhze -= isNaN(Number(c.originalValue)) ? 0 : Number(c.originalValue);
                                        Ext.getCmp('sz_shx').setValue(yhze);
                                    }
                                }
                            }
                        })
                    ],
                    columns: [
                        Ext.create('Ext.grid.RowNumberer'),
                        //{
                        //    xtype: 'gridcolumn',
                        //    text: '操作',
                        //    dataIndex: 'zhuangchedanId',
                        //    width: 90,
                        //    sortable: false,
                        //    menuDisabled: true,
                        //    align: "center",
                        //    renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                        //        var str = '';
                        //        str = "<a onclick='LookGoods(\"" + value + "\");'>查看货物</a>";
                        //        return str;
                        //    }
                        //},
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
                            text: "到付运费",
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
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'top',
                            items: [
                                {
                                    xtype: 'buttongroup',
                                    items: [
                                        {
                                            xtype: "button",
                                            text: "未核销",
                                            arrowAlign: "right",
                                            id: 'cx_hxzt2',
                                            width: 100,
                                            menu: [
                                                {
                                                    text: "所有",
                                                    hidden: true,
                                                    handler: function () {
                                                        Ext.getCmp('cx_hxzt2').setText('所有');
                                                        Ext.getCmp('hxsz').hide();
                                                        Ext.getCmp('cx_hxzt').setValue('');
                                                        Ext.getCmp('saveHx').hide();
                                                        hxSelStore.removeAll();
                                                        getHxList(1);
                                                    }
                                                },
                                                {
                                                    text: "未核销",
                                                    handler: function () {
                                                        Ext.getCmp('cx_hxzt2').setText('未核销');
                                                        Ext.getCmp('hxsz').show();
                                                        Ext.getCmp('cx_hxzt').setValue('0');
                                                        Ext.getCmp('saveHx').show();
                                                        hxSelStore.removeAll();
                                                        getHxList(1);
                                                    }
                                                },
                                                {
                                                    text: "已核销",
                                                    handler: function () {
                                                        Ext.getCmp('cx_hxzt2').setText('已核销');
                                                        Ext.getCmp('hxsz').hide();
                                                        Ext.getCmp('cx_hxzt').setValue('1');
                                                        Ext.getCmp('saveHx').hide();
                                                        hxSelStore.removeAll();
                                                        getHxList(1);
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },
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
                                    hidden: true,
                                    value: '0'
                                },
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
                                                        if (privilege("财务应付核销_司机到付核销_导出")) {
                                                            var sel = Ext.getCmp('hxGridId').getSelectionModel().getSelection();
                                                            if (sel.length == 0) {
                                                                Ext.Msg.alert('提示', "请选择导出记录。");
                                                                return;
                                                            }
                                                            var xzlist = [];
                                                            for (var i = 0; i < sel.length; i++) {
                                                                xzlist.push(sel[i].data);
                                                            }
                                                            DownloadFile("CZCLZ.Finance.DownLoadSjdf", "导出司机到付核销.xls", xzlist);
                                                        }
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
                                                                        Ext.getCmp('sz_whx').setValue('');
                                                                        Ext.getCmp('sz_shx').setValue('');
                                                                        Ext.getCmp('sz_yhx').setValue('');
                                                                        getHxList(1);
                                                                    }, CS.onError, "10", id, zcdid, je);
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
                                    items: [
                                        {
                                            xtype: "button",
                                            text: "保存核销结果",
                                            iconCls: "save",
                                            id: 'saveHx',
                                            handler: function () {
                                                if (privilege("财务应付核销_司机到付核销_核销")) {
                                                    var xzlist = [];
                                                    for (var i = 0; i < hxSelStore.data.items.length; i++) {
                                                        var whx = hxSelStore.data.items[i].data.whxmoney;
                                                        var hxje = hxSelStore.data.items[i].data.hxje;
                                                        if (hxje == '0' || hxje == null || hxje == '') {
                                                            Ext.Msg.alert('提示', "运单【" + hxSelStore.data.items[i].data.yundanNum + "】本次核销金额不能为0或空。");
                                                            return;
                                                        }
                                                        if (whx < hxje) {
                                                            Ext.Msg.alert('提示', "运单【" + hxSelStore.data.items[i].data.yundanNum + "】本次核销金额大于未核销金额。");
                                                            return;
                                                        } else {
                                                            xzlist.push(hxSelStore.data.items[i].data);
                                                        }
                                                    }
                                                    var shxjg = Ext.getCmp('sz_shx').getValue();//
                                                    var yhxjg = Ext.getCmp('sz_yhx').getValue();//
                                                    var hxrq = Ext.getCmp('sz_hxrq').getValue(); //

                                                    if (hxrq == '' || hxrq == null) {
                                                        Ext.Msg.alert('提示', "日期必填！");
                                                        return;
                                                    }
                                                    if (xzlist.length == 0) {
                                                        Ext.Msg.alert('提示', "请先选择数据，再保存！");
                                                        return;
                                                    }
                                                    CS('CZCLZ.Finance.SaveDaofuOutHx', function (retVal) {
                                                        if (retVal) {
                                                            Ext.Msg.show({
                                                                title: '提示',
                                                                msg: '保存成功!',
                                                                buttons: Ext.MessageBox.OK,
                                                                icon: Ext.MessageBox.INFO
                                                            });
                                                            Ext.getCmp('sz_whx').setValue('');
                                                            Ext.getCmp('sz_shx').setValue('');
                                                            Ext.getCmp('sz_yhx').setValue('');
                                                            getHxList(1);
                                                        }
                                                    }, CS.onError, xzlist, hxrq);
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            layout: {
                                type: 'column'
                            },
                            border: true,
                            id: 'hxsz',
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
                                        var ftjg = Ext.getCmp('sz_yhx').getValue();//分摊金额
                                        var jfje = ftjg;//金额计费
                                        var grid = Ext.getCmp('hxGridId');
                                        var gx = grid.getSelectionModel().getSelection();
                                        for (var i = 0; i < gx.length; i++) {
                                            var h = grid.getStore().indexOf(gx[i]);
                                            var whx = grid.store.getAt(h).data.whxmoney;
                                            var je = 0;//实际运单核销金额
                                            var id = grid.store.getAt(h).data.id;
                                            if (jfje > 0) {
                                                if (jfje >= whx) {
                                                    je = whx;
                                                    jfje -= whx;
                                                } else {
                                                    je = jfje;
                                                    jfje = 0;
                                                }
                                            }
                                            grid.store.getAt(h).set('hxje', je);

                                            for (var b = 0; b < hxSelStore.data.length; b++) {
                                                if (hxSelStore.data.items[b].data.id == id) {
                                                    hxSelStore.data.items[b].data.hxje = je;
                                                }
                                            }
                                        }
                                        Ext.getCmp('sz_shx').setValue(ftjg - jfje);
                                        if (jfje > 0) {
                                            Ext.Msg.alert('提示', "分摊后剩余金额" + jfje + "元");
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
                            xtype: 'toolbar',
                            dock: 'top',
                            items: [
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
                                        if (privilege("财务应付核销_司机到付核销_查询")) {
                                            getHxList(hxStore.currentPage);
                                        }
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
            ]
        });

        me.callParent(arguments);
    }

});

Ext.onReady(function () {
    new iViewport();
    CS('CZCLZ.BscMag.GetOtherBsc', function (retVal) {
        bscStore.loadData(retVal);
        Ext.getCmp('cx_bsc').setValue(retVal[0].officeId);
        Ext.getCmp('sz_hxrq').setValue(new Date());
    }, CS.onError)
});