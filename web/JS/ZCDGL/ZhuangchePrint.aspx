<%@ Page Language="C#" %>

<!DOCTYPE html>

<script runat="server">
    protected string zhuangchedanId = "";
    protected System.Data.DataTable dt = new System.Data.DataTable();
    protected System.Data.DataTable lineDt = new System.Data.DataTable();
    protected int type = 1;

    protected void Page_Load(object secder, EventArgs e)
    {
        string action = Request["action"].ToString();
        if (action == "PrintZhuangCheYundan")
        {
            type = 1;
            if (Request["zhuangchedanId"] != null && Request["zhuangchedanId"] != "")
            {

                zhuangchedanId = Request["zhuangchedanId"].ToString();
                dt = new ZCDMag().PrintZcdBase(zhuangchedanId);
                lineDt = new ZCDMag().PrintZcdLine(zhuangchedanId);
            }
        }
        else if (action == "PrintZhuangCheQingdan")
        {
            type = 2;
            string[] idsArr = Request.Form[0].Split(',');
            lineDt = new ZCDMag().PrintZhuangcheQindan(idsArr);
        }

    }
    
</script>

<style>
    .th th, .th td {
        font-size: 14px;
        border: 1px solid gray;
        border-collapse: collapse;
    }

    .sbox td {
        border: 1px solid gray;
        border-collapse: collapse;
    }

    .foot {
        font-weight: bold;
    }

    .qt th, .qt td {
        font-size: 14px;
        border: 1px solid black;
        border-collapse: collapse;
    }
</style>

<body>
    <input att_url="{:U('approot/r/JS/ZCDGL/ZhuangchePrint.aspx?action=PrintZhuangCheYundan')}">
    <table cellspacing="0" align="center" style='width: 100%; text-align: center; border-collapse: collapse;'>
        <thead>
            <%
                if (type == 1)
                {
            %>
            <tr>
                <th colspan="6" align="left" id="carNum">车辆牌照:<%=dt.Rows[0]["carNum"].ToString() %></th>
                <th colspan="6" align="left" id="people">驾驶员:<%=dt.Rows[0]["people"].ToString() %></th>
                <th colspan="6" align="left" id="tel">联系电话:<%=dt.Rows[0]["tel"].ToString() %></th>
            </tr>
            <tr>
                <th colspan="6" align="left" id="qiandanDate">装车日期:<%=Convert.ToDateTime(dt.Rows[0]["qiandanDate"]).ToString("yyyy-MM-dd") %></th>
                <th colspan="6" style='font-weight: 600' align="left" id="zhuangchedanNum">合同号:<%=dt.Rows[0]["zhuangchedanNum"].ToString() %></th>
                <th colspan="6" style='font-weight: 600' align="left" id="jiaofuDate">发车时间:<%=Convert.ToDateTime(dt.Rows[0]["jiaofuDate"]).ToString("yyyy-MM-dd hh:mm:ss") %></th>
            </tr>
            <% 
                }
            %>
            <tr class='th'>
                <th>序号</th>
                <th>运单号</th>
                <th>发件人</th>
                <th>发件人电话</th>
                <th>收件人</th>
                <th>收件人电话</th>
                <th>货名</th>
                <th>包装</th>
                <th>数量</th>
                <th>重量</th>
                <th>体积</th>
                <th>收件人地址</th>
                <th>到付</th>
                <!-- <th>实际运费</th> -->
                <th>回单类型</th>
                <th>运输方式</th>
                <th>大车送</th>
                <!-- <th>分流费</th> -->
                <th>备注</th>
            </tr>
            <!--<th>到站</th><th>退款</th><th>预付</th><th>欠付</th>-->
        </thead>

        <%
            decimal zdf = 0m;
            for (int i = 0; i < lineDt.Rows.Count; i++)
            {
                System.Data.DataRow dr = lineDt.Rows[i];
                string xh = Convert.ToString(i + 1);
                string ydh = dr["yundanNum"] == DBNull.Value ? "" : dr["yundanNum"].ToString();
                string fjr = dr["fahuoPeople"] == DBNull.Value ? "" : dr["fahuoPeople"].ToString();
                string fjrtel = dr["fahuoTel"] == DBNull.Value ? "" : dr["fahuoTel"].ToString();
                string sjr = dr["shouhuoPeople"] == DBNull.Value ? "" : dr["shouhuoPeople"].ToString();
                string sjrtel = dr["shouhuoTel"] == DBNull.Value ? "" : dr["shouhuoTel"].ToString();
                string hm = dr["goodsName"] == DBNull.Value ? "" : dr["goodsName"].ToString();
                string bz = dr["pack"] == DBNull.Value ? "" : dr["pack"].ToString();
                string sl = dr["goodsAmount"] == DBNull.Value ? "" : dr["goodsAmount"].ToString();
                string zl = dr["goodsWeight"] == DBNull.Value ? "" : dr["goodsWeight"].ToString();
                string tj = dr["goodsVolume"] == DBNull.Value ? "" : dr["goodsVolume"].ToString();
                string sjrdz = dr["shouhuoAddress"] == DBNull.Value ? "" : dr["shouhuoAddress"].ToString();
                string df = dr["moneyDaofu"] == DBNull.Value ? "0.00" : Convert.ToDecimal(dr["moneyDaofu"].ToString()).ToString("N2");
                zdf += Convert.ToDecimal(df);
                string hdlx = dr["huidanTypeName"] == DBNull.Value ? "" : dr["huidanTypeName"].ToString();
                string ysfs = dr["songhuoTypeName"] == DBNull.Value ? "" : dr["songhuoTypeName"].ToString();
                string dcs = dr["isDacheName"] == DBNull.Value ? "" : dr["isDacheName"].ToString();
                string memo = dr["memo"] == DBNull.Value ? "" : dr["memo"].ToString();
        %>
        <tr class='th' style='height: 28px;'>
            <td width="2%"><%=xh%></td>
            <td width="9%"><%= ydh%></td>
            <td width="6%"><%= fjr%></td>
            <td width="8%"><%= fjrtel%></td>
            <td width="6%"><%= sjr%></td>
            <td width="8%"><%= sjrtel%></td>
            <td width="5%"><%= hm%></td>
            <td width="4%"><%= bz%></td>
            <td width="4%"><%= sl%></td>
            <td width="4%"><%= zl%></td>
            <td width="4%"><%= tj%></td>
            <td width="10%"><%= sjrdz%></td>
            <td width="6%"><%= df%></td>
            <td width="4%"><%= hdlx%></td>
            <td width="4%"><%= ysfs%></td>
            <td width="4%"><%= dcs%></td>
            <td width="12%"><%= memo%></td>
        </tr>
        <%
            }
        %>


        <tr class='th foot' style='height: 28px;'>
            <td colspan="12" align='right'>合计：</td>
            <!-- <td></td>
		<td></td>
		<td></td> 
		<td></td>-->
            <!-- <td>90</td>
		<td>1280</td>
		<td>11499</td> -->
            <td><%=zdf.ToString("N2") %></td>
            <!-- 		<td>19447</td>
		 -->
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <%
            if (type == 1)
            {
        %>
        <tr>
            <td colspan="14" align="right">
                <table width="100%" border="0" style='font-weight: 600'>
                    <tr>
                        <td>司机总运费为:</td>
                        <td><%=dt.Rows[0]["moneyTotal"].ToString() %></td>
                        <td>现付:</td>
                        <td><%=dt.Rows[0]["moneyYufu"].ToString() %></td>
                        <td>欠付:</td>
                        <td><%=dt.Rows[0]["moneyQianfu"].ToString() %></td>
                        <td>主货到付:</td>
                        <td><%=dt.Rows[0]["moneyZhuhuoDaofu"].ToString() %></td>
                        <td>点上付:</td>
                        <td><%=dt.Rows[0]["moneyDaofu"].ToString() %></td>
                        <td>押金:</td>
                        <td><%=dt.Rows[0]["moneyYajin"].ToString() %></td>
                        <td rowspan="3" colspan="2"></td>
                    </tr>
                    <tr>
                        <td colspan="6" align='left'>承运人签字:</td>
                        <td colspan="6" align='left'>托运人签字:</td>
                    </tr>
                    <tr>
                        <td colspan="6" align='left'>点上签字:</td>
                        <td colspan="6" align='left' style='font-size: 10px'>(如收到所有货物数量齐全,货物完好无损)</td>

                    </tr>
                </table>
            </td>
            <td colspan="3" align="right">
                <table cellspacing="0" width="100%" class='qt' style='font-weight: 600'>
                <th>
                    <td></td>
                </th>
            <tr>
                <td>总分流费：</td>
                <td width="50%"></td>
            </tr>
        <tr>
            <td>总配运费：</td>
            <td width="50%"></td>
        </tr>
        <tr>
            <td>最后结余：</td>
            <td width="50%"></td>
        </tr>
    </table>
    </td>
    </tr>
    <%
            }
    %>

    <tr>
        <td colspan="9" align="left" style='font-size: 13px; font-weight: 600;'>备注:外调车不送货</td>
        <td colspan="9" align="left" style='font-size: 13px;'>到达日期:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日</td>
    </tr>

    </table>
</body>
