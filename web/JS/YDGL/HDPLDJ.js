//---------------------------------------------------------------------------------全局变量---------------------------------------------------------------------------------------
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

var pageSize = 20;
var Page = 1;
var cx_sjlx = '';
var cx_qsz = '';
var cx_ddz = '';
var cx_huidanType = '';
var cx_sjlx2 = '';
var cx_beg = '';
var cx_end = '';
var cx_ydh = '';
var cx_zcdh = '';
var cx_hpm = '';
var cx_fhr = '';
var cx_shr = '';

//---------------------------------------------------------------------------------数据源-----------------------------------------------------------------------------------------
var YDStore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
        { name: 'state' },
        { name: 'yundan_chaifen_id' },
        { name: 'yundanNum' },
        {
            name: 'yundanDate'
        },
        {
            name: 'bschuidanDate'
        },
        {
            name: 'huidanDate'
        },
        {
            name: 'huidanBack'
        },
        {
            name: 'zhuangchedanNum'
        },
        {
            name: 'toOfficeName'
        },
        {
            name: 'fahuoPeople'
        },
        {
            name: 'fahuoTel'
        },
        {
            name: 'shouhuoPeople'
        },
        {
            name: 'yundan_id'
        },
        {
            name: 'huidanType'
        },
        {
            name: 'cntHuidan'
        },
        {
            name: 'songhuoType'
        },
        {
            name: 'moneyYunfei'
        },
        {
            name: 'payType'
        },
        {
            name: 'moneyXianfu'
        },
        {
            name: 'moneyDaofu'
        },
        {
            name: 'moneyQianfu'
        },
        {
            name: 'moneyHuidanfu'
        },
        {
            name: 'moneyHuikouXianFan'
        },
        {
            name: 'moneyHuikouQianFan'
        },
        {
            name: 'isHuikouXF'
        },
        {
            name: 'zhidanRen'
        },
        {
            name: 'moneyDaishou'
        },
        {
            name: 'moneyDaishouShouxu'
        },
        { name: 'memo' },
        { name: 'ti1_zt' },
        { name: 'ti2_zt' },
        { name: 'ti3_zt' }

    ],
    onPageChange: function (sto, nPage, sorters) {
        Page = nPage;
        BindData(nPage);
    }
});

var XZStore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'state' },
        { name: 'yundan_chaifen_id' },
        { name: 'yundanNum' },
        {
            name: 'yundanDate'
        },
        {
            name: 'bschuidanDate'
        },
        {
            name: 'huidanDate'
        },
        {
            name: 'huidanBack'
        },
        {
            name: 'zhuangchedanNum'
        },
        {
            name: 'toOfficeName'
        },
        {
            name: 'fahuoPeople'
        },
        {
            name: 'fahuoTel'
        },
        {
            name: 'shouhuoPeople'
        },
        {
            name: 'yundan_id'
        },
        {
            name: 'huidanType'
        },
        {
            name: 'cntHuidan'
        },
        {
            name: 'songhuoType'
        },
        {
            name: 'moneyYunfei'
        },
        {
            name: 'payType'
        },
        {
            name: 'moneyXianfu'
        },
        {
            name: 'moneyDaofu'
        },
        {
            name: 'moneyQianfu'
        },
        {
            name: 'moneyHuidanfu'
        },
        {
            name: 'moneyHuikouXianFan'
        },
        {
            name: 'moneyHuikouQianFan'
        },
        {
            name: 'isHuikouXF'
        },
        {
            name: 'zhidanRen'
        },
        {
            name: 'moneyDaishou'
        },
        {
            name: 'moneyDaishouShouxu'
        },
        { name: 'memo' },
        { name: 'ti1_zt' },
        { name: 'ti2_zt' },
        { name: 'ti3_zt' }
    ],
    data: [
    ]
});

var qszstore = Ext.create('Ext.data.Store', {
    fields: ['officeId', 'officeName'],
    data: [
    ]
});

var zdzstore = Ext.create('Ext.data.Store', {
    fields: ['officeId', 'officeName'],
    data: [
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
//---------------------------------------------------------------------------------页面方法---------------------------------------------------------------------------------------
function GetQSZ() {
    InlineCS('CZCLZ.YDMag.GetYDQSZ', function (retVal) {
        qszstore.loadData(retVal);
    }, CS.onError)
}


function GetZDZ() {
    InlineCS('CZCLZ.YDMag.GetYDZDZ', function (retVal) {
        zdzstore.loadData(retVal);
    }, CS.onError)
}

function BindData(nPage) {
    cx_sjlx = Ext.getCmp("cx_sjlx").getValue();
    cx_qsz = Ext.getCmp("cx_qsz").getValue()
    cx_ddz = Ext.getCmp("cx_ddz").getValue()
    cx_huidanType = Ext.getCmp("cx_huidanType").getValue()
    cx_sjlx2 = Ext.getCmp("cx_sjlx2").getValue();
    cx_beg = Ext.getCmp("cx_beg").getValue();
    cx_end = Ext.getCmp("cx_end").getValue();
    cx_ydh = Ext.getCmp("cx_ydh").getValue();
    cx_zcdh = Ext.getCmp("cx_zcdh").getValue();
    cx_hpm = Ext.getCmp("cx_hpm").getValue();
    cx_fhr = Ext.getCmp("cx_fhr").getValue();
    cx_shr = Ext.getCmp("cx_shr").getValue();

    CS('CZCLZ.YDMag.GetHDList', function (retVal) {
        YDStore.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize, cx_sjlx, cx_qsz, cx_ddz, cx_huidanType, cx_sjlx2, cx_beg, cx_end, cx_ydh, cx_zcdh, cx_hpm, cx_fhr, cx_shr);
}

//grid列checkbox选择
function dateCheckOnclick(box, r, c) {
    var z = 0;
    var fieldName = '';
    var fieldName2 = '';
    if (box.checked) {
        z = 1;
    }

    if (c == 4) {
        fieldName = 'ti1_zt';
        fieldName2 = 'bschuidanDate';
    } else if (c == 6) {
        fieldName = 'ti2_zt';
        fieldName2 = 'huidanDate';
    } else if (c == 8) {
        fieldName = 'ti3_zt';
        fieldName2 = 'huidanBack';
    }

    var grid = Ext.getCmp('YDGrid');
    grid.store.getAt(r).set(fieldName, z);

    if (box.checked) {
        var win = new addDateWin({ name: fieldName2, fieldRow: r });
        win.show(null, function () {
            var sj = grid.store.getAt(r).get(fieldName2, z) == null ? new Date() : grid.store.getAt(r).get(fieldName2, z);
            Ext.getCmp('actionDate').setValue(sj);
        });
    }
}

function ShowHPList(ydid) {
    var win = new HPWin();
    win.show(null, function () {
        CS('CZCLZ.Finance.GetHPList', function (retVal) {
            HPStore.loadData(retVal);
        }, CS.onError, ydid);
    });
}
//-------------------------------------------------------------------------------货品界面-------------------------------------------------------------------------------------
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
//-------------------------------------------------------------------------------统一设置界面-------------------------------------------------------------------------------------
Ext.define('TYSZ', {
    extend: 'Ext.window.Window',

    height: 300,
    width: 400,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '统一设置',

    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'form',
                id: 'TYSZform',
                frame: true,
                bodyPadding: 10,
                title: '',
                items: [
                    {
                        xtype: 'combobox',
                        id: 'sjtype',
                        editable: false,
                        allowBlank: false,
                        fieldLabel: '选择设置项目',
                        store: new Ext.data.ArrayStore({
                            fields: ['TXT', 'VAL'],
                            data: [
                                ['点击选择', ""],
                                ['办事处回单', "bschuidanDate"],
                                ['回单收到', "huidanDate"],
                                ['回单送出', "huidanBack"]
                            ]
                        }),
                        queryMode: 'local',
                        displayField: 'TXT',
                        valueField: 'VAL',
                        anchor: '100%',
                        value: ""
                    },
                    {
                        xtype: 'datefield',
                        allowBlank: false,
                        format: 'Y-m-d',
                        fieldLabel: '登记日期',
                        id: 'djrq',
                        anchor: '100%',
                        value: new Date()
                    }

                ],
                buttonAlign: 'center',
                buttons: [
                    {
                        text: '确定',
                        handler: function () {
                            var form = Ext.getCmp('TYSZform');
                            if (form.form.isValid()) {
                                var xzlist = [];
                                if (XZStore.data.items.length == 0) {
                                    Ext.Msg.alert('提示', "请选择要设置运单！");
                                    return;
                                }
                                for (var i = 0; i < XZStore.data.items.length; i++) {
                                    xzlist.push(XZStore.data.items[i].data.yundan_id);
                                }
                                var me = this;
                                if (Ext.getCmp("sjtype").getValue() == '') {
                                    Ext.Msg.alert('提示', "请选择要设置项目！");
                                    return;
                                }
                                if (Ext.getCmp("sjtype").getValue() == "bschuidanDate") {
                                    CS('CZCLZ.YDMag.SaveBSCHD', function (retVal) {
                                        if (retVal) {
                                            BindData(Page);
                                            me.up('window').close();
                                        }
                                    }, CS.onError, xzlist, Ext.getCmp("djrq").getValue());
                                } else if (Ext.getCmp("sjtype").getValue() == "huidanDate") {
                                    CS('CZCLZ.YDMag.SaveHDSD', function (retVal) {
                                        if (retVal) {
                                            BindData(Page);
                                            me.up('window').close();
                                        }
                                    }, CS.onError, xzlist, Ext.getCmp("djrq").getValue());
                                } else if (Ext.getCmp("sjtype").getValue() == "huidanBack") {
                                    CS('CZCLZ.YDMag.SaveHDSC', function (retVal) {
                                        if (retVal) {
                                            BindData(Page);
                                            me.up('window').close();
                                        }
                                    }, CS.onError, xzlist, Ext.getCmp("djrq").getValue());
                                }
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

//-------------------------------------------------------------------------------时间设置界面-------------------------------------------------------------------------------------
Ext.define('addDateWin', {
    extend: 'Ext.window.Window',
    height: 200,
    width: 400,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '时间设置',
    id: 'win_date',
    initComponent: function () {
        var me = this;
        var dateName = me.name;
        var fieldRow = me.fieldRow;
        me.items = [
            {
                xtype: 'form',
                id: 'dateform',
                frame: true,
                bodyPadding: 10,
                title: '',
                items: [
                    {
                        xtype: 'datefield',
                        format: 'Y-m-d',
                        fieldLabel: '登记日期',
                        id: 'actionDate',
                        anchor: '100%',
                        labelWidth: 70
                    }
                ],
                buttonAlign: 'center',
                buttons: [
                    {
                        text: '确定',
                        handler: function () {
                            var setSj = Ext.getCmp('actionDate').getValue();
                            var grid = Ext.getCmp('YDGrid');
                            grid.store.getAt(fieldRow).set(dateName, setSj);


                            this.up('window').close();
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
//---------------------------------------------------------------------------------界    面---------------------------------------------------------------------------------------
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
                selModel: Ext.create('Ext.selection.CheckboxModel', {
                    selType: 'rowmodel',
                    mode: 'SIMPLE',
                    checkOnly: true,
                    listeners: {
                        deselect: function (model, record, index) {//取消选中时产生的事件
                            if (XZStore.data.length > 0) {
                                for (var i = 0; i < XZStore.data.length; i++) {
                                    if (XZStore.data.items[i].data.yundan_id == record.get('yundan_id')) {
                                        XZStore.remove(XZStore.data.items[i]);
                                    }
                                }
                            }
                        },
                        select: function (model, record, index) {//record被选中时产生的事件
                            var n = 1;
                            if (XZStore.data.length > 0) {
                                for (var i = 0; i < XZStore.data.length; i++) {
                                    if (XZStore.data.items[i].data.yundan_id == record.get('yundan_id')) {
                                        n--;
                                    }
                                }
                            }
                            if (n == 1) {
                                XZStore.add(record.data);
                            }
                        }
                    }
                }),
                plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit: 1,
                    listeners: {
                        beforeedit: function (editor, e) {
                            //console.log(e.record.data.ti1_zt + '-' + e.colIdx);
                            //console.log(e.record.data.ti2_zt + '-' + e.colIdx);
                            //console.log(e.record.data.ti3_zt + '-' + e.colIdx);
                            if (e.record.data.ti1_zt == 0 && e.colIdx == 5) {
                                return false;
                            } else if (e.record.data.ti2_zt == 0 && e.colIdx == 7) {
                                return false;
                            } else if (e.record.data.ti3_zt == 0 && e.colIdx == 9) {
                                return false;
                            }
                        }
                        //edit: function (editor, e) {
                        //    if (e.field == "bschuidanDate") {
                        //        CS('CZCLZ.YDMag.SaveBSCHD', function (retVal) {
                        //            if (retVal) {
                        //                BindData(Page);
                        //            }
                        //        }, CS.onError, [e.record.data.yundan_id], e.record.data.bschuidanDate);
                        //    } else if (e.field == "huidanDate") {
                        //        CS('CZCLZ.YDMag.SaveHDSD', function (retVal) {
                        //            if (retVal) {
                        //                BindData(Page);
                        //            }
                        //        }, CS.onError, [e.record.data.yundan_id], e.record.data.huidanDate);
                        //    } else if (e.field == "huidanBack") {
                        //        CS('CZCLZ.YDMag.SaveHDSC', function (retVal) {
                        //            if (retVal) {
                        //                BindData(Page);
                        //            }
                        //        }, CS.onError, [e.record.data.yundan_id], e.record.data.huidanBack);
                        //    }
                        //}
                    }
                })],
                columns: [Ext.create('Ext.grid.RowNumberer'),
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'yundanNum',
                    width: 150,
                    text: '运单号',
                    menuDisabled: true,
                    sortable: false
                },
                {
                    xtype: 'datecolumn',
                    dataIndex: 'yundanDate',
                    width: 90,
                    format: 'Y-m-d',
                    text: '制单日期',
                    menuDisabled: true,
                    sortable: false

                },
                {
                    sortable: false,
                    width: 30,
                    dataIndex: 'ti1_zt',//数据源中的状态列
                    align: "center",
                    renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                        return '<input type="checkbox"' + (value == "1" ? " checked" : "") + ' onclick="dateCheckOnclick(this,' + rowIndex + ',' + columnIndex + ')"/>';
                    }//根据值返回checkbox是否勾选
                },
                {
                    xtype: 'datecolumn',
                    dataIndex: 'bschuidanDate',
                    width: 100,
                    sortable: false,
                    menuDisabled: true,
                    text: '办事处回单',
                    format: 'Y-m-d',
                    field: {
                        xtype: 'datefield',
                        selectOnFocus: true,
                        allowBlank: false,
                        allowDecimals: false,
                        format: 'Y-m-d'
                    },
                    renderer: function (value, cellmeta) {
                        cellmeta.style = 'background: #99CCFF ';
                        if (value) {
                            return new Date(value).Format("yyyy-MM-dd");
                        }
                    }
                },
                {
                    sortable: false,
                    width: 30,
                    dataIndex: 'ti2_zt',//数据源中的状态列
                    align: "center",
                    renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                        return '<input type="checkbox"' + (value == "1" ? " checked" : "") + ' onclick="dateCheckOnclick(this,' + rowIndex + ',' + columnIndex + ')"/>';
                    }//根据值返回checkbox是否勾选
                },
                {
                    xtype: 'datecolumn',
                    dataIndex: 'huidanDate',
                    width: 100,
                    sortable: false,
                    menuDisabled: true,
                    text: '回单收到',
                    format: 'Y-m-d',
                    field: {
                        xtype: 'datefield',
                        selectOnFocus: true,
                        allowBlank: false,
                        allowDecimals: false,
                        format: 'Y-m-d'
                    },
                    renderer: function (value, cellmeta) {
                        cellmeta.style = 'background: #99CCFF ';
                        if (value) {
                            return new Date(value).Format("yyyy-MM-dd");
                        }
                    }
                },
                {
                    sortable: false,
                    width: 30,
                    dataIndex: 'ti3_zt',//数据源中的状态列
                    align: "center",
                    renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                        return '<input type="checkbox"' + (value == "1" ? " checked" : "") + ' onclick="dateCheckOnclick(this,' + rowIndex + ',' + columnIndex + ')"/>';
                    }//根据值返回checkbox是否勾选
                },
                {
                    xtype: 'datecolumn',
                    dataIndex: 'huidanBack',
                    width: 100,
                    sortable: false,
                    menuDisabled: true,
                    text: '回单送出',
                    format: 'Y-m-d',
                    field: {
                        xtype: 'datefield',
                        selectOnFocus: true,
                        allowBlank: false,
                        allowDecimals: false,
                        format: 'Y-m-d'
                    },
                    renderer: function (value, cellmeta) {
                        cellmeta.style = 'background: #99CCFF ';
                        if (value) {
                            return new Date(value).Format("yyyy-MM-dd");
                        }
                    }
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'zhuangchedanNum',
                    width: 150,
                    text: '装车单号',
                    menuDisabled: true,
                    sortable: false
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'yundan_id',
                    width: 90,
                    text: '货品',
                    menuDisabled: true,
                    sortable: false,
                    renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                        return "<a href='JavaScript:void(0)' onclick='ShowHPList(\"" + value + "\")'>查看货品</a>";
                    }
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'toOfficeName',
                    width: 80,
                    text: '到达站',
                    menuDisabled: true,
                    sortable: false
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'fahuoPeople',
                    width: 90,
                    text: '发货人',
                    menuDisabled: true,
                    sortable: false
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'fahuoTel',
                    width: 90,
                    text: '发货电话',
                    menuDisabled: true,
                    sortable: false
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'shouhuoPeople',
                    width: 90,
                    text: '收货人',
                    menuDisabled: true,
                    sortable: false
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'huidanType',
                    width: 70,
                    text: '回单/收条',
                    menuDisabled: true,
                    sortable: false,
                    renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                        var str = "";
                        if (parseInt(value) == 0) {
                            str = "回单";
                        } else if (parseInt(value) == 1) {
                            str = "收条";
                        }
                        return str;
                    }

                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'cntHuidan',
                    width: 65,
                    text: '回单份数',
                    menuDisabled: true,
                    sortable: false
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'songhuoType',
                    width: 65,
                    text: '送货方式',
                    menuDisabled: true,
                    sortable: false,
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
                    dataIndex: 'moneyYunfei',
                    width: 100,
                    text: '运费',
                    menuDisabled: true,
                    sortable: false
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'payType',
                    width: 110,
                    text: '结算方式',
                    menuDisabled: true,
                    sortable: false,
                    renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                        var str = "";
                        if (value == 11) {
                            str = "现金";
                        } else if (value == 1) {
                            str = "欠付";
                        } else if (value == 2) {
                            str = "到付";
                        } else if (value == 3) {
                            str = "回单付";
                        } else if (value == 4) {
                            str = "现付+欠付";
                        } else if (value == 5) {
                            str = "现付+到付";
                        } else if (value == 6) {
                            str = "到付+欠付";
                        } else if (value == 7) {
                            str = "现付+回单付";
                        } else if (value == 8) {
                            str = "欠付+回单付";
                        } else if (value == 9) {
                            str = "到付+回单付";
                        } else if (value == 10) {
                            str = "现付+到付+欠付";
                        }
                        return str
                    }
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'moneyXianfu',
                    width: 100,
                    text: '现付',
                    menuDisabled: true,
                    sortable: false
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'moneyDaofu',
                    width: 100,
                    text: '到付',
                    menuDisabled: true,
                    sortable: false
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'moneyQianfu',
                    width: 100,
                    text: '欠付',
                    menuDisabled: true,
                    sortable: false
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'moneyHuidanfu',
                    width: 100,
                    text: '回单付',
                    menuDisabled: true,
                    sortable: false
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'isHuikouXF',
                    width: 100,
                    text: '回扣',
                    menuDisabled: true,
                    sortable: false,
                    renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                        if (value == 1) {
                            return record.data.moneyHuikouXianFan;
                        } else {
                            return record.data.moneyHuikouQianFan;
                        }
                    }
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'zhidanRen',
                    width: 90,
                    text: '制单人',
                    menuDisabled: true,
                    sortable: false
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'moneyDaishou',
                    width: 90,
                    text: '代收',
                    menuDisabled: true,
                    sortable: false
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'moneyDaishouShouxu',
                    width: 90,
                    text: '代收手续费',
                    menuDisabled: true,
                    sortable: false
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'memo',
                    width: 90,
                    text: '备注',
                    menuDisabled: true,
                    sortable: false
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
                                id: 'cx_sjlx',
                                editable: false,
                                store: new Ext.data.ArrayStore({
                                    fields: ['TXT', 'VAL'],
                                    data: [
                                        ['所有', ""],
                                        ['未寄出', "0"],
                                        ['未拿到', "1"],
                                        ['已拿到', "2"],
                                        ['已送出', "3"]
                                    ]
                                }),
                                queryMode: 'local',
                                displayField: 'TXT',
                                valueField: 'VAL',
                                width: 180,
                                value: ''
                            },
                            {
                                xtype: "button",
                                text: "选中运单",
                                iconCls: "add",
                                arrowAlign: "right",
                                menu: [
                                    {
                                        text: "导出excel",
                                        handler: function () {
                                            var xzlist = [];
                                            if (XZStore.data.items.length == 0) {
                                                Ext.Msg.alert('提示', "请选择要设置运单！");
                                                return;
                                            }
                                            for (var i = 0; i < XZStore.data.items.length; i++) {
                                                xzlist.push(XZStore.data.items[i].data.yundan_id);
                                            }
                                            DownloadFile("CZCLZ.YDMag.DownLoadYundan", "导出运单.xls", xzlist);
                                        }
                                    }
                                ]
                            },
                            {
                                xtype: 'buttongroup',
                                items: [
                                    {
                                        xtype: 'button',
                                        iconCls: 'add',
                                        text: '统一设置',
                                        handler: function () {
                                            var win = new TYSZ();
                                            win.show();
                                        }
                                    }
                                ]
                            },
                            {
                                xtype: 'buttongroup',
                                items: [
                                    {
                                        xtype: 'button',
                                        iconCls: 'add',
                                        text: '执行已勾选操作',
                                        handler: function () {
                                            var xzlist1 = [];
                                            var xzlist2 = [];
                                            var xzlist3 = [];
                                            var grid = Ext.getCmp('YDGrid').store;
                                            for (var a = 0; a < grid.data.items.length; a++) {
                                                if (grid.data.items[a].data.ti1_zt == 1) {
                                                    xzlist1.push(grid.data.items[a].data);
                                                } else if (grid.data.items[a].data.ti2_zt == 1) {
                                                    xzlist2.push(grid.data.items[a].data);
                                                } else if (grid.data.items[a].data.ti3_zt == 1) {
                                                    xzlist3.push(grid.data.items[a].data);
                                                }
                                            }
                                            CS('CZCLZ.YDMag.SaveYgxCz', function (retVal) {
                                                if (retVal) {
                                                    BindData(Page);
                                                }
                                            }, CS.onError, xzlist1, xzlist2, xzlist3);
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        xtype: 'toolbar',
                        dock: 'top',
                        items: [
                            {
                                xtype: 'combobox',
                                id: 'cx_qsz',
                                fieldLabel: '起始站',
                                editable: false,
                                store: qszstore,
                                queryMode: 'local',
                                displayField: 'officeName',
                                valueField: 'officeId',
                                width: 180,
                                labelWidth: 60
                            },
                            {
                                xtype: 'combobox',
                                id: 'cx_ddz',
                                fieldLabel: '到达站',
                                editable: false,
                                store: zdzstore,
                                queryMode: 'local',
                                displayField: 'officeName',
                                valueField: 'officeId',
                                width: 180,
                                labelWidth: 60
                            },
                            {
                                xtype: 'combobox',
                                id: 'cx_huidanType',
                                fieldLabel: '回单/收条',
                                editable: false,
                                store: new Ext.data.ArrayStore({
                                    fields: ['TXT', 'VAL'],
                                    data: [
                                        ['回单', 0],
                                        ['收条', 1]
                                    ]
                                }),
                                queryMode: 'local',
                                displayField: 'TXT',
                                valueField: 'VAL',
                                labelWidth: 70,
                                width: 180
                            },
                            {
                                xtype: 'combobox',
                                id: 'cx_sjlx2',
                                editable: false,
                                store: new Ext.data.ArrayStore({
                                    fields: ['TXT', 'VAL'],
                                    data: [
                                        ['时间类型', ""],
                                        ['运单日期', "yundanDate"],
                                        ['办事处回单', "bschuidanDate"],
                                        ['回单收到', "huidanDate"],
                                        ['回单送出', "huidanBack"]
                                    ]
                                }),
                                queryMode: 'local',
                                displayField: 'TXT',
                                valueField: 'VAL',
                                width: 180,
                                labelWidth: 60,
                                value: ''
                            },
                            {
                                xtype: 'datefield',
                                id: 'cx_beg',
                                fieldLabel: '起始日期',
                                width: 180,
                                format: 'Y-m-d',
                                labelWidth: 60,
                                value: new Date()
                            },
                            {
                                xtype: 'datefield',
                                id: 'cx_end',
                                fieldLabel: '截止日期',
                                width: 180,
                                format: 'Y-m-d',
                                labelWidth: 60,
                                value: new Date()
                            }
                        ]
                    },
                    {
                        xtype: 'toolbar',
                        dock: 'top',
                        items: [
                            {
                                xtype: 'textfield',
                                id: 'cx_ydh',
                                labelWidth: 60,
                                width: 180,
                                fieldLabel: '运单号'
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
                                id: 'cx_hpm',
                                labelWidth: 60,
                                width: 180,
                                fieldLabel: '货品名'
                            },
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
                                        text: '导出',
                                        handler: function () {
                                            DownloadFile("CZCLZ.YDMag.DownLoadHuidan", "回单导出.xls", cx_sjlx, cx_qsz, cx_ddz, cx_huidanType, cx_sjlx2, cx_beg, cx_end, cx_ydh, cx_zcdh, cx_hpm, cx_fhr, cx_shr);
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

Ext.onReady(function () {
    GetQSZ();
    GetZDZ();
    new YDView();
    Ext.getCmp("cx_qsz").setValue(qszstore.getAt(0));
    //Ext.getCmp("cx_zdz").setValue(qszstore.getAt(0));
    BindData(1);

})
