//-----------------------------------------------------------全局变量-----------------------------------------------------------------
var pageSize = 20;

//-----------------------------------------------------------数据源-------------------------------------------------------------------
var YDStore = createSFW4Store({
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
        { name: 'officeName' },
        { name: 'yundanNum' },
        { name: 'zhuangchedanNum' },
        { name: 'qiandanDate' },
        { name: 'jsy' },
        { name: 'jsydh' },
        { name: 'carNum' },
        { name: 'fahuoPeople' },
        { name: 'fahuoTel' },
        { name: 'shwd' },
        { name: 'toAddress' },
        { name: 'yundan_id' },
        { name: 'songhuoType' },
        { name: 'shouhuoPeople' },
        { name: 'shouhuoTel' },
        { name: 'shouhuoAddress' },
        { name: 'moneyHuikouXianFan' },
        { name: 'isHuikouXF' },
        { name: 'moneyDaishou' },
        { name: 'moneyYunfei' },
        { name: 'moneyDuanbo' },
        { name: 'moneyXianfu' },
        { name: 'moneyDaofu' },
        { name: 'moneyQianfu' },
        { name: 'moneyHuidanfu' },
        { name: 'cntHuidan' },
        { name: 'memo' }

    ],
    onPageChange: function (sto, nPage, sorters) {
        BindData(nPage);
    }
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

//到达站store
var bscStore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'officeId' },
        { name: 'officeName' }
    ]
});
//-----------------------------------------------------------页面方法-----------------------------------------------------------------
function del(id) {
    Ext.MessageBox.confirm("提示", "是否删除你所选?", function (obj) {
        if (obj == "yes") {
            CS('CZCLZ.YDMag.DeleteYD', function (retVal) {
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
function Edit(id) {
    FrameStack.pushFrame({
        url: "EditYD.html?ydid=" + id,
        onClose: function () {
            BindData(1);
        }
    });
}

function BindData(nPage) {
    CS('CZCLZ.YDMag.GetYDList2', function (retVal) {
        YDStore.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize, {
            'cx_yflx': Ext.getCmp("cx_yflx").getValue(),
            'cx_ddz': Ext.getCmp("cx_ddz").getValue(),
            'cx_zcdh': Ext.getCmp("cx_zcdh").getValue(),
            'cx_ydh': Ext.getCmp("cx_ydh").getValue(),
            'cx_beg': Ext.getCmp("cx_beg").getValue(),
            'cx_end': Ext.getCmp("cx_end").getValue(),
            'cx_fhr': Ext.getCmp("cx_fhr").getValue(),
            'cx_shr': Ext.getCmp("cx_shr").getValue(),
            'cx_shrtel': Ext.getCmp("cx_shrtel").getValue(),
            'cx_yf': Ext.getCmp("cx_yf").getValue()
        });
}
//查看运单货品明细
function LookGoods(ydid) {
    var win = new HPWin();
    win.show(null, function () {
        CS('CZCLZ.Finance.GetHPList', function (retVal) {
            HPStore.loadData(retVal);
        }, CS.onError, ydid);
    });
}

function Edit(id) {
    FrameStack.pushFrame({
        url: "EditYD.html?ydid=" + id,
        onClose: function () {
            BindData(1);
        }
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

//-----------------------------------------------------------界    面-----------------------------------------------------------------
Ext.onReady(function () {
    Ext.define('YDView', {
        extend: 'Ext.container.Viewport',

        layout: {
            type: 'fit'
        },

        initComponent: function () {
            var me = this;
            me.items = [
                {
                    xtype: 'gridpanel',
                    id: 'YDGrid',
                    store: YDStore,
                    columnLines: true,
                    columns: [Ext.create('Ext.grid.RowNumberer'),
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'officeName',
                        sortable: false,
                        menuDisabled: true,
                        width: 80,
                        text: '办事处'
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'yundanNum',
                        sortable: false,
                        menuDisabled: true,
                        width: 130,
                        text: '运单编号',
                        renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                            return "<a href='JavaScript:void(0)' onclick='Edit(\"" + record.data.yundan_id + "\")'>" + value+"</a>";
                        }
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'zhuangchedanNum',
                        sortable: false,
                        menuDisabled: true,
                        width: 90,
                        text: '运单状态',
                        renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                            if (value == '') {
                                return '未装车';
                            } else {
                                return '已装车';
                            }
                        }
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'zhuangchedanNum',
                        sortable: false,
                        menuDisabled: true,
                        width: 130,
                        text: '合同编号'
                    },
                    {
                        xtype: 'datecolumn',
                        dataIndex: 'qiandanDate',
                        format: 'Y-m-d',
                        sortable: false,
                        menuDisabled: true,
                        width: 100,
                        text: '签订日期'
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'jsy',
                        sortable: false,
                        menuDisabled: true,
                        width: 100,
                        text: '驾驶员'
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'jsydh',
                        sortable: false,
                        menuDisabled: true,
                        width: 100,
                        text: '驾驶员电话'
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'carNum',
                        sortable: false,
                        menuDisabled: true,
                        width: 100,
                        text: '车牌号'
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'fahuoPeople',
                        sortable: false,
                        menuDisabled: true,
                        width: 100,
                        text: '发货人'
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'fahuoTel',
                        sortable: false,
                        menuDisabled: true,
                        width: 100,
                        text: '发货人电话'
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'shwd',
                        sortable: false,
                        menuDisabled: true,
                        width: 100,
                        text: '收货网点'
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'toAddress',
                        sortable: false,
                        menuDisabled: true,
                        width: 100,
                        text: '到站'
                    },
                    {
                        xtype: 'gridcolumn',
                        text: '操作',
                        dataIndex: 'yundan_id',
                        width: 90,
                        sortable: false,
                        menuDisabled: true,
                        align: "center",
                        renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                            var str;
                            str = "<a onclick='LookGoods(\"" + value + "\");'>查看货物</a>";
                            return str;
                        }
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'songhuoType',
                        sortable: false,
                        menuDisabled: true,
                        width: 90,
                        text: '送货方式',
                        renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                            var str = "";
                            if (value == 0) {
                                str = "自提";
                            } else if (value == 1) {
                                str = "送货";
                            }
                            return str;
                        }
                    },

                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'shouhuoPeople',
                        sortable: false,
                        menuDisabled: true,
                        width: 90,
                        text: '收货人'
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'shouhuoTel',
                        sortable: false,
                        menuDisabled: true,
                        width: 100,
                        text: '收货人电话'
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'shouhuoAddress',
                        sortable: false,
                        menuDisabled: true,
                        width: 100,
                        text: '收货地址'
                    },
                    {
                        xtype: 'numbercolumn',
                        dataIndex: 'moneyHuikouXianFan',
                        sortable: false,
                        menuDisabled: true,
                        width: 90,
                        text: '回扣'
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'isHuikouXF',
                        sortable: false,
                        menuDisabled: true,
                        width: 90,
                        text: '回扣现付',
                        renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                            var str = "";
                            if (value == 0) {
                                str = "否";
                            } else if (value == 1) {
                                str = "是";
                            }
                            return str;
                        }
                    },
                    {
                        xtype: 'numbercolumn',
                        dataIndex: 'moneyDaishou',
                        sortable: false,
                        menuDisabled: true,
                        width: 90,
                        text: '代收货款'
                    },
                    {
                        xtype: 'numbercolumn',
                        dataIndex: 'moneyYunfei',
                        sortable: false,
                        menuDisabled: true,
                        width: 90,
                        text: '运费'
                    },
                    {
                        xtype: 'numbercolumn',
                        dataIndex: 'moneyDuanbo',
                        sortable: false,
                        menuDisabled: true,
                        width: 90,
                        text: '短驳费'
                    },
                    {
                        xtype: 'numbercolumn',
                        dataIndex: 'moneyXianfu',
                        sortable: false,
                        menuDisabled: true,
                        width: 90,
                        text: '现付'
                    },
                    {
                        xtype: 'numbercolumn',
                        dataIndex: 'moneyDaofu',
                        sortable: false,
                        menuDisabled: true,
                        width: 90,
                        text: '到付'
                    },
                    {
                        xtype: 'numbercolumn',
                        dataIndex: 'moneyQianfu',
                        sortable: false,
                        menuDisabled: true,
                        width: 90,
                        text: '欠付'
                    },
                    {
                        xtype: 'numbercolumn',
                        dataIndex: 'moneyHuidanfu',
                        sortable: false,
                        menuDisabled: true,
                        width: 90,
                        text: '回单付'
                    },

                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'cntHuidan',
                        sortable: false,
                        menuDisabled: true,
                        width: 90,
                        text: '回单数'
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'memo',
                        sortable: false,
                        menuDisabled: true,
                        width: 90,
                        text: '备注'
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
                                    id: 'cx_yflx',
                                    editable: false,
                                    store: new Ext.data.ArrayStore({
                                        fields: ['TXT', 'VAL'],
                                        data: [
                                            ['全部', ""],
                                            ['欠付', "1_4_6_8_10"],
                                            ['回单付', "3_7_8_9"],
                                            ['现付', "4_5_7_10_11"],
                                            ['到付', "2_5_6_9_10"],
                                            ['回扣', "98"],
                                            ['代收货款', "99"],
                                        ]
                                    }),
                                    queryMode: 'local',
                                    displayField: 'TXT',
                                    valueField: 'VAL',
                                    width: 100,
                                    value: ""
                                },
                                {
                                    xtype: 'combobox',
                                    id: 'cx_ddz',
                                    width: 160,
                                    fieldLabel: '到达站',
                                    editable: false,
                                    labelWidth: 50,
                                    store: bscStore,
                                    queryMode: 'local',
                                    displayField: 'officeName',
                                    valueField: 'officeId'
                                },
                                {
                                    xtype: 'textfield',
                                    id: 'cx_zcdh',
                                    labelWidth: 60,
                                    width: 180,
                                    fieldLabel: '装车单号'
                                },
                                {
                                    xtype: 'textfield',
                                    id: 'cx_ydh',
                                    labelWidth: 60,
                                    width: 180,
                                    fieldLabel: '运单号'
                                },
                                {
                                    xtype: 'datefield',
                                    id: 'cx_beg',
                                    fieldLabel: '起始日期',
                                    width: 180,
                                    format: 'Y-m-d',
                                    labelWidth: 60
                                },
                                {
                                    xtype: 'datefield',
                                    id: 'cx_end',
                                    fieldLabel: '截止日期',
                                    width: 180,
                                    format: 'Y-m-d',
                                    labelWidth: 60
                                }
                            ]
                        },
                        {
                            xtype: 'toolbar',
                            dock: 'top',
                            items: [
                                {
                                    xtype: 'textfield',
                                    id: 'cx_fhr',
                                    labelWidth: 60,
                                    width: 180,
                                    fieldLabel: '发货人'
                                },
                                {
                                    xtype: 'textfield',
                                    id: 'cx_shr',
                                    labelWidth: 60,
                                    width: 180,
                                    fieldLabel: '收货人'
                                },
                                {
                                    xtype: 'textfield',
                                    id: 'cx_shrtel',
                                    labelWidth: 70,
                                    width: 180,
                                    fieldLabel: '收货人电话'
                                },
                                {
                                    xtype: 'textfield',
                                    id: 'cx_yf',
                                    labelWidth: 60,
                                    width: 180,
                                    fieldLabel: '运费'
                                },
                                {
                                    xtype: 'buttongroup',
                                    items: [
                                        {
                                            xtype: 'button',
                                            iconCls: 'search',
                                            text: '查询',
                                            handler: function () {
                                                if (privilege("报表中心_运单一览表_查询")) {
                                                    BindData(1);
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'pagingtoolbar',
                            displayInfo: true,
                            store: YDStore,
                            dock: 'bottom'
                        }
                    ]
                }
            ];
            me.callParent(arguments);
        }
    });

    new YDView();
    CS('CZCLZ.BscMag.GetOtherBsc', function (retVal) {
        bscStore.add([{ 'officeId': '', 'officeName': '全部' }]);
        bscStore.loadData(retVal, true);
        Ext.getCmp('cx_ddz').setValue('');
        BindData(1);
    }, CS.onError)
})