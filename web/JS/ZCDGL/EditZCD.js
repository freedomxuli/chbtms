//-----------------------------------------------------------全局变量-----------------------------------------------------------------
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

var pageSize = 10;
var zcdid = queryString.zcdid;
var maxMoneyZhdf = 0;
var cfid = "";
var LODOP;
//-----------------------------------------------------------数据源-------------------------------------------------------------------
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

var driverstore = Ext.create('Ext.data.Store', {
    fields: ['driverId', 'people', 'tel', 'carNum'],
    data: [
    ]
});

//库存运单
var YDStore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
        { name: 'yundan_chaifen_id' },
        { name: 'isDache' },
        { name: 'isPeiSong' },
        { name: 'isZhuhuodaofu' },
        { name: 'yundanDate' },
        { name: 'yundan_chaifen_number' },
        { name: 'zhuangchedanNum' },
        { name: 'hxrq' },
        { name: 'officeId' },
        { name: 'officeName' },
        { name: 'toOfficeId' },
        { name: 'toOfficeName' },
        { name: 'toAddress' },
        { name: 'fahuoPeople' },
        { name: 'fahuoTel' },
        { name: 'shouhuoPeople' },
        { name: 'shouhuoTel' },
        { name: 'shouhuoAddress' },
        { name: 'songhuoType' },
        { name: 'moneyYunfei' },
        { name: 'payType' },
        { name: 'moneyXianfu' },
        { name: 'moneyDaofu' },
        { name: 'moneyQianfu' },
        { name: 'moneyHuidanfu' },
        { name: 'moneyHuikou' },
        { name: 'zhidanRen' },
        { name: 'moneyDaishou' },
        { name: 'moneyDaishouShouxu' },
        { name: 'huidanType' },
        { name: 'memo' },
        { name: 'cntHuidan' },
        { name: 'is_leaf' }
    ],
    onPageChange: function (sto, nPage, sorters) {
        BindYDData(nPage);
    }
});

//已配送运单
var YPSYDStore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
        { name: 'yundan_chaifen_id' },
        { name: 'isDache' },
        { name: 'isPeiSong' },
        { name: 'isZhuhuodaofu' },
        { name: 'yundanDate' },
        { name: 'yundan_chaifen_number' },
        { name: 'zhuangchedanNum' },
        { name: 'hxrq' },
        { name: 'officeId' },
        { name: 'officeName' },
        { name: 'toOfficeId' },
        { name: 'toOfficeName' },
        { name: 'toAddress' },
        { name: 'fahuoPeople' },
        { name: 'fahuoTel' },
        { name: 'shouhuoPeople' },
        { name: 'shouhuoTel' },
        { name: 'shouhuoAddress' },
        { name: 'songhuoType' },
        { name: 'moneyYunfei' },
        { name: 'payType' },
        { name: 'moneyXianfu' },
        { name: 'moneyDaofu' },
        { name: 'moneyQianfu' },
        { name: 'moneyHuidanfu' },
        { name: 'moneyHuikou' },
        { name: 'zhidanRen' },
        { name: 'moneyDaishou' },
        { name: 'moneyDaishouShouxu' },
        { name: 'huidanType' },
        { name: 'memo' },
        { name: 'cntHuidan' },
        { name: 'is_leaf' }
    ],
    onPageChange: function (sto, nPage, sorters) {
        BindYPSYDData(nPage);
    }
});

//选中库存
var XZKCStore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'yundan_chaifen_id' },
        { name: 'isDache' },
        { name: 'isPeiSong' },
        { name: 'isZhuhuodaofu' },
        { name: 'yundanDate' },
        { name: 'yundan_chaifen_number' },
        { name: 'zhuangchedanNum' },
        { name: 'hxrq' },
        { name: 'officeId' },
        { name: 'officeName' },
        { name: 'toOfficeId' },
        { name: 'toOfficeName' },
        { name: 'toAddress' },
        { name: 'fahuoPeople' },
        { name: 'fahuoTel' },
        { name: 'shouhuoPeople' },
        { name: 'shouhuoTel' },
        { name: 'shouhuoAddress' },
        { name: 'songhuoType' },
        { name: 'moneyYunfei' },
        { name: 'payType' },
        { name: 'moneyXianfu' },
        { name: 'moneyDaofu' },
        { name: 'moneyQianfu' },
        { name: 'moneyHuidanfu' },
        { name: 'moneyHuikou' },
        { name: 'zhidanRen' },
        { name: 'moneyDaishou' },
        { name: 'moneyDaishouShouxu' },
        { name: 'huidanType' },
        { name: 'memo' },
        { name: 'cntHuidan' },
        { name: 'is_leaf' }],
    data: [
    ]
});

//选中已配送库存
var XZYPSStore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'yundan_chaifen_id' },
        { name: 'isDache' },
        { name: 'isPeiSong' },
        { name: 'isZhuhuodaofu' },
        { name: 'yundanDate' },
        { name: 'yundan_chaifen_number' },
        { name: 'zhuangchedanNum' },
        { name: 'hxrq' },
        { name: 'officeId' },
        { name: 'officeName' },
        { name: 'toOfficeId' },
        { name: 'toOfficeName' },
        { name: 'toAddress' },
        { name: 'fahuoPeople' },
        { name: 'fahuoTel' },
        { name: 'shouhuoPeople' },
        { name: 'shouhuoTel' },
        { name: 'shouhuoAddress' },
        { name: 'songhuoType' },
        { name: 'moneyYunfei' },
        { name: 'payType' },
        { name: 'moneyXianfu' },
        { name: 'moneyDaofu' },
        { name: 'moneyQianfu' },
        { name: 'moneyHuidanfu' },
        { name: 'moneyHuikou' },
        { name: 'zhidanRen' },
        { name: 'moneyDaishou' },
        { name: 'moneyDaishouShouxu' },
        { name: 'huidanType' },
        { name: 'memo' },
        { name: 'cntHuidan' },
        { name: 'is_leaf' }],
    data: [
    ]
});

//收货网点
var shzstore = Ext.create('Ext.data.Store', {
    fields: ['officeId', 'officeName'],
    data: [
    ]
});

var HPStore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
        //{ name: 'yundan_chaifen_id' },
        { name: 'SP_ID' },
        { name: 'yundan_goodsName' },
        { name: 'yundan_goodsPack' },
        { name: 'yundan_goodsAmount' },
        { name: 'yundan_goodsWeight' },
        { name: 'yundan_goodsVolume' }
        //{ name: 'status' },
        //{ name: 'addtime' },
        //{ name: 'adduser' }
    ],
    onPageChange: function (sto, nPage, sorters) {
        BindHPList(nPage);
    }
});
//-----------------------------------------------------------页面方法-----------------------------------------------------------------
//加载装车单起始站
function getBscQs() {
    InlineCS('CZCLZ.ZCDMag.GetZCDQSZ', function (retVal) {
        qszstore.loadData(retVal);
        Ext.getCmp('officeId').setValue(qszstore.getAt(0).data.officeId);
    }, CS.onError);
}

//加载装车单终点站
function getBscZd() {
    InlineCS('CZCLZ.BscMag.GetOtherBsc', function (retVal) {
        zdzstore.loadData(retVal);
        Ext.getCmp('toOfficeId').setValue(zdzstore.getAt(0).data.officeId);
    }, CS.onError);
}

//加载司机
function getDriver() {
    InlineCS('CZCLZ.ZCDMag.GetDriver', function (retVal) {
        driverstore.loadData(retVal);
    }, CS.onError);
}

//表单填充
function getZcd(id) {
    if (id == "") {
        CS('CZCLZ.ZCDMag.GetZhuangchedanNum', function (retVal) {
            Ext.getCmp('zhuangchedanNum').setValue(retVal);
            BindYDData(1);
            //BindYPSYDData(1);
        }, CS.onError);
    } else {
        CS('CZCLZ.ZCDMag.GetZCDByID', function (retVal) {
            if (retVal) {
                var form = Ext.getCmp('addform');
                form.form.setValues(retVal[0]);
                LODOP = getLodop();
                BindYDData(1);
                BindYPSYDData(1);
                if (retVal[0].isArrive == 1) {
                    Ext.getCmp('qxqr').show();
                    Ext.getCmp('qrdz').hide();
                } else {
                    Ext.getCmp('qxqr').hide();
                    Ext.getCmp('qrdz').show();
                }
            }
        }, CS.onError, id);
    }
}

//获取库存运单
function BindYDData(nPage) {
    var qsz = Ext.getCmp("officeId").getValue();
    var zdz = Ext.getCmp("toOfficeId").getValue();
    var kssj = Ext.getCmp("cx_kssj").getValue();
    var jssj = Ext.getCmp("cx_jssj").getValue();
    var keyword = Ext.getCmp("cx_keyword").getValue();
    CS('CZCLZ.ZCDMag.GetKCYDList', function (retVal) {
        YDStore.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });

        if (YDStore.data.length > 0) {
            for (var i = 0; i < YDStore.data.length; i++) {
                for (var j = 0; j < XZKCStore.data.length; j++) {
                    if (YDStore.data.items[i].data.yundan_chaifen_id == XZKCStore.data.items[i].data.yundan_chaifen_id) {
                        var rcode = YDStore.findRecord("yundan_chaifen_id", YDStore.data.items[i].data.yundan_chaifen_id);
                        Ext.getCmp('kcgrid').getSelectionModel().select(rcode, true, true);
                    }
                }
            }
        }
    }, CS.onError, nPage, pageSize, qsz, zdz, kssj, jssj, keyword);
}

//获取已配送运单
function BindYPSYDData(nPage) {
    CS('CZCLZ.ZCDMag.GetYPSYD', function (retVal) {
        YPSYDStore.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize, zcdid);
}

//检查运费总额  运费=预付+到付+欠付+主货到付+押金 
function checkYunfeiTotal() {
    var total = parseFloat(Ext.getCmp("moneyTotal").getValue()) || 0; //总运费
    var yf = parseFloat(Ext.getCmp("moneyYufu").getValue()) || 0; //预付
    var qf = parseFloat(Ext.getCmp("moneyQianfu").getValue()) || 0; //欠付
    var df = parseFloat(Ext.getCmp("moneZCDaofu").getValue()) || 0; //到付
    var zhdf = parseFloat(Ext.getCmp("moneyZhuhuoDaofu").getValue()) || 0;//主货到付
    if (zhdf > maxMoneyZhdf) {
        Ext.Msg.alert('提示', "主货到付金额超出到付金额!");
        return false;
    }
    var yj = parseFloat(Ext.getCmp("moneyYajin").getValue()) || 0; //押金
    var t = yf + qf + df + zhdf + yj;
    if (total != t) {
        // alert('运费金额必须等于:预付+到付+欠付+主货到付+押金 !');
        Ext.Msg.alert('提示', "运费金额必须等于：预付+到付+欠付+主货到付+押金 !");
        return false;
    }
    return true;
}

function ShowHPList(cfid) {
    cfid = cfid;
    BindHPList(1, cfid);
    var win = new HPList();
    win.show();
}

function BindHPList(nPage, cfid) {
    CS('CZCLZ.ZCDMag.GetHPList', function (retVal) {
        HPStore.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize, cfid);
}
//-------------------------------------------------------查看拆分单货品-----------------------------------------------------------
Ext.define('HPList', {
    extend: 'Ext.window.Window',

    modal: true,
    width: 700,
    height: 300,
    layout: {
        type: 'fit'
    },
    title: '查看运单货品',
    id: 'HPListWin',
    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'panel',
                    layout: {
                        type: 'fit'
                    },
                    autoScroll: true,
                    dockedItems: [
                    ],
                    items: [
                        {
                            xtype: 'gridpanel',
                            id: 'HPListpanel',
                            store: HPStore,
                            columnLines: true,
                            columns: [
                                {
                                    xtype: 'rownumberer',
                                    //这里可以设置你的宽度
                                    width: 35,
                                    sortable: false,
                                    menuDisabled: true,
                                },
                                {
                                    dataIndex: 'yundan_goodsName',
                                    flex: 1,
                                    text: '货品',
                                    sortable: false,
                                    menuDisabled: true
                                },
                                {
                                    dataIndex: 'yundan_goodsPack',
                                    flex: 1,
                                    text: '包装',
                                    sortable: false,
                                    menuDisabled: true
                                }, {
                                    dataIndex: 'yundan_goodsAmount',
                                    flex: 1,
                                    text: '件数',
                                    sortable: false,
                                    menuDisabled: true
                                }, {
                                    dataIndex: 'yundan_goodsWeight',
                                    flex: 1,
                                    text: '重量',
                                    sortable: false,
                                    menuDisabled: true
                                }, {
                                    dataIndex: 'yundan_goodsVolume',
                                    flex: 1,
                                    text: '体积',
                                    sortable: false,
                                    menuDisabled: true
                                }
                            ],
                            dockedItems: [
                                {
                                    xtype: 'pagingtoolbar',
                                    displayInfo: true,
                                    store: HPStore,
                                    dock: 'bottom'
                                }
                            ]

                        }

                    ]
                }

            ]
        });

        me.callParent(arguments);
    }
});
//-----------------------------------------------------------收货网点-------------------------------------------------------------
Ext.define('EditSHZWin', {
    extend: 'Ext.window.Window',

    height: 120,
    width: 400,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '修改收货网点',

    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'form',
                id: 'EditSHZform',
                frame: true,
                bodyPadding: 10,
                title: '',
                items: [
                    {
                        xtype: 'combobox',
                        displayField: 'officeName',
                        valueField: 'officeId',
                        queryMode: 'local',
                        margin: '5 10 5 10',
                        editable: false,
                        allowBlank: false,
                        fieldLabel: '更改收货网点',
                        name: 'shwd',
                        id: 'shwd',
                        anchor: '100%',
                        store: shzstore
                    }
                ],
                buttonAlign: 'center',
                buttons: [
                    {
                        text: '确定',
                        handler: function () {
                            var form = Ext.getCmp('EditSHZform');
                            if (form.form.isValid()) {
                                var shwd = Ext.getCmp("shwd").getValue();

                                var xzkclist = [];
                                for (var i = 0; i < XZKCStore.data.items.length; i++) {
                                    xzkclist.push(XZKCStore.data.items[i].data);
                                }
                                var me = this;
                                CS('CZCLZ.ZCDMag.SaveSHWD', function (retVal) {
                                    if (retVal) {
                                        Ext.Msg.show({
                                            title: '提示',
                                            msg: '保存成功!',
                                            buttons: Ext.MessageBox.OK,
                                            icon: Ext.MessageBox.INFO
                                        });
                                        BindYDData(1);
                                        me.up('window').close();
                                    }

                                }, CS.onError, shwd, xzkclist);
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
//------------------------------------------------------------大车送--------------------------------------------------------------
Ext.define('EditDCWin', {
    extend: 'Ext.window.Window',

    height: 120,
    width: 400,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '修改（大车送）',

    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'form',
                id: 'EditDCform',
                frame: true,
                bodyPadding: 10,
                title: '',
                items: [
                    {
                        xtype: 'combobox',
                        displayField: 'TXT',
                        valueField: 'VAL',
                        queryMode: 'local',
                        columnWidth: 0.33,
                        margin: '5 10 5 10',
                        editable: false,
                        allowBlank: false,
                        fieldLabel: '是否为大车送',
                        name: 'isDache',
                        id: 'isDache',
                        anchor: '100%',
                        store: new Ext.data.ArrayStore({
                            fields: ['TXT', 'VAL'],
                            data: [
                                ['否', 0],
                                ['是', 1]
                            ]
                        }),
                        value: 0
                    }
                ],
                buttonAlign: 'center',
                buttons: [
                    {
                        text: '确定',
                        handler: function () {
                            var form = Ext.getCmp('EditDCform');
                            if (form.form.isValid()) {
                                var isdcs = Ext.getCmp("isDache").getValue();

                                var xzkclist = [];
                                for (var i = 0; i < XZKCStore.data.items.length; i++) {
                                    xzkclist.push(XZKCStore.data.items[i].data);
                                }
                                var me = this;
                                CS('CZCLZ.ZCDMag.SaveDCS', function (retVal) {
                                    if (retVal) {
                                        Ext.Msg.show({
                                            title: '提示',
                                            msg: '保存成功!',
                                            buttons: Ext.MessageBox.OK,
                                            icon: Ext.MessageBox.INFO
                                        });
                                        BindYDData(1);
                                        me.up('window').close();
                                    }

                                }, CS.onError, isdcs, xzkclist);
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
//-----------------------------------------------------------主货到付-------------------------------------------------------------
Ext.define('EditZHDFWin', {
    extend: 'Ext.window.Window',

    height: 120,
    width: 400,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '设置（主货到付）',

    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'form',
                id: 'EditZHDFform',
                frame: true,
                bodyPadding: 10,
                title: '',
                items: [
                    {
                        xtype: 'combobox',
                        displayField: 'TXT',
                        valueField: 'VAL',
                        queryMode: 'local',
                        columnWidth: 0.33,
                        margin: '5 10 5 10',
                        editable: false,
                        allowBlank: false,
                        fieldLabel: '是否为主货到付',
                        name: 'isZhuhuodaofu',
                        id: 'isZhuhuodaofu',
                        anchor: '100%',
                        store: new Ext.data.ArrayStore({
                            fields: ['TXT', 'VAL'],
                            data: [
                                ['否', 0],
                                ['是', 1]
                            ]
                        }),
                        value: 0
                    }
                ],
                buttonAlign: 'center',
                buttons: [
                    {
                        text: '确定',
                        handler: function () {
                            var form = Ext.getCmp('EditZHDFform');
                            if (form.form.isValid()) {
                                var isZhuhuodaofu = Ext.getCmp("isZhuhuodaofu").getValue();

                                var xzkclist = [];

                                //验证勾选是否为大车
                                for (var i = 0; i < XZKCStore.data.items.length; i++) {
                                    var xzkc = {};
                                    if (isZhuhuodaofu == 1) {
                                        if (XZKCStore.data.items[i].data.isDache == 1) {
                                            xzkclist.push(XZKCStore.data.items[i].data);
                                        } else {
                                            Ext.Msg.alert('提示', "【" + XZKCStore.data.items[i].data.yundan_chaifen_number + "】运单不为大车送！");
                                            return;
                                        }
                                    } else {
                                        xzkc = XZKCStore.data.items[i].data;
                                        xzkclist.push(xzkc);
                                    }
                                }
                                var me = this;
                                //验证运单付款类型
                                if (isZhuhuodaofu == 1) {
                                    CS('CZCLZ.ZCDMag.CheckDF', function (retVal) {
                                        if (retVal.bo) {
                                            Ext.Msg.alert('提示', retVal.msg);
                                            return;
                                        }
                                    }, CS.onError, xzkclist);
                                }
                                CS('CZCLZ.ZCDMag.SaveZHDF', function (ret) {
                                    Ext.Msg.show({
                                        title: '提示',
                                        msg: '保存成功!',
                                        buttons: Ext.MessageBox.OK,
                                        icon: Ext.MessageBox.INFO
                                    });
                                    maxMoneyZhdf = ret;
                                    //Ext.getCmp("moneyZhuhuoDaofu").setValue(ret);//暂时还没想通主货到付金额从哪儿来
                                    BindYDData(1);
                                    me.up('window').close();
                                }, CS.onError, isZhuhuodaofu, xzkclist);

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
//-----------------------------------------------------------界    面-------------------------------------------------------------
Ext.define('EditZCD', {
    extend: 'Ext.container.Viewport',
    layout: {
        type: 'fit'
    },
    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'panel',
                    region: 'center',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
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
                                            xtype: 'button',
                                            iconCls: 'save',
                                            text: '保存',
                                            handler: function () {
                                                var form = Ext.getCmp('addform');
                                                if (form.form.isValid()) {
                                                    var driverId = Ext.getCmp("driverId").getValue();
                                                    if (driverId === "") {
                                                        Ext.Msg.alert('提示', "驾驶员不能为空！");
                                                        return;
                                                    }

                                                    //var toAdsPeople = Ext.getCmp("toAdsPeople").getValue();
                                                    //if (toAdsPeople === "") {
                                                    //    Ext.Msg.alert('提示', "联系人不能为空！");
                                                    //    return;
                                                    //}

                                                    //var toAdsTel = Ext.getCmp("toAdsTel").getValue();
                                                    //if (toAdsTel === "") {
                                                    //    Ext.Msg.alert('提示', "联系电话不能为空！");
                                                    //    return;
                                                    //}

                                                    //取得表单中的内容
                                                    var values = form.form.getValues(false);
                                                    var me = this;
                                                    if (checkYunfeiTotal()) {
                                                        CS('CZCLZ.ZCDMag.SaveZCD', function (ret) {
                                                            if (ret.bo) {
                                                                Ext.Msg.show({
                                                                    title: '提示',
                                                                    msg: '保存成功!',
                                                                    buttons: Ext.MessageBox.OK,
                                                                    icon: Ext.MessageBox.INFO,
                                                                    fn: function () {
                                                                        //FrameStack.popFrame();
                                                                    }
                                                                });
                                                                zcdid = ret.zcdid;
                                                            } else {
                                                                Ext.MessageBox.confirm("提示", "装车单号重复，置入新的装车单号【" + ret.newBm + "】，确认吗?", function (obj) {
                                                                    if (obj == "yes") {
                                                                        Ext.getCmp('zhuangchedanNum').setValue(ret.newBm);
                                                                    }
                                                                });
                                                            }
                                                            BindYDData(1);
                                                        }, CS.onError, zcdid, values);
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype: 'buttongroup',
                                    title: '',
                                    items: [
                                        {
                                            xtype: "button",
                                            text: "打印",
                                            iconCls: "printer",
                                            handler: function () {
                                                if (zcdid) {
                                                    CS('CZCLZ.ZCDMag.GetAddredd', function (retVal) {
                                                        if (retVal) {
                                                            LODOP = getLodop();
                                                            LODOP.SET_PRINT_PAGESIZE(2, 2400, 2800, '');
                                                            LODOP.ADD_PRINT_HTM(3, 0, '100%', 30, "<center style='font-size:20px;font-weight:600;'>物流运输协议</center>");
                                                            LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
                                                            //var url = encodeURI("approot/r/JS/ZCDGL/ZhuangchePrint.aspx?action=PrintZhuangCheYundan");
                                                            var param = { zhuangchedanId: zcdid };

                                                            var curWwwPath = window.document.location.href;
                                                            var pathName = window.document.location.pathname;
                                                            var pos = curWwwPath.indexOf(pathName);
                                                            var localhostPaht = curWwwPath.substring(0, pos);
                                                            var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
                                                            var base = localhostPaht + projectName;
                                                            var url = base + "/JS/ZCDGL/ZhuangchePrint.aspx?action=PrintZhuangCheYundan";
                                                            
                                                            $.post(url, param,
                                                                function (data, textStatus) {
                                                                    LODOP.ADD_PRINT_TABLE('6%', '2%', '98%', '80%', data);
                                                                    LODOP.SET_PRINT_STYLEA(0, "FontSize", 9);
                                                                    LODOP.PREVIEW();  //预览打印
                                                                }, "text");
                                                        }
                                                    }, CS.onError);



                                                    //CS('CZCLZ.ZCDMag.PrintZCD', function (ret) {
                                                    //    if (ret) {
                                                    //        LODOP = getLodop();

                                                    //        LODOP.ADD_PRINT_HTM(3, 0, '100%', 30, "<center style='font-size:20px;font-weight:600;'>物流运输协议</center>");
                                                    //        LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);

                                                    //        LODOP.ADD_PRINT_TABLE('6%', '2%', '98%', '80%', ret.html);
                                                    //        LODOP.SET_PRINT_STYLEA(0, "FontSize", 9);
                                                    //        LODOP.PRINT_DESIGN();
                                                    //        //LODOP.PREVIEW();  //预览打印
                                                    //    }
                                                    //}, CS.onError, zcdid);
                                                } else {
                                                    Ext.Msg.alert('提示', "请先保存该装车单！");
                                                    return;
                                                }
                                            }
                                        }
                                    ]
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
                                                    text: "修改(大车送)",
                                                    handler: function () {
                                                        if (XZKCStore.data.items.length) {
                                                            var win = new EditDCWin();
                                                            win.show();
                                                        } else {
                                                            Ext.Msg.alert('提示', "请选择库存运单！");
                                                            return;
                                                        }
                                                    }
                                                },
                                                {
                                                    text: "设置(主货到付)",
                                                    handler: function () {
                                                        if (XZKCStore.data.items.length) {
                                                            var win = new EditZHDFWin();
                                                            win.show();
                                                        } else {
                                                            Ext.Msg.alert('提示', "请选择库存运单！");
                                                            return;
                                                        }
                                                    }
                                                },
                                                {
                                                    text: "拆分运单", handler: function () {
                                                        if (XZKCStore.data.items.length) {
                                                            if (XZKCStore.data.items.length > 1) {
                                                                Ext.Msg.alert('提示', "每次只能对一条运单进行拆分！");
                                                                return;
                                                            } else {
                                                                FrameStack.pushFrame({
                                                                    url: "CFYD.html?cfid=" + XZKCStore.data.items[0].data.yundan_chaifen_id,
                                                                    onClose: function () {
                                                                        BindYDData(1);
                                                                        XZKCStore.removeAll();
                                                                    }
                                                                });
                                                            }
                                                        } else {
                                                            Ext.Msg.alert('提示', "请选择库存运单！");
                                                            return;
                                                        }
                                                    }
                                                },
                                                {
                                                    text: "修改收货网点",
                                                    handler: function () {
                                                        if (XZKCStore.data.items.length) {
                                                            var win = new EditSHZWin();
                                                            win.show(null, function () {
                                                                CS('CZCLZ.BscMag.GetOtherBsc', function (retVal) {
                                                                    shzstore.loadData(retVal);
                                                                }, CS.onError)
                                                            });
                                                        } else {
                                                            Ext.Msg.alert('提示', "请选择库存运单！");
                                                            return;
                                                        }
                                                    }
                                                },
                                                '-',
                                                {
                                                    text: "加入装车单",
                                                    handler: function () {
                                                        if (zcdid) {
                                                            if (XZKCStore.data.items.length) {
                                                                var xzkclist = [];
                                                                for (var i = 0; i < XZKCStore.data.items.length; i++) {
                                                                    xzkclist.push(XZKCStore.data.items[i].data);
                                                                }
                                                                CS('CZCLZ.ZCDMag.AddZCD', function (retVal) {
                                                                    Ext.Msg.show({
                                                                        title: '提示',
                                                                        msg: '保存成功!',
                                                                        buttons: Ext.MessageBox.OK,
                                                                        icon: Ext.MessageBox.INFO,
                                                                        fn: function () {
                                                                            XZKCStore.removeAll();
                                                                            XZYPSStore.removeAll();
                                                                            BindYDData(1);
                                                                            BindYPSYDData(1);
                                                                        }
                                                                    });
                                                                    Ext.getCmp("moneyZhuhuoDaofu").setValue(retVal);
                                                                }, CS.onError, zcdid, xzkclist);
                                                            } else {
                                                                Ext.Msg.alert('提示', "请选择库存运单！");
                                                                return;
                                                            }
                                                        } else {
                                                            Ext.Msg.alert('提示', "请先保存该装车单！");
                                                            return;
                                                        }
                                                    }
                                                },
                                                {
                                                    text: "从装车单中删除",
                                                    handler: function () {
                                                        if (zcdid) {
                                                            if (XZYPSStore.data.items.length) {
                                                                var xzypslist = [];
                                                                for (var i = 0; i < XZYPSStore.data.items.length; i++) {
                                                                    xzypslist.push(XZYPSStore.data.items[i].data);
                                                                }
                                                                CS('CZCLZ.ZCDMag.DeleteZCD', function (retVal) {
                                                                    if (retVal) {
                                                                        Ext.Msg.show({
                                                                            title: '提示',
                                                                            msg: '保存成功!',
                                                                            buttons: Ext.MessageBox.OK,
                                                                            icon: Ext.MessageBox.INFO,
                                                                            fn: function () {
                                                                                BindYDData(1);
                                                                                BindYPSYDData(1);
                                                                                XZYPSStore.removeAll();
                                                                            }
                                                                        });
                                                                    }

                                                                }, CS.onError, zcdid, xzypslist);
                                                            } else {
                                                                Ext.Msg.alert('提示', "请选择已配送运单！");
                                                                return;
                                                            }
                                                        } else {
                                                            Ext.Msg.alert('提示', "请先保存该装车单！");
                                                            return;
                                                        }
                                                    }
                                                },
                                                '-',
                                                {
                                                    text: "导出", handler: function () {
                                                        if (XZKCStore.data.items.length) {
                                                            var xzkcslist = [];
                                                            for (var i = 0; i < XZKCStore.data.items.length; i++) {
                                                                xzkcslist.push(XZKCStore.data.items[i].data);
                                                            }
                                                            DownloadFile("CZCLZ.ZCDMag.GetKCYDToFile", "导出库存运单.xls", 1, xzkcslist);
                                                            XZKCStore.removeAll();
                                                        } else {
                                                            Ext.Msg.alert('提示', "请选择库存运单！");
                                                            return;
                                                        }
                                                    }
                                                },
                                                {
                                                    text: "打印",
                                                    handler: function () {
                                                        if (XZKCStore.data.items.length || XZYPSStore.data.items.length) {
                                                            CS('CZCLZ.ZCDMag.GetAddredd', function (retVal) {
                                                                if (retVal) {
                                                                    LODOP = getLodop();
                                                                    LODOP.ADD_PRINT_HTM(3, 0, '100%', 30, "<center style='font-size:20px;font-weight:600;'>装车清单一览表</center>");
                                                                    LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
                                                                    var idArr = [];
                                                                    for (var i = 0; i < XZKCStore.data.items.length; i++) {
                                                                        idArr.push(XZKCStore.data.items[i].data['yundan_chaifen_id']);
                                                                    }
                                                                    for (var i = 0; i < XZYPSStore.data.items.length; i++) {
                                                                        idArr.push(XZYPSStore.data.items[i].data['yundan_chaifen_id']);
                                                                    }

                                                                    var curWwwPath = window.document.location.href;
                                                                    var pathName = window.document.location.pathname;
                                                                    var pos = curWwwPath.indexOf(pathName);
                                                                    var localhostPaht = curWwwPath.substring(0, pos);
                                                                    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
                                                                    var base = localhostPaht + projectName;
                                                                    var url = base + "/JS/ZCDGL/ZhuangchePrint.aspx?action=PrintZhuangCheQingdan";

                                                                    //var url = encodeURI(retVal + "/JS/ZCDGL/ZhuangchePrint.aspx?action=PrintZhuangCheQingdan");
                                                                    var param = { idArr: idArr };
                                                                    $.post(url, param,
                                                                        function (data, textStatus) {
                                                                            LODOP.ADD_PRINT_TABLE('6%', '2%', '98%', '80%', data);
                                                                            LODOP.SET_PRINT_STYLEA(0, "FontSize", 9);
                                                                            LODOP.PREVIEW();  //预览打印
                                                                        }, "text");
                                                                }
                                                            }, CS.onError);
                                                            //printYD();
                                                        } else {
                                                            Ext.Msg.alert('提示', "请选择运单！");
                                                            return;
                                                        }
                                                    }
                                                }
                                            ]
                                        }]
                                },
                                {
                                    xtype: 'buttongroup',
                                    title: '',
                                    items: [
                                        {
                                            xtype: "button",
                                            text: "确认到站",
                                            iconCls: "enable",
                                            id:'qrdz',
                                            handler: function () {
                                                Ext.MessageBox.confirm("提示", "是否确认到站?", function (obj) {
                                                    if (obj == "yes") {
                                                        CS('CZCLZ.ZCDMag.UpdateIsArrive', function (retVal) {
                                                            if (retVal) {
                                                                Ext.Msg.show({
                                                                    title: '提示',
                                                                    msg: '修改成功!',
                                                                    buttons: Ext.MessageBox.OK,
                                                                    icon: Ext.MessageBox.INFO
                                                                });
                                                                getZcd(zcdid);
                                                            }
                                                        }, CS.onError, zcdid, 1);
                                                    }
                                                    else {
                                                        return;
                                                    }
                                                });
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype: 'buttongroup',
                                    items: [
                                        {
                                            xtype: "button",
                                            text: "取消确认",
                                            iconCls: "delete",
                                            id: 'qxqr',
                                            hidden: true,
                                            handler: function () {
                                                Ext.MessageBox.confirm("提示", "是否取消到站?", function (obj) {
                                                    if (obj == "yes") {
                                                        CS('CZCLZ.ZCDMag.UpdateIsArrive', function (retVal) {
                                                            if (retVal) {
                                                                Ext.Msg.show({
                                                                    title: '提示',
                                                                    msg: '修改成功!',
                                                                    buttons: Ext.MessageBox.OK,
                                                                    icon: Ext.MessageBox.INFO
                                                                });
                                                                getZcd(zcdid);
                                                            }
                                                        }, CS.onError, zcdid, 0);
                                                    }
                                                    else {
                                                        return;
                                                    }
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
                                            iconCls: 'close',
                                            text: '返回',
                                            handler: function () {
                                                FrameStack.popFrame();
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    items: [
                        {
                            xtype: 'form',
                            layout: {
                                type: 'column'
                            },
                            id: 'addform',
                            width: '100%',
                            border: false,
                            padding: '10 10 0 10',
                            region: 'center',
                            items: [
                                {
                                    xtype: 'container',
                                    columnWidth: 1,
                                    layout: {
                                        type: 'column'
                                    },
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            name: 'zhuangchedanNum',
                                            id: 'zhuangchedanNum',
                                            columnWidth: 0.25,
                                            margin: '5 10 5 10',
                                            fieldLabel: '装车单号',
                                            allowBlank: false,
                                            labelWidth: 70,
                                            readOnly: true,
                                            fieldStyle: 'color:#999999; background-color: #E6E6E6; background-image: none;'
                                        },
                                        {
                                            xtype: 'datefield',
                                            allowBlank: false,
                                            format: 'Y-m-d',
                                            margin: '5 10 5 10',
                                            fieldLabel: '签单日期',
                                            editable: false,
                                            name: 'qiandanDate',
                                            id: 'qiandanDate',
                                            columnWidth: 0.25,
                                            labelWidth: 70,
                                            value: new Date()
                                        },
                                        {
                                            xtype: 'datefield',
                                            allowBlank: false,
                                            format: 'Y-m-d',
                                            margin: '5 10 5 10',
                                            fieldLabel: '交付日期',
                                            editable: false,
                                            name: 'jiaofuDate',
                                            id: 'jiaofuDate',
                                            columnWidth: 0.25,
                                            labelWidth: 70,
                                            value: new Date()
                                        },
                                        {
                                            xtype: 'combobox',
                                            id: 'driverId',
                                            name: 'driverId',
                                            allowBlank: false,
                                            displayField: 'people',
                                            valueField: 'driverId',
                                            queryMode: 'local',
                                            columnWidth: 0.25,
                                            margin: '5 10 5 10',
                                            editable: false,
                                            store: driverstore,
                                            fieldLabel: '驾驶员',
                                            labelWidth: 70,
                                            listeners: {
                                                'select': function (o) {
                                                    Ext.getCmp("tel").setValue(o.valueModels[0].data.tel);
                                                    Ext.getCmp("carNum").setValue(o.valueModels[0].data.carNum);
                                                }
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    columnWidth: 1,
                                    layout: {
                                        type: 'column'
                                    },
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            columnWidth: 0.25,
                                            margin: '5 10 5 10',
                                            fieldLabel: '车辆牌照',
                                            name: 'carNum',
                                            id: 'carNum',
                                            labelWidth: 70,
                                            readOnly: true,
                                            fieldStyle: 'color:#999999; background-color: #E6E6E6; background-image: none;'

                                        },
                                        {
                                            xtype: 'textfield',
                                            columnWidth: 0.25,
                                            margin: '5 10 5 10',
                                            fieldLabel: '司机电话',
                                            name: 'tel',
                                            id: 'tel',
                                            labelWidth: 70,
                                            readOnly: true,
                                            fieldStyle: 'color:#999999; background-color: #E6E6E6; background-image: none;'

                                        },
                                        {
                                            xtype: 'combobox',
                                            allowBlank: false,
                                            displayField: 'officeName',
                                            valueField: 'officeId',
                                            queryMode: 'local',
                                            columnWidth: 0.25,
                                            margin: '5 10 5 10',
                                            editable: false,
                                            fieldLabel: '到达站',
                                            name: 'toOfficeId',
                                            id: 'toOfficeId',
                                            labelWidth: 70,
                                            store: zdzstore,
                                            listeners: {
                                                'select': function (o) {
                                                    BindYDData(1);
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'textfield',
                                            columnWidth: 0.25,
                                            margin: '5 10 5 10',
                                            fieldLabel: '联系人',
                                            name: 'toAdsPeople',
                                            id: 'toAdsPeople',
                                            labelWidth: 70
                                        }

                                    ]
                                },
                                {
                                    xtype: 'container',
                                    columnWidth: 1,
                                    layout: {
                                        type: 'column'
                                    },
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            columnWidth: 0.25,
                                            margin: '5 10 5 10',
                                            fieldLabel: '联系电话',
                                            name: 'toAdsTel',
                                            id: 'toAdsTel',
                                            labelWidth: 70
                                        },
                                        {
                                            xtype: 'combobox',
                                            allowBlank: false,
                                            displayField: 'officeName',
                                            valueField: 'officeId',
                                            queryMode: 'local',
                                            columnWidth: 0.25,
                                            margin: '5 10 5 10',
                                            editable: false,
                                            fieldLabel: '起始站',
                                            name: 'officeId',
                                            id: 'officeId',
                                            labelWidth: 70,
                                            store: qszstore
                                        }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    columnWidth: 1,
                                    layout: {
                                        type: 'column'
                                    },
                                    items: [
                                        {
                                            xtype: 'numberfield',
                                            columnWidth: 0.24,
                                            margin: '5 2 5 10',
                                            fieldLabel: '运费总额',
                                            name: 'moneyTotal',
                                            id: 'moneyTotal',
                                            allowNegative: false,
                                            minValue: 0,
                                            labelWidth: 70,
                                            value: 0,
                                            allowblank: false

                                        },
                                        { xtype: "displayfield", value: "元", margin: '5 10 5 0', columnWidth: 0.01, },
                                        {
                                            xtype: 'numberfield',
                                            columnWidth: 0.24,
                                            margin: '5 2 5 10',
                                            fieldLabel: '预付运费',
                                            name: 'moneyYufu',
                                            id: 'moneyYufu',
                                            allowNegative: false,
                                            minValue: 0,
                                            labelWidth: 70,
                                            value: 0,
                                            allowblank: false

                                        },
                                        { xtype: "displayfield", value: "元", margin: '5 10 5 0', columnWidth: 0.01, },
                                        {
                                            xtype: 'numberfield',
                                            columnWidth: 0.24,
                                            margin: '5 2 5 10',
                                            fieldLabel: '尚欠运费',
                                            name: 'moneyQianfu',
                                            id: 'moneyQianfu',
                                            allowNegative: false,
                                            minValue: 0,
                                            labelWidth: 70,
                                            value: 0,
                                            allowblank: false

                                        },
                                        { xtype: "displayfield", value: "元", margin: '5 10 5 0', columnWidth: 0.01, },
                                        {
                                            xtype: 'numberfield',
                                            columnWidth: 0.24,
                                            margin: '5 2 5 10',
                                            fieldLabel: '点上到付',
                                            allowNegative: false,
                                            minValue: 0,
                                            name: 'moneyDaofu',
                                            id: 'moneZCDaofu',
                                            labelWidth: 70,
                                            value: 0,
                                            allowblank: false

                                        },
                                        { xtype: "displayfield", value: "元", margin: '5 10 5 0', columnWidth: 0.01, }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    columnWidth: 1,
                                    layout: {
                                        type: 'column'
                                    },
                                    items: [
                                        {
                                            xtype: 'numberfield',
                                            columnWidth: 0.24,
                                            margin: '5 2 5 10',
                                            fieldLabel: '主货到付',
                                            name: 'moneyZhuhuoDaofu',
                                            id: 'moneyZhuhuoDaofu',
                                            allowNegative: false,
                                            minValue: 0,
                                            labelWidth: 70,
                                            value: 0,
                                            allowblank: false,
                                            readOnly: true,
                                            fieldStyle: 'color:#999999; background-color: #E6E6E6; background-image: none;'

                                        },
                                        { xtype: "displayfield", value: "元", margin: '5 10 5 0', columnWidth: 0.01, },
                                        {
                                            xtype: 'numberfield',
                                            columnWidth: 0.24,
                                            margin: '5 2 5 10',
                                            fieldLabel: '本单押金',
                                            allowNegative: false,
                                            minValue: 0,
                                            name: 'moneyYajin',
                                            id: 'moneyYajin',
                                            labelWidth: 70

                                        },
                                        { xtype: "displayfield", value: "元", margin: '5 10 5 0', columnWidth: 0.01, }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    columnWidth: 1,
                                    layout: {
                                        type: 'column'
                                    },
                                    items: [
                                        {
                                            xtype: 'textarea',
                                            margin: '5 30 5 10',
                                            columnWidth: 1,
                                            fieldLabel: '备注',
                                            name: 'memo',
                                            id: 'memo',
                                            labelWidth: 70
                                        }
                                    ]
                                }
                            ]

                        },
                        {
                            xtype: 'tabpanel',
                            padding: '10 10 10 10',
                            layout: {
                                type: 'fit'
                            },
                            flex: 1,
                            items: [
                                {
                                    xtype: 'gridpanel',
                                    id: 'kcgrid',
                                    region: 'center',
                                    border: true,
                                    store: YDStore,
                                    itemId: 'tab1',
                                    title: '库存运单',
                                    columnLines: true,
                                    selModel: Ext.create('Ext.selection.CheckboxModel', {
                                        selType: 'rowmodel',
                                        mode: 'SIMPLE',
                                        listeners: {
                                            deselect: function (model, record, index) {//取消选中时产生的事件
                                                if (XZKCStore.data.length > 0) {
                                                    for (var i = 0; i < XZKCStore.data.length; i++) {
                                                        if (XZKCStore.data.items[i].data.yundan_chaifen_id == record.get('yundan_chaifen_id')) {
                                                            XZKCStore.remove(XZKCStore.data.items[i]);
                                                        }
                                                    }
                                                }
                                            },
                                            select: function (model, record, index) {//record被选中时产生的事件
                                                var n = 1;
                                                if (XZKCStore.data.length > 0) {
                                                    for (var i = 0; i < XZKCStore.data.length; i++) {
                                                        if (XZKCStore.data.items[i].data.yundan_chaifen_id == record.get('yundan_chaifen_id')) {
                                                            n--;
                                                        }
                                                    }
                                                }
                                                if (n == 1) {
                                                    XZKCStore.add(record.data);
                                                }
                                            }
                                        }
                                    }),
                                    columns: [
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'isDache',
                                            text: "大车送",
                                            width: 50,
                                            menuDisabled: true,
                                            sortable: false,
                                            renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                                var str = "";
                                                if (record.data.is_leaf == 0) {
                                                    if (value == 0) {
                                                        str = "否";
                                                    } else if (value == 1) {
                                                        str = "是";
                                                    }
                                                }
                                                return str;
                                            }
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'isZhuhuodaofu',
                                            width: 65,
                                            text: '主货到付',
                                            menuDisabled: true,
                                            sortable: false,
                                            renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                                var str = "";
                                                if (record.data.is_leaf == 0) {
                                                    if (value == 0) {
                                                        str = "否";
                                                    } else if (value == 1) {
                                                        str = "是";
                                                    }
                                                }
                                                return str;
                                            }

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
                                            xtype: 'gridcolumn',
                                            dataIndex: 'yundan_chaifen_number',
                                            width: 140,
                                            text: '运单号',
                                            menuDisabled: true,
                                            sortable: false
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'zhuangchedanNum',
                                            width: 140,
                                            text: '装车单号',
                                            menuDisabled: true,
                                            sortable: false
                                        },
                                        {
                                            xtype: 'datecolumn',
                                            dataIndex: 'hxrq',
                                            width: 90,
                                            format: 'Y-m-d',
                                            text: '核销时间',
                                            menuDisabled: true,
                                            sortable: false
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'officeName',
                                            width: 80,
                                            text: '办事处',
                                            menuDisabled: true,
                                            sortable: false
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'toOfficeName',
                                            width: 80,
                                            text: '收货网点',
                                            menuDisabled: true,
                                            sortable: false
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'toAddress',
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
                                            width: 105,
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
                                            dataIndex: 'shouhuoTel',
                                            width: 90,
                                            text: '收货电话',
                                            menuDisabled: true,
                                            sortable: false
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'shouhuoAddress',
                                            width: 180,
                                            text: '收货地址',
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
                                            dataIndex: 'moneyHuikou',
                                            width: 100,
                                            text: '回扣',
                                            menuDisabled: true,
                                            sortable: false
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
                                            text: '回单张数',
                                            menuDisabled: true,
                                            sortable: false
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'yundan_chaifen_id',
                                            sortable: false,
                                            menuDisabled: true,
                                            text: '操作',
                                            width: 100,
                                            renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                                cfid = value;
                                                return "<a href='JavaScript:void(0)' onclick='ShowHPList(\"" + cfid + "\")'>查看货品</a>";
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
                                                    xtype: 'datefield',
                                                    id: 'cx_kssj',
                                                    fieldLabel: '开始时间',
                                                    format: 'Y-m-d',
                                                    width: 190,
                                                    labelWidth: 60
                                                }, {
                                                    xtype: 'datefield',
                                                    id: 'cx_jssj',
                                                    fieldLabel: '结束时间',
                                                    format: 'Y-m-d',
                                                    width: 190,
                                                    labelWidth: 60
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
                                                                BindYDData(1);
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
                                },
                                {
                                    xtype: 'gridpanel',
                                    id: 'ypsgrid',
                                    region: 'center',
                                    border: true,
                                    store: YPSYDStore,
                                    itemId: 'tab2',
                                    title: '已配送运单',
                                    columnLines: true,
                                    selModel: Ext.create('Ext.selection.CheckboxModel', {
                                        selType: 'rowmodel',
                                        mode: 'SIMPLE',
                                        listeners: {
                                            deselect: function (model, record, index) {//取消选中时产生的事件
                                                if (XZYPSStore.data.length > 0) {
                                                    for (var i = 0; i < XZYPSStore.data.length; i++) {
                                                        if (XZYPSStore.data.items[i].data.yundan_chaifen_id == record.get('yundan_chaifen_id')) {
                                                            XZYPSStore.remove(XZYPSStore.data.items[i]);
                                                        }
                                                    }
                                                }
                                            },
                                            select: function (model, record, index) {//record被选中时产生的事件
                                                var n = 1;
                                                if (XZYPSStore.data.length > 0) {
                                                    for (var i = 0; i < XZYPSStore.data.length; i++) {
                                                        if (XZYPSStore.data.items[i].data.yundan_chaifen_id == record.get('yundan_chaifen_id')) {
                                                            n--;
                                                        }
                                                    }
                                                }
                                                if (n == 1) {
                                                    XZYPSStore.add(record.data);
                                                }
                                            },
                                        }
                                    }),
                                    columns: [
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'isDache',
                                            text: "大车送",
                                            width: 50,
                                            menuDisabled: true,
                                            sortable: false,
                                            renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                                var str = "";
                                                if (record.data.is_leaf == 0) {
                                                    if (value == 0) {
                                                        str = "否";
                                                    } else if (value == 1) {
                                                        str = "是";
                                                    }
                                                }
                                                return str;
                                            }
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'isZhuhuodaofu',
                                            width: 65,
                                            text: '主货到付',
                                            menuDisabled: true,
                                            sortable: false,
                                            renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                                var str = "";

                                                if (record.data.is_leaf == 0) {
                                                    if (value == 0) {
                                                        str = "否";
                                                    } else if (value == 1) {
                                                        str = "是";
                                                    }
                                                }
                                                return str;
                                            }

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
                                            xtype: 'gridcolumn',
                                            dataIndex: 'yundan_chaifen_number',
                                            width: 140,
                                            text: '运单号',
                                            menuDisabled: true,
                                            sortable: false
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'zhuangchedanNum',
                                            width: 140,
                                            text: '装车单号',
                                            menuDisabled: true,
                                            sortable: false
                                        },
                                        {
                                            xtype: 'datecolumn',
                                            dataIndex: 'hxrq',
                                            width: 65,
                                            format: 'Y-m-d',
                                            text: '核销时间',
                                            menuDisabled: true,
                                            sortable: false
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'officeName',
                                            width: 80,
                                            text: '办事处',
                                            menuDisabled: true,
                                            sortable: false
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'toOfficeName',
                                            width: 80,
                                            text: '收货网点',
                                            menuDisabled: true,
                                            sortable: false
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'toAddress',
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
                                            dataIndex: 'shouhuoTel',
                                            width: 90,
                                            text: '收货电话',
                                            menuDisabled: true,
                                            sortable: false
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'shouhuoAddress',
                                            width: 180,
                                            text: '收货地址',
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
                                            dataIndex: 'moneyHuikou',
                                            width: 100,
                                            text: '回扣',
                                            menuDisabled: true,
                                            sortable: false
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
                                            text: '回单张数',
                                            menuDisabled: true,
                                            sortable: false
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'yundan_chaifen_id',
                                            sortable: false,
                                            menuDisabled: true,
                                            text: '操作',
                                            width: 100,
                                            renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                                cfid = value;
                                                return "<a href='JavaScript:void(0)' onclick='ShowHPList(\"" + cfid + "\")'>查看货品</a>";
                                            }
                                        }

                                    ],
                                    viewConfig: {

                                    },
                                    dockedItems: [
                                        {
                                            xtype: 'pagingtoolbar',
                                            displayInfo: true,
                                            store: YPSYDStore,
                                            dock: 'bottom'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});

Ext.onReady(function () {
    new EditZCD();
    getBscQs();
    getBscZd();
    getDriver();
    getZcd(zcdid);
});

