<%@ Page Language="C#" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv='X-UA-Compatible' content='IE=Edge' />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <script language="javascript" type="text/javascript" src="../jquery-1.7.1.min.js"></script>
    <script src="../jquery.blockUI.js"></script>
    <script src="../cb.js"></script>
    <script src="../extjs/ext-all.js"></script>
    <link href="../extjs/resources/css/ext-all.css" rel="stylesheet" />
    <script src="../extjs/ext-lang-zh_CN.js"></script>
    <script src="../extjs/ext-lang-zh_CN.js"></script>
    <script src="../cb.js"></script>
    <script src="../json.js"></script>
    <script src="../fun.js"></script>
    <script src="../helper.js"></script>

    <script language="javascript" type="text/javascript" src="../LodopFuncs.js"></script>
    <object id="LODOP_OB" classid="clsid:2105C259-1E0C-4534-8141-A753534CB4CA" width="0" height="0">
        <embed id="LODOP_EM" type="application/x-print-lodop" width="0" height="0" pluginspage="install_lodop.exe"></embed>
    </object>
    <script>
        var isPreview = 0;

        function createForm() {
            LODOP = getLodop();
            LODOP.PRINT_INIT('亲，打印机');
            LODOP.NewPage();
            var actionType = getUrlVar("actionType");
            var isPreview = getUrlVar("isPreview");//是否预览
            var yundanId = getUrlVar("yundanId");
            if (actionType == "printBq") {
                var topMM = 4;
                var topPX = 4 * 96 / 25.4;
                var needNum = getUrlVar("needNum");
                var printedNum = getUrlVar("printedNum");
                InlineCS('CZCLZ.YDMag.PrintYundanBQ', function (retVal) {
                    LODOP.SET_PRINT_PAGESIZE(1, "80mm", "51mm", "");
                    LODOP.ADD_PRINT_TEXT(2 + topPX, 30, 250, 30, retVal.companyName);
                    LODOP.SET_PRINT_STYLEA(0, "FontSize", 16);
                    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
                    LODOP.ADD_PRINT_TEXT(28 + topPX, 30, 250, 22, retVal.zxName);
                    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
                    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
                    LODOP.ADD_PRINT_LINE(52 + topPX, 0, 51 + topPX, 302, 0, 2);
                    LODOP.ADD_PRINT_LINE(83 + topPX, 0, 82 + topPX, 302, 0, 1);
                    LODOP.ADD_PRINT_LINE(113 + topPX, 0, 112 + topPX, 302, 0, 1);
                    LODOP.ADD_PRINT_LINE(145 + topPX, 0, 144 + topPX, 302, 0, 1);
                    LODOP.ADD_PRINT_TEXT(57 + topPX, 6, 74, 25, "单号：");
                    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                    LODOP.ADD_PRINT_TEXT(57 + topPX, 156, 74, 25, "到站：");
                    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                    LODOP.ADD_PRINT_TEXT(88 + topPX, 6, 74, 25, "货名：");
                    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                    LODOP.ADD_PRINT_TEXT(88 + topPX, 156, 74, 25, "收货人：");
                    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                    LODOP.ADD_PRINT_TEXT(119 + topPX, 6, 100, 25, "包装：");
                    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                    LODOP.ADD_PRINT_TEXT(119 + topPX, 156, 100, 25, "件数：");
                    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                    LODOP.ADD_PRINT_TEXT(149 + topPX, 6, 74, 25, "电话：");
                    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                    LODOP.ADD_PRINT_TEXT(151 + topPX, 50, 250, 25, retVal.companyTel);
                    LODOP.SET_PRINT_STYLEA(0, "FontName", "幼圆");
                    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                    LODOP.ADD_PRINT_TEXT(57 + topPX, "13mm", "40mm", "15.3mm", retVal.yundanNum);//运单号
                    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                    LODOP.ADD_PRINT_TEXT(57 + topPX, "56mm", "33.1mm", "15.3mm", retVal.toAddress);//到达站
                    LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
                    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
                    LODOP.ADD_PRINT_TEXT(88 + topPX, "13mm", "33.1mm", "15.3mm", retVal.goodsName);//货名
                    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                    LODOP.ADD_PRINT_TEXT(88 + topPX, "56mm", "28mm", "5.3mm", retVal.shouhuoPeople);//收货人
                    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                    LODOP.ADD_PRINT_TEXT(119 + topPX, "13mm", "60mm", "10.6mm", retVal.pack);//包装
                    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                    LODOP.ADD_PRINT_TEXT(119 + topPX, "56mm", "33.1mm", "5.3mm", retVal.goodsAmount);//件数
                    LODOP.SET_PRINT_STYLEA(0, "FontSize", 13);
                    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
                    LODOP.SET_PRINT_COPIES(needNum - printedNum);
                }, CS.onError, yundanId);
            } else if (actionType == "printYD") {
                InlineCS('CZCLZ.YDMag.PrintYundan', function (ret) {
                    var pageWidth = "300mm";
                    var pageHeight = "300mm";
                    var topBJ = 0;
                    if (ret.ztdt[0]["topBJ"]) {
                        topBJ = ret.ztdt[0]["topBJ"] + 'mm';
                    }
                    var leftBJ = 0;
                    if (ret.ztdt[0]["leftBJ"]) {
                        leftBJ = ret.ztdt[0]["leftBJ"] + 'mm';
                    }
                    LODOP.PRINT_INITA(topBJ, leftBJ, pageWidth, pageHeight, "");
                    LODOP.SET_PRINT_PAGESIZE(1, pageWidth, pageHeight, "");

                    for (var i = 0; i < ret.printdt.length; i++) {
                        var top = ret.printdt[i]["topBJ"] + 'mm';
                        var left = ret.printdt[i]["leftBJ"] + "mm";
                        var fontSize = ret.printdt[i]["fontSize"];
                        //起运地点
                        if (ret.printdt[i]["fieldMC"] == "起运地点") {
                            LODOP.ADD_PRINT_TEXT(top, left, "47.1mm", "6.9mm", ret.dt[0].fromAddress);//yundan.fromAddress
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
                            LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                        }
                        //到达地点
                        if (ret.printdt[i]["fieldMC"] == "到达地点") {
                            LODOP.ADD_PRINT_TEXT(top, left, "47.1mm", "6.9mm", ret.dt[0].toAddress);//yundan.toAddress
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", fontSize);
                            LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                        }
                        //欠付
                        if (ret.printdt[i]["fieldMC"] == "欠付") {
                            LODOP.ADD_PRINT_TEXT(top, left, "47.1mm", "6.9mm", ret.dt[0].moneyQianfu);//yundan.moneyQianfuAs
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", fontSize);
                            LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                        }
                        //已付 = 现付
                        if (ret.printdt[i]["fieldMC"] == "已付") {
                            LODOP.ADD_PRINT_TEXT(top, left, "47.1mm", "6.9mm", ret.dt[0].moneyXianfu);//yundan.moneyXianfu
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", fontSize);
                            LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                        }
                        //到付
                        if (ret.printdt[i]["fieldMC"] == "到付") {
                            LODOP.ADD_PRINT_TEXT(top, left, "47.1mm", "6.9mm", ret.dt[0].moneyDaofu);//yundan.moneyDaofu
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", fontSize);
                            LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                        }
                        //运单编号
                        if (ret.printdt[i]["fieldMC"] == "运单编号") {
                            LODOP.ADD_PRINT_TEXT(top, left, "47.1mm", "6.9mm", ret.dt[0].yundanNum);//yundan.yundanNum
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", fontSize);
                            LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                        }
                        //回单数
                        if (ret.dt[0].huidanType == 0) {
                            if (ret.printdt[i]["fieldMC"] == "回单数") {
                                LODOP.ADD_PRINT_TEXT(top, left, "47.1mm", "6.9mm", ret.dt[0].cntHuidan);//yundan.cntHuidan
                                LODOP.SET_PRINT_STYLEA(0, "FontSize", fontSize);
                                LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                            }
                        } else {
                            if (ret.printdt[i]["fieldMC"] == "收条数") {
                                LODOP.ADD_PRINT_TEXT(top, left, "47.1mm", "6.9mm", ret.dt[0].cntHuidan);//yundan.cntHuidan
                                LODOP.SET_PRINT_STYLEA(0, "FontSize", fontSize);
                                LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                            }
                        }
                        //打印抬头
                        if (ret.printdt[i]["fieldMC"] == "查货宝") {
                            LODOP.ADD_PRINT_TEXT(top, left, "72mm", "8mm", ret.zxName);
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", 16);
                            LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                        }
                        //打印地址一(到达站办事处地址)
                        if (ret.printdt[i]["fieldMC"] == "公司地址1（到达办事处）") {
                            LODOP.ADD_PRINT_TEXT(top, left, "180mm", "8mm", ret.dt[0].toOfficeAd);//yundan.toOfficeAd
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
                            LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                        }
                        //打印地址二(起始站办事处地址)
                        if (ret.printdt[i]["fieldMC"] == "公司地址2（起始办事处）") {
                            LODOP.ADD_PRINT_TEXT(top, left, "180mm", "8mm", ret.dt[0].fromAddress);//yundan.fromOfficeAd
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
                            LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                        }
                        //收货单位
                        if (ret.printdt[i]["fieldMC"] == "收货人（单位）") {
                            LODOP.ADD_PRINT_TEXT(top, left, "72mm", "6.9mm", ret.dt[0].shouhuoPeople);//yundan.shouhuoPeople
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                            LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                        }
                        //收货地址
                        if (ret.printdt[i]["fieldMC"] == "收货地址") {
                            LODOP.ADD_PRINT_TEXT(top, left, "72mm", "6.9mm", ret.dt[0].shouhuoAddress);//yundan.shouhuoAddress
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                            LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                        }
                        //收货人电话
                        if (ret.printdt[i]["fieldMC"] == "收货电话") {
                            LODOP.ADD_PRINT_TEXT(top, left, "120mm", "6.9mm", ret.dt[0].shouhuoTel);//yundan.shouhuoTel
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                            LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                        }
                        //客户-托运人(单位) 姓名
                        if (ret.printdt[i]["fieldMC"] == "托运人（单位）") {
                            LODOP.ADD_PRINT_TEXT(top, left, "40mm", "6.9mm", ret.dt[0].clientName);//yundan.Client.people
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                            LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                        }
                        //客户地址
                        if (ret.printdt[i]["fieldMC"] == "托运地址") {
                            LODOP.ADD_PRINT_TEXT(top, left, "70.1mm", "6.9mm", ret.dt[0].clientAddress);//yundan.Client.address
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                            LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                        }
                        //客户-托运人(单位) 电话
                        if (ret.printdt[i]["fieldMC"] == "托运电话") {
                            LODOP.ADD_PRINT_TEXT(top, left, "40mm", "6.9mm", ret.dt[0].clientTel);//yundan.Client.tel
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                            LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                        }
                        //货品名称
                        if (ret.printdt[i]["fieldMC"] == "货物名称") {
                            LODOP.ADD_PRINT_TEXT(top, left, "33.1mm", "6.9mm", ret.dt[0].goodsName);//yundan.goodsName
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                            LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                        }
                        //包装
                        if (ret.printdt[i]["fieldMC"] == "包装") {
                            LODOP.ADD_PRINT_TEXT(top, left, "17.5mm", "6.9mm", ret.dt[0].pack);//yundan.pack
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                            LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                        }
                        //货品数量
                        if (ret.printdt[i]["fieldMC"] == "件数") {
                            var js = 0
                            if (ret.dt[0].goodsAmount != null) {
                                js = ret.dt[0].goodsAmount;
                            }
                            LODOP.ADD_PRINT_TEXT(top, left, "20.9mm", "6.9mm", js + '件');//yundan.goodsAmount
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                            LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                        }
                        //货品重量
                        if (ret.printdt[i]["fieldMC"] == "重量") {
                            var zl = 0;
                            if (ret.dt[0].goodsWeight != null) {
                                zl = ret.dt[0].goodsWeight;
                            }
                            LODOP.ADD_PRINT_TEXT(top, left, "30mm", "6.6mm", zl + "T");
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                            LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                        }
                        //货品体积
                        if (ret.printdt[i]["fieldMC"] == "体积") {
                            var tj = 0;
                            if (ret.dt[0].goodsVolume != null) {
                                tj = ret.dt[0].goodsVolume;
                            }
                            LODOP.ADD_PRINT_TEXT(top, left, "30mm", "6.6mm", tj + "m³");
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                            LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                        }
                        //运费
                        if (ret.printdt[i]["fieldMC"] == "运费") {
                            LODOP.ADD_PRINT_TEXT(top, left, "32mm", "6.9mm", ret.dt[0].moneyYunfei);
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", fontSize);
                            LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                        }
                        // 结算方式
                        // LODOP.ADD_PRINT_TEXT("0mm","0mm","108mm","6.9mm","回单付");
                        // LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
                        // LODOP.SET_PRINT_STYLEA(0,"FontColor","#000");
                        //运费 金额小写
                        if (ret.printdt[i]["fieldMC"] == "金额（小写）") {
                            LODOP.ADD_PRINT_TEXT(top, left, "32mm", "6.9mm", ret.dt[0].moneyYunfei);
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                        }
                        //运费 金额大写
                        if (ret.printdt[i]["fieldMC"] == "金额（大写）") {
                            if (ret.yfdx == 0) {
                                LODOP.ADD_PRINT_TEXT(top, left, "100%", "6.9mm", ret.dt[0].JE_DX);
                                LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                            } else {
                                LODOP.ADD_PRINT_TEXT(top, left, "100%", "6.9mm", ret.dt[0].JE_DX2);
                                LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                            }
                        }
                        //金额大写字距
                        if (ret.printdt[i]["fieldMC"] == "金额大写字距") {
                            LODOP.SET_PRINT_STYLEA(0, "LetterSpacing", ret.printdt[i]["leftBJ"]);
                            LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                        }
                        //配送方式
                        if (ret.psfs == 0) {
                            if (ret.printdt[i]["fieldMC"] == "送货到家") {
                                if (ret.dt[0].songhuoType == 0) {
                                    LODOP.ADD_PRINT_TEXT(top, left, "20mm", "6.9mm", "自提");
                                } else {
                                    LODOP.ADD_PRINT_TEXT(top, left, "20mm", "6.9mm", "送货");
                                }
                                LODOP.SET_PRINT_STYLEA(0, "FontSize", fontSize);
                                LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                            }
                        }
                        //备注
                        if (ret.printdt[i]["fieldMC"] == "备注") {
                            LODOP.ADD_PRINT_TEXT(top, left, "92.9mm", "6.9mm", ret.dt[0].memo);//yundan.memo
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", fontSize);
                            LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                        }
                        if (ret.rq == 0) {
                            //年
                            if (ret.printdt[i]["fieldMC"] == "签单年") {
                                LODOP.ADD_PRINT_TEXT(top, left, "9.3mm", "5.3mm", ret.dt[0].YY + "年");
                                LODOP.SET_PRINT_STYLEA(0, "FontSize", fontSize);
                                LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                            }
                            //月
                            if (ret.printdt[i]["fieldMC"] == "签单月") {
                                LODOP.ADD_PRINT_TEXT(top, left, "7.7mm", "5.3mm", ret.dt[0].MM + "月");
                                LODOP.SET_PRINT_STYLEA(0, "FontSize", fontSize);
                                LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                            }
                            //日
                            if (ret.printdt[i]["fieldMC"] == "签单日") {
                                LODOP.ADD_PRINT_TEXT(top, left, "7.7mm", "5.3mm", ret.dt[0].DD + "日");
                                LODOP.SET_PRINT_STYLEA(0, "FontSize", fontSize);
                                LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                            }
                        } else {
                            //年
                            if (ret.printdt[i]["fieldMC"] == "签单年") {
                                LODOP.ADD_PRINT_TEXT(top, left, "9.3mm", "5.3mm", ret.dt[0].YY);
                                LODOP.SET_PRINT_STYLEA(0, "FontSize", fontSize);
                                LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                            }
                            //月
                            if (ret.printdt[i]["fieldMC"] == "签单月") {
                                LODOP.ADD_PRINT_TEXT(top, left, "7.7mm", "5.3mm", ret.dt[0].MM);
                                LODOP.SET_PRINT_STYLEA(0, "FontSize", fontSize);
                                LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                            }
                            //日
                            if (ret.printdt[i]["fieldMC"] == "签单日") {
                                LODOP.ADD_PRINT_TEXT(top, left, "7.7mm", "5.3mm", ret.dt[0].DD);
                                LODOP.SET_PRINT_STYLEA(0, "FontSize", fontSize);
                                LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                            }
                        }
                    }
                    //制单人
                    LODOP.ADD_PRINT_TEXT("137mm", "102mm", "26.5mm", "13mm", ret.dt[0].zhidanRen);//yundan.zhidanRen
                    LODOP.SET_PRINT_STYLEA(0, "FontSize", 13);
                    LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                }, CS.onError, yundanId);
            } else if (actionType == 'printXF') {
                InlineCS('CZCLZ.YDMag.PrintYundanXF', function (ret) {
                    var pageWidth = "250mm";
                    var pageHeight = "120mm";

                    LODOP.PRINT_INITA("0mm", "0mm", pageWidth, pageHeight, "");
                    LODOP.SET_PRINT_PAGESIZE(1, pageWidth, pageHeight, "");

                    for (var i = 0; i < ret.printdt.length; i++) {
                        var top = ret.printdt[i]["topBJ"] + "mm";
                        var left = ret.printdt[i]["leftBJ"] + "mm";
                        //自提送货
                        if (ret.dt[0].songhuoType == 0) {
                            if (ret.printdt[i]["fieldMC"] == "自提") {
                                LODOP.ADD_PRINT_TEXT(top, left, "6.1mm", "6.9mm", "√");
                                LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
                                LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                            }
                        } else {
                            if (ret.printdt[i]["fieldMC"] == "送货") {
                                LODOP.ADD_PRINT_TEXT(top, left, "6.1mm", "6.9mm", "√");
                                LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
                                LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                            }
                        }
                        //回单收条		
                        if (ret.dt[0].huidanType == 0) {
                            if (ret.printdt[i]["fieldMC"] == "回单") {
                                LODOP.ADD_PRINT_TEXT(top, left, "20mm", "6.9mm", '回单:' + ret.dt[0].cntHuidan);
                                LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
                                LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                                LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
                            }
                        } else {
                            if (ret.printdt[i]["fieldMC"] == "收条") {
                                LODOP.ADD_PRINT_TEXT(top, left, "20mm", "6.9mm", '收条:' + ret.dt[0].cntHuidan);
                                LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
                                LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                                LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
                            }
                        }
                        // 回单统计
                        if (ret.printdt[i]["fieldMC"] == "回单，收条") {
                            LODOP.ADD_PRINT_TEXT(top, left, "36.2mm", "7.9mm", ret.dt[0].cntHuidan);
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);
                            LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
                        }
                        // 备注
                        if (ret.printdt[i]["fieldMC"] == "备注") {
                            LODOP.ADD_PRINT_TEXT(top, left, "92.9mm", "6.9mm", ret.dt[0].memo);
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                            LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                        }
                        // 货品名称
                        if (ret.printdt[i]["fieldMC"] == "货物名称") {
                            LODOP.ADD_PRINT_TEXT(top, left, "51.6mm", "7.9mm", ret.dt[0].goodsName);
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);
                            LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
                        }
                        //件数
                        if (ret.printdt[i]["fieldMC"] == "件数") {
                            var js = 0;
                            if (ret.dt[0].goodsAmount != null) {
                                js = ret.dt[0].goodsAmount;
                            }
                            LODOP.ADD_PRINT_TEXT(top, left, "58.2mm", "7.9mm", js);
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);
                            LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
                        }
                        //包装
                        if (ret.printdt[i]["fieldMC"] == "包装") {
                            LODOP.ADD_PRINT_TEXT(top, left, "17.5mm", "6.9mm", ret.dt[0].pack);
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);
                            LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                            LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
                        }
                        //货品重量
                        if (ret.printdt[i]["fieldMC"] == "重量") {
                            var zl = 0;
                            if (ret.dt[0].goodsWeight != null) {
                                zl = ret.dt[0].goodsWeight;
                            }
                            LODOP.ADD_PRINT_TEXT(top, left, "30mm", "6.6mm", zl + "T");
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);
                            LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                            LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
                        }
                        //货品体积
                        if (ret.printdt[i]["fieldMC"] == "体积") {
                            var tj = 0;
                            if (ret.dt[0].goodsVolume != null) {
                                tj = ret.dt[0].goodsVolume;
                            }
                            LODOP.ADD_PRINT_TEXT(top, left, "30mm", "6.6mm", tj + "m³");
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);
                            LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                            LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
                        }
                        // 收货人
                        if (ret.printdt[i]["fieldMC"] == "联系人") {
                            LODOP.ADD_PRINT_TEXT(top, left, "147.6mm", "11.1mm", ret.dt[0].shouhuoPeople);
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);
                            LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
                        }

                        // 收货地址
                        if (ret.printdt[i]["fieldMC"] == "地址") {
                            LODOP.ADD_PRINT_TEXT(top, left, "136.8mm", "11.1mm", ret.dt[0].shouhuoAddress);
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
                            LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
                        }

                        // 收货人联系电话
                        if (ret.printdt[i]["fieldMC"] == "电话") {
                            LODOP.ADD_PRINT_TEXT(top, left, "150.5mm", "11.1mm", ret.dt[0].shouhuoTel);
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);
                            LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
                        }

                        // 到付款
                        if (ret.printdt[i]["fieldMC"] == "到付") {
                            LODOP.ADD_PRINT_TEXT(top, left, "26.5mm", "11.1mm", ret.dt[0].moneyDaofu);
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);
                            LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
                        }

                        // 运单编号
                        if (ret.printdt[i]["fieldMC"] == "运单号") {
                            LODOP.ADD_PRINT_TEXT(top, left, "50mm", "6.1mm", ret.dt[0].yundanNum);
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
                            LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
                        }
                        //日期年
                        if (ret.printdt[i]["fieldMC"] == "日期年") {
                            LODOP.ADD_PRINT_TEXT(top, left, "9.3mm", "5.3mm", ret.dt[0].YY);
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", 19);
                            LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                        }
                        //日期月
                        if (ret.printdt[i]["fieldMC"] == "日期月") {
                            LODOP.ADD_PRINT_TEXT(top, left, "7.7mm", "5.3mm", ret.dt[0].MM);
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", 19);
                            LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                        }
                        //日期日
                        if (ret.printdt[i]["fieldMC"] == "日期日") {
                            LODOP.ADD_PRINT_TEXT(top, left, "7.7mm", "5.3mm", ret.dt[0].DD);
                            LODOP.SET_PRINT_STYLEA(0, "FontSize", 19);
                            LODOP.SET_PRINT_STYLEA(0, "FontColor", "#000");
                        }
                    }
                }, CS.onError, yundanId);
            }
            //LODOP.PRINT_DESIGN();
            if (isPreview == 0) {
                //LODOP.PRINT();  //直接打印
            } else {
                LODOP.PREVIEW();
            }
            window.close();
        }
        $(function () {
            setTimeout(createForm, 500);
        });
    </script>
</head>
<body>
</body>
</html>
