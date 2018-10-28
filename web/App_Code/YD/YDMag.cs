using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SmartFramework4v2.Web.WebExecutor;
using System.Data;
using SmartFramework4v2.Data.SqlServer;
using System.Text;
using System.Data.SqlClient;
using SmartFramework4v2.Web.Common.JSON;
using SmartFramework4v2.Data;

/// <summary>
///JsMag 的摘要说明
/// </summary>
[CSClass("YDMag")]
public class YDMag
{
    [CSMethod("GetYDList")]
    public object GetYDList(int pagnum, int pagesize, string keyword)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;
                string where = "";
                if (!string.IsNullOrEmpty(keyword.Trim()))
                {
                    where += " and (" + dbc.C_Like("a.fahuoPeople", keyword.Trim(), LikeStyle.LeftAndRightLike)
                          + " or " + dbc.C_Like("b.officeName", keyword.Trim(), LikeStyle.LeftAndRightLike) + ")";
                }
                string str = @" select a.*,b.officeName  from yundan_yundan a 
                            left join jichu_office b on a.officeId=b.officeId where a.status=0 " + where
                           + " and yundan_id in (select distinct yundan_id from yundan_chaifen where status=0 and companyId='"+SystemUser.CurrentUser.CompanyID+"')  order by a.addtime desc";
                //开始取分页数据   
                System.Data.DataTable dtPage = new System.Data.DataTable();
                dtPage = dbc.GetPagedDataTable(str, pagesize, ref cp, out ac);

                return new { dt = dtPage, cp = cp, ac = ac };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }

    [CSMethod("GetYDByID")]
    public object GetYDByID(string ydid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = "select * from yundan_yundan where yundan_id=@yundan_id";
                SqlCommand cmd = new SqlCommand(str);
                cmd.Parameters.Add("@yundan_id", ydid);
                DataTable yddt = dbc.ExecuteDataTable(cmd);

                 DataTable hpdt =new DataTable();
                 if (yddt.Rows.Count > 0)
                 {
                     var yundanNum = yddt.Rows[0]["yundanNum"].ToString();
                     cmd.Parameters.Clear();
                     str = @"select * from yundan_goods where yundan_chaifen_id in 
                    (select yundan_chaifen_id from yundan_chaifen where status=0 and yundan_id=@yundan_id and yundan_chaifen_number=@yundan_chaifen_number ) and status=0 order by addtime desc";
                     cmd = new SqlCommand(str);
                     cmd.Parameters.Add("@yundan_id", ydid);
                     cmd.Parameters.Add("@yundan_chaifen_number", yundanNum);
                     hpdt = dbc.ExecuteDataTable(cmd);
                 }

                return new { yddt = yddt, hpdt = hpdt };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("GetGuid")]
    public string GetGuid() {
        return Guid.NewGuid().ToString(); 
    }

    [CSMethod("GetYDQSZ")]
    public DataTable GetYDQSZ()
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = @" select distinct c.officeId,c.officeName from jichu_xianlu2user a 
                                  left join jichu_xianlu b on a.traderId=b.traderId
                                  left join jichu_office c on b.fromOfficeId=c.officeId
                                  where a.userId='" + SystemUser.CurrentUser.UserID + "' and b.companyId='" + SystemUser.CurrentUser.CompanyID + @"'
                                  and b.status=0  and c.status=0";
                DataTable dt = dbc.ExecuteDataTable(str);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
    [CSMethod("GetYDZDZ")]
    public DataTable GetYDZDZ()
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = @" select distinct c.officeId,c.officeName from jichu_xianlu2user a 
                                  left join jichu_xianlu b on a.traderId=b.traderId
                                  left join jichu_office c on b.toOfficeId=c.officeId
                                  where a.userId='" + SystemUser.CurrentUser.UserID + "' and b.companyId='" + SystemUser.CurrentUser.CompanyID + @"'
                                  and b.status=0  and c.status=0";
                DataTable dt = dbc.ExecuteDataTable(str);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
       
        }
    }

    [CSMethod("GetZDR")]
    public string GetZDR()
    {
        return SystemUser.CurrentUser.UserName;
    }

    [CSMethod("GetYWYByQSZ")]
    public DataTable GetYWYByQSZ(string officeid)
    {
         using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = "  select employId,employName from jichu_employ where officeId=@officeId and status=0 order by employName";
                SqlCommand cmd = new SqlCommand(str);
                cmd.Parameters.Add("@officeId", officeid);
                DataTable dt = dbc.ExecuteDataTable(cmd);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
    }

    [CSMethod("GetKH")]
    public DataTable GetKH()
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = "  select clientId,people,tel,address from jichu_client where  status=0 and companyId='"+SystemUser.CurrentUser.CompanyID+"' order by people";
                SqlCommand cmd = new SqlCommand(str);
                DataTable dt = dbc.ExecuteDataTable(cmd);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
    }

    [CSMethod("GetDriver")]
    public DataTable GetDriver()
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = "  select driverId,people,tel,carNum from jichu_driver where  status=0 and companyId='" + SystemUser.CurrentUser.CompanyID + "'  order by people";
                SqlCommand cmd = new SqlCommand(str);
                DataTable dt = dbc.ExecuteDataTable(cmd);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
    }


    [CSMethod("GetZhongZhuan")]
    public DataTable GetZhongZhuan()
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = "  select zhongzhuanId,compName,people,tel from jichu_zhongzhuan where  status=0 and companyId='" + SystemUser.CurrentUser.CompanyID + "' order by people";
                SqlCommand cmd = new SqlCommand(str);
                DataTable dt = dbc.ExecuteDataTable(cmd);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
    }

    [CSMethod("GetKHCX")]
    public DataTable GetKHCX(string khmc, string khtel, string address)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string where = "";
                if (!string.IsNullOrEmpty(khmc))
                {
                    where += " and " + dbc.C_Like("people", khmc, LikeStyle.LeftAndRightLike);
                }
                if (!string.IsNullOrEmpty(khtel))
                {
                    where += " and " + dbc.C_Like("tel", khtel, LikeStyle.LeftAndRightLike);
                }
                if (!string.IsNullOrEmpty(address))
                {
                    where += " and " + dbc.C_Like("address", address, LikeStyle.LeftAndRightLike);
                }

                string str = "  select clientId,people,tel,address from jichu_client where  status=0 and companyId='" + SystemUser.CurrentUser.CompanyID + "' order by people";
                SqlCommand cmd = new SqlCommand(str);
                DataTable dt = dbc.ExecuteDataTable(cmd);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("CreateKH")]
    public string CreateKH(string khxm, string khtel, string khaddress, string officeId)
    {     
        var user = SystemUser.CurrentUser;
        string userid = user.UserID;
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                    //新增
                    string clientId = Guid.NewGuid().ToString();

                    DataTable dt = dbc.GetEmptyDataTable("jichu_client");
                    DataRow dr = dt.NewRow();
                    dr["clientId"] = new Guid(clientId);
                    dr["officeId"] = officeId;
                    //dr["peopleCode"] = jsr["peopleCode"];
                    dr["people"] = khxm;
                    dr["tel"] = khtel;
                    dr["address"] = khaddress;
                    //dr["compName"] = jsr["compName"];
                    dr["status"] = 0;
                    dr["addtime"] = DateTime.Now;
                    dr["adduser"] = userid;
                    dr["updatetime"] = DateTime.Now;
                    dr["updateuser"] = userid;
                    dr["companyId"] = SystemUser.CurrentUser.CompanyID;
                    dt.Rows.Add(dr);
                    dbc.InsertTable(dt);

                    dbc.CommitTransaction();
                    return clientId;
            }
            catch (Exception ex)
            {
                dbc.RoolbackTransaction();
                throw ex;
            }
        }
    }

    [CSMethod("SaveYD")]
    public object SaveYD(string ydid, JSReader jsr, JSReader[] hplist,string fahuoRen)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                if (string.IsNullOrEmpty(ydid))
                {
                    ydid = Guid.NewGuid().ToString();

                    //运单表
                    DataTable yddt = dbc.GetEmptyDataTable("yundan_yundan");
                   
                    DataRow yddr = yddt.NewRow();
                    yddr["yundan_id"] = ydid;
                    yddr["officeId"] = jsr["officeId"].ToString();
                    yddr["toOfficeId"] = jsr["toOfficeId"].ToString();
                    yddr["yundanNum"] = jsr["yundanNum"].ToString();
                    yddr["yundanDate"] = Convert.ToDateTime(jsr["yundanDate"].ToString());
                    yddr["realNum"] = jsr["realNum"].ToString();
                    yddr["memo"] = jsr["memo"].ToString();
                    yddr["fenhuoSite"] = jsr["fenhuoSite"].ToString();
                    yddr["traderName"] = jsr["traderName"].ToString();
                    yddr["zhidanRen"] = jsr["zhidanRen"].ToString();
                    yddr["toAddress"] = jsr["toAddress"].ToString();
                    yddr["shouhuoPeople"] = jsr["shouhuoPeople"].ToString();
                    yddr["shouhuoTel"] = jsr["shouhuoTel"].ToString();
                    yddr["shouhuoAddress"] = jsr["shouhuoAddress"].ToString();
                    yddr["songhuoType"] = Convert.ToInt32(jsr["songhuoType"].ToString());
                    yddr["payType"] = Convert.ToInt32(jsr["payType"].ToString());
                    if (jsr["moneyYunfei"] != null && jsr["moneyYunfei"].ToString() != "")
                    {
                        yddr["moneyYunfei"] = Convert.ToDecimal(jsr["moneyYunfei"].ToString());
                    }
                    else{ yddr["moneyYunfei"] = 0; }
                    if (jsr["moneyXianfu"] != null && jsr["moneyXianfu"].ToString() != "")
                    {
                        yddr["moneyXianfu"] = Convert.ToDecimal(jsr["moneyXianfu"].ToString());
                    }
                    else { yddr["moneyXianfu"] = 0; }
                    if (jsr["moneyDaofu"] != null && jsr["moneyDaofu"].ToString() != "")
                    {
                        yddr["moneyDaofu"] = Convert.ToDecimal(jsr["moneyDaofu"].ToString());
                    }
                    else { yddr["moneyDaofu"] = 0; }
                    if (jsr["moneyQianfu"] != null && jsr["moneyQianfu"].ToString() != "")
                    {
                        yddr["moneyQianfu"] = Convert.ToDecimal(jsr["moneyQianfu"].ToString());
                    }
                    else { yddr["moneyQianfu"] = 0; }
                    if (jsr["moneyHuidanfu"] != null && jsr["moneyHuidanfu"].ToString() != "")
                    {
                        yddr["moneyHuidanfu"] = Convert.ToDecimal(jsr["moneyHuidanfu"].ToString());
                    }
                    else { yddr["moneyHuidanfu"] = 0; }
                    if (jsr["moneyHuikouXianFan"] != null && jsr["moneyHuikouXianFan"].ToString() != "")
                    {
                        yddr["moneyHuikouXianFan"] = Convert.ToDecimal(jsr["moneyHuikouXianFan"].ToString());
                    }
                    else { yddr["moneyHuikouXianFan"] = 0; }
                    if (jsr["moneyHuikouQianFan"] != null && jsr["moneyHuikouQianFan"].ToString() != "")
                    {
                        yddr["moneyHuikouQianFan"] = Convert.ToDecimal(jsr["moneyHuikouQianFan"].ToString());
                    }
                    else { yddr["moneyHuikouQianFan"] = 0; }
                    if (jsr["moneyDaishou"] != null && jsr["moneyDaishou"].ToString() != "")
                    {
                        yddr["moneyDaishou"] = Convert.ToDecimal(jsr["moneyDaishou"].ToString());
                    }
                    else { yddr["moneyDaishou"] = 0; }
                    if (jsr["moneyDaishouShouxu"] != null && jsr["moneyDaishouShouxu"].ToString() != "")
                    {
                        yddr["moneyDaishouShouxu"] = Convert.ToDecimal(jsr["moneyDaishouShouxu"].ToString());
                    }
                    else { yddr["moneyDaishouShouxu"] = 0; }
                    yddr["huidanType"] = jsr["huidanType"].ToString();
                    if (jsr["cntHuidan"] != null && jsr["cntHuidan"].ToString() != "")
                    {
                        yddr["cntHuidan"] = Convert.ToInt32(jsr["cntHuidan"].ToString());
                    }
                    else { yddr["cntHuidan"] = 0; }
                    yddr["addtime"] = DateTime.Now;
                    yddr["status"] = 0;
                    yddr["adduser"] = SystemUser.CurrentUser.UserID;
                    yddr["clientId"] = jsr["fahuoPeople"].ToString();
                    yddr["fahuoPeople"] = fahuoRen;
                    yddr["fahuoTel"] = jsr["fahuoTel"].ToString();
                    yddr["faAddress"] = jsr["faAddress"].ToString();
                    yddt.Rows.Add(yddr);
                    dbc.InsertTable(yddt);
                    

                    //拆分表
                    string yundan_chaifen_id = Guid.NewGuid().ToString();
                    DataTable cfdt = dbc.GetEmptyDataTable("yundan_chaifen");
                    DataRow cfdr = cfdt.NewRow();
                    cfdr["yundan_chaifen_id"]=yundan_chaifen_id;
                    cfdr["yundan_id"]=ydid;
                    //cfdr["zhuangchedan_id"]
                    cfdr["chaifen_statue"] = 0;
                    cfdr["yundan_chaifen_number"] = jsr["yundanNum"].ToString();
                    cfdr["is_leaf"]=1;   //是否末级（0：否；1：是；）
                    cfdr["status"]=0;
                    cfdr["addtime"]=DateTime.Now;
                    cfdr["adduser"]=SystemUser.CurrentUser.UserID;
                    cfdr["isDache"] = 0;
                    cfdr["isZhuhuodaofu"] = 0;
                    cfdr["isPeiSong"] = 0;
                    cfdr["companyId"] = SystemUser.CurrentUser.CompanyID;
                    cfdt.Rows.Add(cfdr);
                    dbc.InsertTable(cfdt);

                    //货品表
                    DataTable hpdt = dbc.GetEmptyDataTable("yundan_goods");
                    if (hplist.Length > 0)
                    {
                        for (int i = 0; i < hplist.Length; i++) {
                            DataRow hpdr = hpdt.NewRow();
                            hpdr["yundan_goods_id"]=  hplist[i]["yundan_goods_id"].ToString();
                            hpdr["yundan_chaifen_id"] = yundan_chaifen_id;
                            hpdr["yundan_goodsName"] = hplist[i]["yundan_goodsName"].ToString();
                            hpdr["yundan_goodsPack"] = hplist[i]["yundan_goodsPack"].ToString();
                            if (hplist[i]["yundan_goodsAmount"] != null && hplist[i]["yundan_goodsAmount"].ToString() != "")
                            {
                                hpdr["yundan_goodsAmount"] = Convert.ToInt32(hplist[i]["yundan_goodsAmount"].ToString());
                            }
                            else { hpdr["yundan_goodsAmount"] = 0; }
                            if (hplist[i]["yundan_goodsWeight"] != null && hplist[i]["yundan_goodsWeight"].ToString() != "")
                            {
                                hpdr["yundan_goodsWeight"] = Convert.ToDecimal(hplist[i]["yundan_goodsWeight"].ToString());
                            }
                            if (hplist[i]["yundan_goodsVolume"] != null && hplist[i]["yundan_goodsVolume"].ToString() != "")
                            {
                                hpdr["yundan_goodsVolume"] =  Convert.ToDecimal(hplist[i]["yundan_goodsVolume"].ToString());
                            }
                            hpdr["status"] = 0;
			                hpdr["addtime"]= DateTime.Now;
                            hpdr["adduser"] = SystemUser.CurrentUser.UserID;
                            hpdt.Rows.Add(hpdr);
                        }
                    }
                    dbc.InsertTable(hpdt);


                }
                else
                { //编辑

                    //运单表
                    DataTable yddt = dbc.GetEmptyDataTable("yundan_yundan");
                    DataTableTracker yddtt = new DataTableTracker(yddt);
                    DataRow yddr = yddt.NewRow();
                    yddr["yundan_id"] = ydid;
                    yddr["officeId"] = jsr["officeId"].ToString();
                    yddr["toOfficeId"] = jsr["toOfficeId"].ToString();
                    yddr["yundanNum"] = jsr["yundanNum"].ToString();
                    yddr["yundanDate"] = Convert.ToDateTime(jsr["yundanDate"].ToString());
                    yddr["realNum"] = jsr["realNum"].ToString();
                    yddr["memo"] = jsr["memo"].ToString();
                    yddr["fenhuoSite"] = jsr["fenhuoSite"].ToString();
                    yddr["traderName"] = jsr["traderName"].ToString();
                    yddr["zhidanRen"] = jsr["zhidanRen"].ToString();
                    yddr["toAddress"] = jsr["toAddress"].ToString();
                    yddr["shouhuoPeople"] = jsr["shouhuoPeople"].ToString();
                    yddr["shouhuoTel"] = jsr["shouhuoTel"].ToString();
                    yddr["shouhuoAddress"] = jsr["shouhuoAddress"].ToString();
                    yddr["songhuoType"] = Convert.ToInt32(jsr["songhuoType"].ToString());
                    yddr["payType"] = Convert.ToInt32(jsr["payType"].ToString());
                    if (jsr["moneyYunfei"] != null && jsr["moneyYunfei"].ToString() != "")
                    {
                        yddr["moneyYunfei"] = Convert.ToDecimal(jsr["moneyYunfei"].ToString());
                    }
                    else { yddr["moneyYunfei"] = 0; }
                    if (jsr["moneyXianfu"] != null && jsr["moneyXianfu"].ToString() != "")
                    {
                        yddr["moneyXianfu"] = Convert.ToDecimal(jsr["moneyXianfu"].ToString());
                    }
                    else { yddr["moneyXianfu"] = 0; }
                    if (jsr["moneyDaofu"] != null && jsr["moneyDaofu"].ToString() != "")
                    {
                        yddr["moneyDaofu"] = Convert.ToDecimal(jsr["moneyDaofu"].ToString());
                    }
                    else { yddr["moneyDaofu"] = 0; }
                    if (jsr["moneyQianfu"] != null && jsr["moneyQianfu"].ToString() != "")
                    {
                        yddr["moneyQianfu"] = Convert.ToDecimal(jsr["moneyQianfu"].ToString());
                    }
                    else { yddr["moneyQianfu"] = 0; }
                    if (jsr["moneyHuidanfu"] != null && jsr["moneyHuidanfu"].ToString() != "")
                    {
                        yddr["moneyHuidanfu"] = Convert.ToDecimal(jsr["moneyHuidanfu"].ToString());
                    }
                    else { yddr["moneyHuidanfu"] = 0; }
                    if (jsr["moneyHuikouXianFan"] != null && jsr["moneyHuikouXianFan"].ToString() != "")
                    {
                        yddr["moneyHuikouXianFan"] = Convert.ToDecimal(jsr["moneyHuikouXianFan"].ToString());
                    }
                    else { yddr["moneyHuikouXianFan"] = 0; }
                    if (jsr["moneyHuikouQianFan"] != null && jsr["moneyHuikouQianFan"].ToString() != "")
                    {
                        yddr["moneyHuikouQianFan"] = Convert.ToDecimal(jsr["moneyHuikouQianFan"].ToString());
                    }
                    else { yddr["moneyHuikouQianFan"] = 0; }
                    if (jsr["moneyDaishou"] != null && jsr["moneyDaishou"].ToString() != "")
                    {
                        yddr["moneyDaishou"] = Convert.ToDecimal(jsr["moneyDaishou"].ToString());
                    }
                    else { yddr["moneyDaishou"] = 0; }
                    if (jsr["moneyDaishouShouxu"] != null && jsr["moneyDaishouShouxu"].ToString() != "")
                    {
                        yddr["moneyDaishouShouxu"] = Convert.ToDecimal(jsr["moneyDaishouShouxu"].ToString());
                    }
                    else { yddr["moneyDaishouShouxu"] = 0; }
                    yddr["huidanType"] = jsr["huidanType"].ToString();
                    if (jsr["cntHuidan"] != null && jsr["cntHuidan"].ToString() != "")
                    {
                        yddr["cntHuidan"] = Convert.ToInt32(jsr["cntHuidan"].ToString());
                    }
                    else { yddr["cntHuidan"] = 0; }
                   
                    yddr["clientId"] = jsr["fahuoPeople"].ToString();
                    yddr["fahuoPeople"] = fahuoRen;
                    yddr["fahuoTel"] = jsr["fahuoTel"].ToString();
                    yddr["faAddress"] = jsr["faAddress"].ToString();
                    yddt.Rows.Add(yddr);
                    dbc.UpdateTable(yddt, yddtt);

                    string str = "select * from yundan_chaifen where status=0 and yundan_id=@yundan_id order by chaifen_statue asc";
                    SqlCommand cmd = new SqlCommand(str);
                    cmd.Parameters.Add("@yundan_id", ydid); ;
                    DataTable cfdt = dbc.ExecuteDataTable(cmd);

                    string yundan_chaifen_id = Guid.NewGuid().ToString();
                    if (cfdt.Rows.Count > 0)
                    {
                        yundan_chaifen_id = cfdt.Rows[0]["yundan_chaifen_id"].ToString();
                    }

                    //货品表
                    DataTable hpdt = dbc.GetEmptyDataTable("yundan_goods");
                    if (hplist.Length > 0)
                    {
                        for (int i = 0; i < hplist.Length; i++)
                        {
                            DataRow hpdr = hpdt.NewRow();
                            hpdr["yundan_goods_id"] = hplist[i]["yundan_goods_id"].ToString();
                            if (hplist[i]["yundan_chaifen_id"] != null && hplist[i]["yundan_chaifen_id"].ToString() != "")
                            {
                                hpdr["yundan_chaifen_id"] = hplist[i]["yundan_chaifen_id"].ToString();
                            }
                            else
                            {
                                hpdr["yundan_chaifen_id"] = yundan_chaifen_id;
                            }
                            if (hplist[i]["yundan_goodsName"] != null && hplist[i]["yundan_goodsName"].ToString() != "")
                            {
                                hpdr["yundan_goodsName"] = hplist[i]["yundan_goodsName"].ToString();
                            }
                            if (hplist[i]["yundan_goodsPack"] != null && hplist[i]["yundan_goodsPack"].ToString() != "")
                            {
                                hpdr["yundan_goodsPack"] = hplist[i]["yundan_goodsPack"].ToString();
                            }
                            if (hplist[i]["yundan_goodsAmount"] != null && hplist[i]["yundan_goodsAmount"].ToString() != "")
                            {
                                hpdr["yundan_goodsAmount"] = Convert.ToInt32(hplist[i]["yundan_goodsAmount"].ToString());
                            }
                            else { hpdr["yundan_goodsAmount"] = 0; }
                            if (hplist[i]["yundan_goodsWeight"] != null && hplist[i]["yundan_goodsWeight"].ToString() != "")
                            {
                                hpdr["yundan_goodsWeight"] = Convert.ToDecimal(hplist[i]["yundan_goodsWeight"].ToString());
                            }
                            if (hplist[i]["yundan_goodsVolume"] != null && hplist[i]["yundan_goodsVolume"].ToString() != "")
                            {
                                hpdr["yundan_goodsVolume"] = Convert.ToDecimal(hplist[i]["yundan_goodsVolume"].ToString());
                            }
                            if (hplist[i]["status"] != null && hplist[i]["status"].ToString() != "")
                            {
                                hpdr["status"] =Convert.ToInt32(hplist[i]["status"].ToString());
                            }
                            else
                            {
                                hpdr["status"] = 0;
                            }

                            if (hplist[i]["addtime"] != null && hplist[i]["addtime"].ToString() != "")
                            {
                                hpdr["addtime"] = Convert.ToDateTime(hplist[i]["addtime"].ToString());
                            }
                            else
                            {
                                hpdr["addtime"] = DateTime.Now;
                            }

                            if (hplist[i]["adduser"] != null && hplist[i]["adduser"].ToString() != "")
                            {
                                hpdr["adduser"] = hplist[i]["adduser"].ToString();
                            }
                            else
                            {
                                hpdr["adduser"] = SystemUser.CurrentUser.UserID;
                            }
                            hpdt.Rows.Add(hpdr);
                        }
                    }
                    dbc.InsertOrUpdateTable(hpdt);
                }



                dbc.CommitTransaction();
                return true;
            }
            catch (Exception ex)
            {
                dbc.RoolbackTransaction();
                throw ex;
            }
        }
    }

    [CSMethod("SaveHD")]
    public object SaveHD(string ydid, JSReader jsr)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                DataTable yddt = dbc.GetEmptyDataTable("yundan_yundan");
                DataTableTracker yddtt = new DataTableTracker(yddt);
                DataRow yddr = yddt.NewRow();
                 yddr["yundan_id"]=ydid;
                if(jsr["isSign"]!=null&&jsr["isSign"].ToString()!=""){ 
                   yddr["isSign"]= Convert.ToInt32(jsr["isSign"].ToString());
                }
                if(jsr["bschuidanDate"]!=null&&jsr["bschuidanDate"].ToString()!=""){ 
                   yddr["bschuidanDate"]=Convert.ToDateTime(jsr["bschuidanDate"].ToString());
                }
                if(jsr["huidanDate"]!=null&&jsr["huidanDate"].ToString()!=""){ 
                   yddr["huidanDate"]=Convert.ToDateTime(jsr["huidanDate"].ToString());
                }
                if(jsr["huidanBack"]!=null&&jsr["huidanBack"].ToString()!=""){ 
                   yddr["huidanBack"]=Convert.ToDateTime(jsr["huidanBack"].ToString());
                }
                yddt.Rows.Add(yddr);
                dbc.UpdateTable(yddt, yddtt);
                dbc.CommitTransaction();
                return true;
            }
            catch (Exception ex)
            {
                dbc.RoolbackTransaction();
                throw ex;
            }
        }
    }

    [CSMethod("GetHDByID")]
    public object GetHDByID(string ydid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = "select * from yundan_yundan where yundan_id=@yundan_id";
                SqlCommand cmd = new SqlCommand(str);
                cmd.Parameters.Add("@yundan_id", ydid);
                DataTable hddt = dbc.ExecuteDataTable(cmd);

                return hddt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
    #region 短驳费
    [CSMethod("GetDBFList")]
    public object GetDBFList(int pagnum, int pagesize, string ydid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;

                string str = @" select a.*,b.people,b.tel,b.carNum from caiwu_expense a left join jichu_driver b 
                                  on a.driverId=b.driverId
                                   where a.kind=5 and a.yundanId=" +dbc.ToSqlValue(ydid)+" order by a.addtime desc";
               
                //开始取分页数据
                System.Data.DataTable dtPage = new System.Data.DataTable();
                dtPage = dbc.GetPagedDataTable(str, pagesize, ref cp, out ac);

                return new { dt = dtPage, cp = cp, ac = ac };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }

    [CSMethod("SaveDBF")]
    public object SaveDBF(JSReader jsr,string ydid,string officeId,string clientId)
    {
        var user = SystemUser.CurrentUser;
        string userid = user.UserID;
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {

                if (jsr["id"].ToString() == "")
                {
                    //新增
                    string id = Guid.NewGuid().ToString();

                    DataTable dt = dbc.GetEmptyDataTable("caiwu_expense");
                    DataRow dr = dt.NewRow();
                    dr["id"]   = new Guid(id);
			        dr["isLock"]=0;
			        dr["kind"]=5;
			        dr["officeId"] = officeId;
			        //dr["expenseCode"]
                    if (jsr["actionDate"] != null && jsr["actionDate"].ToString() != "")
                    {
                        dr["expenseDate"] = Convert.ToDateTime(jsr["actionDate"].ToString());
                    }else{
                        dr["expenseDate"]=DateTime.Now;
                    }
			        dr["expenseWay"]="现金";
			        //dr["itemId"]
			        dr["yundanId"] =ydid;
			        dr["clientId"]=clientId;
			        //dr["zhuangchedanId"]
			        dr["driverId"] =jsr["driverId"].ToString();
			        //dr["zhongzhuanId"]
			        //dr["bank"]
                     if(jsr["money"]!=null&&jsr["money"].ToString()!=""){
			        dr["money"] = Convert.ToDecimal(jsr["money"].ToString());
                     }
			        dr["memo"] =  jsr["memo"].ToString();
			        dr["adduser"]=SystemUser.CurrentUser.UserID;
                    dr["addtime"] = DateTime.Now;
                    dt.Rows.Add(dr);
                    dbc.InsertTable(dt);
                }
                else
                {
                    //修改
                    string id = jsr["id"].ToString();
                    DataTable dt = dbc.GetEmptyDataTable("caiwu_expense");
                    DataTableTracker dtt = new DataTableTracker(dt);
                    DataRow dr = dt.NewRow();
                    dr["id"] = new Guid(id);
                    if (jsr["actionDate"] != null && jsr["actionDate"].ToString() != "")
                    {
                        dr["expenseDate"] = Convert.ToDateTime(jsr["actionDate"].ToString());
                    }
                    dr["clientId"] = clientId;
                    dr["driverId"] = jsr["driverId"].ToString();
                    dr["officeId"] = officeId;
                    if (jsr["money"] != null && jsr["money"].ToString() != "")
                    {
                        dr["money"] = Convert.ToDecimal(jsr["money"].ToString());
                    }
                    dr["memo"] = jsr["memo"].ToString();
                    dt.Rows.Add(dr);
                    dbc.UpdateTable(dt, dtt);
                }
                dbc.CommitTransaction();
                return true;
            }
            catch (Exception ex)
            {
                dbc.RoolbackTransaction();
                throw ex;
            }
        }
    }

    [CSMethod("GetDBFById")]
    public object GetDBFById(string id)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = @" select a.*,b.people,b.tel,b.carNum from caiwu_expense a left join jichu_driver b 
                                  on a.driverId=b.driverId
                                   where a.id=" + dbc.ToSqlValue(id);

                DataTable dt = dbc.ExecuteDataTable(str);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("DeleteDBFById")]
    public object DeleteDBFById(string id)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                string str = "delete from caiwu_expense where id=" + dbc.ToSqlValue(id);
                dbc.ExecuteNonQuery(str);
                dbc.CommitTransaction();
                return true;
            }
            catch (Exception ex)
            {
                dbc.RoolbackTransaction();
                throw ex;
            }
        }
    }

    #endregion 

    #region  分流
    [CSMethod("PDZC")]
    public object PDZC(string ydid,string ydnum)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try{
                var zhuangchedan_id = "";
                string str = "select * from yundan_chaifen where status=0 and yundan_id=" + dbc.ToSqlValue(ydid) + " and yundan_chaifen_number=" + dbc.ToSqlValue(ydnum);
                DataTable dt = dbc.ExecuteDataTable(str);
                if (Convert.ToInt32(dt.Rows[0]["chaifen_statue"]) == 0)
                {
                    if (dt.Rows[0]["zhuangchedan_id"] != null && dt.Rows[0]["zhuangchedan_id"].ToString() != "")
                    {
                        zhuangchedan_id = dt.Rows[0]["zhuangchedan_id"].ToString();
                    }
                }
                else
                {
                    str = "select * from yundan_chaifen where status=0 and zhuangchedan_id is null and yundan_id=" + dbc.ToSqlValue(ydid) + " and yundan_chaifen_number<>" + dbc.ToSqlValue(ydnum);
                    DataTable zcdt = dbc.ExecuteDataTable(str);

                    if (zcdt.Rows.Count == 0)
                    {

                        str = "select * from yundan_chaifen where status=0 and yundan_id=" + dbc.ToSqlValue(ydid) + " and yundan_chaifen_number<>" + dbc.ToSqlValue(ydnum) + " order by yundan_chaifen_number";
                        DataTable dt1 = dbc.ExecuteDataTable(str);

                        zhuangchedan_id = dt1.Rows[0]["zhuangchedan_id"].ToString();
                    }
                }

                return zhuangchedan_id;


            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("GetSHFList")]
    public object GetSHFList(int pagnum, int pagesize, string ydid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;

                string str = @" select a.*,b.people,b.tel,b.carNum from caiwu_expense a left join jichu_driver b 
                                  on a.driverId=b.driverId
                                   where a.kind=6 and a.yundanId=" + dbc.ToSqlValue(ydid) + " order by a.addtime desc";

                //开始取分页数据
                System.Data.DataTable dtPage = new System.Data.DataTable();
                dtPage = dbc.GetPagedDataTable(str, pagesize, ref cp, out ac);

                return new { dt = dtPage, cp = cp, ac = ac };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }

    [CSMethod("SaveSHF")]
    public object SaveSHF(JSReader jsr, string ydid, string officeId, string clientId, string zhuangchedanId)
    {
        var user = SystemUser.CurrentUser;
        string userid = user.UserID;
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {

                if (jsr["id"].ToString() == "")
                {
                    //新增
                    string id = Guid.NewGuid().ToString();

                    DataTable dt = dbc.GetEmptyDataTable("caiwu_expense");
                    DataRow dr = dt.NewRow();
                    dr["id"] = new Guid(id);
                    dr["isLock"] = 0;
                    dr["kind"] = 6;
                    dr["officeId"] = officeId;
                    //dr["expenseCode"]
                    if (jsr["expenseDate"] != null && jsr["expenseDate"].ToString() != "")
                    {
                        dr["expenseDate"] = Convert.ToDateTime(jsr["expenseDate"].ToString());
                    }
                    else
                    {
                        dr["expenseDate"] = DateTime.Now;
                    }
                    dr["expenseWay"] = "现金";
                    //dr["itemId"]
                    dr["yundanId"] = ydid;
                    dr["clientId"] = clientId;
                    dr["zhuangchedanId"] = zhuangchedanId;
                    dr["driverId"] = jsr["driverId"].ToString();
                    //dr["zhongzhuanId"]
                    //dr["bank"]
                    if (jsr["money"] != null && jsr["money"].ToString() != "")
                    {
                        dr["money"] = Convert.ToDecimal(jsr["money"].ToString());
                    }
                    dr["memo"] = jsr["memo"].ToString();
                    dr["adduser"] = SystemUser.CurrentUser.UserID;
                    dr["addtime"] = DateTime.Now;
                    dt.Rows.Add(dr);
                    dbc.InsertTable(dt);
                }
                else
                {
                    //修改
                    string id = jsr["id"].ToString();
                    DataTable dt = dbc.GetEmptyDataTable("caiwu_expense");
                    DataTableTracker dtt = new DataTableTracker(dt);
                    DataRow dr = dt.NewRow();
                    dr["id"] = new Guid(id);
                    if (jsr["expenseDate"] != null && jsr["expenseDate"].ToString() != "")
                    {
                        dr["expenseDate"] = Convert.ToDateTime(jsr["expenseDate"].ToString());
                    }
                    dr["clientId"] = clientId;
                    dr["driverId"] = jsr["driverId"].ToString();
                    dr["officeId"] = officeId;
                    if (jsr["money"] != null && jsr["money"].ToString() != "")
                    {
                        dr["money"] = Convert.ToDecimal(jsr["money"].ToString());
                    }
                    dr["memo"] = jsr["memo"].ToString();
                    dt.Rows.Add(dr);
                    dbc.UpdateTable(dt, dtt);
                }
                dbc.CommitTransaction();
                return true;
            }
            catch (Exception ex)
            {
                dbc.RoolbackTransaction();
                throw ex;
            }
        }
    }

    [CSMethod("GetZZFList")]
    public object GetZZFList(int pagnum, int pagesize, string ydid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;

                string str = @" select a.*,b.people,b.tel,b.compName from caiwu_expense a left join jichu_zhongzhuan b 
                                  on a.zhongzhuanId=b.zhongzhuanId
                                   where a.kind=7 and a.yundanId=" + dbc.ToSqlValue(ydid) + " order by a.addtime desc";

                //开始取分页数据
                System.Data.DataTable dtPage = new System.Data.DataTable();
                dtPage = dbc.GetPagedDataTable(str, pagesize, ref cp, out ac);

                return new { dt = dtPage, cp = cp, ac = ac };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }


    [CSMethod("SaveZZF")]
    public object SaveZZF(JSReader jsr, string ydid, string officeId, string clientId, string zhuangchedanId)
    {
        var user = SystemUser.CurrentUser;
        string userid = user.UserID;
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {

                if (jsr["id"].ToString() == "")
                {
                    //新增
                    string id = Guid.NewGuid().ToString();

                    DataTable dt = dbc.GetEmptyDataTable("caiwu_expense");
                    DataRow dr = dt.NewRow();
                    dr["id"] = new Guid(id);
                    dr["isLock"] = 0;
                    dr["kind"] = 7;
                    dr["officeId"] = officeId;
                    //dr["expenseCode"]
                    if (jsr["expenseDate"] != null && jsr["expenseDate"].ToString() != "")
                    {
                        dr["expenseDate"] = Convert.ToDateTime(jsr["expenseDate"].ToString());
                    }
                    else
                    {
                        dr["expenseDate"] = DateTime.Now;
                    }
                    dr["expenseWay"] = "现金";
                    //dr["itemId"]
                    dr["yundanId"] = ydid;
                    dr["clientId"] = clientId;
                    dr["zhuangchedanId"] = zhuangchedanId;
                    //dr["driverId"]
                    dr["zhongzhuanId"] = jsr["zhongzhuanId"].ToString();
                    //dr["bank"]
                    if (jsr["money"] != null && jsr["money"].ToString() != "")
                    {
                        dr["money"] = Convert.ToDecimal(jsr["money"].ToString());
                    }
                    dr["memo"] = jsr["memo"].ToString();
                    dr["adduser"] = SystemUser.CurrentUser.UserID;
                    dr["addtime"] = DateTime.Now;
                    dt.Rows.Add(dr);
                    dbc.InsertTable(dt);
                }
                else
                {
                    //修改
                    string id = jsr["id"].ToString();
                    DataTable dt = dbc.GetEmptyDataTable("caiwu_expense");
                    DataTableTracker dtt = new DataTableTracker(dt);
                    DataRow dr = dt.NewRow();
                    dr["id"] = new Guid(id);
                    if (jsr["expenseDate"] != null && jsr["expenseDate"].ToString() != "")
                    {
                        dr["expenseDate"] = Convert.ToDateTime(jsr["expenseDate"].ToString());
                    }
                    dr["clientId"] = clientId;
                    dr["zhongzhuanId"] = jsr["zhongzhuanId"].ToString();
                    dr["officeId"] = officeId;
                    if (jsr["money"] != null && jsr["money"].ToString() != "")
                    {
                        dr["money"] = Convert.ToDecimal(jsr["money"].ToString());
                    }
                    dr["memo"] = jsr["memo"].ToString();
                    dt.Rows.Add(dr);
                    dbc.UpdateTable(dt, dtt);
                }
                dbc.CommitTransaction();
                return true;
            }
            catch (Exception ex)
            {
                dbc.RoolbackTransaction();
                throw ex;
            }
        }
    }

    [CSMethod("GetZZFById")]
    public object GetZZFById(string id)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = @" select a.*,b.people,b.tel,b.compName from caiwu_expense a left join jichu_zhongzhuan b 
                                  on a.zhongzhuanId=b.zhongzhuanId
                                   where a.id=" + dbc.ToSqlValue(id);

                DataTable dt = dbc.ExecuteDataTable(str);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
    #endregion 

    #region  拆分运单
    [CSMethod("GetYDNum")]
    public object GetYDNum(string ydid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string oldyundanNum = "";
                string newyundanNum = "";
                string str = " select yundanNum from yundan_yundan where yundan_id=" + dbc.ToSqlValue(ydid);
                DataTable yddt = dbc.ExecuteDataTable(str);

                if (yddt.Rows.Count > 0)
                {
                    oldyundanNum = yddt.Rows[0]["yundanNum"].ToString();

                    str = "select * from yundan_chaifen where status=0 and  yundan_id=" + dbc.ToSqlValue(ydid) + " and yundan_chaifen_number='" + oldyundanNum + "'";
                    DataTable cfdt = dbc.ExecuteDataTable(str);

                    //未拆
                    if (Convert.ToInt32(cfdt.Rows[0]["chaifen_statue"].ToString()) == 0)
                    {
                        newyundanNum= oldyundanNum+"_2";
                    }
                    else
                    {
                       //已拆
                        str = "select yundan_chaifen_number from yundan_chaifen where status=0 and  yundan_id=" + dbc.ToSqlValue(ydid) + " order by yundan_chaifen_number desc";
                        DataTable cfdt2 = dbc.ExecuteDataTable(str);

                        if(cfdt2.Rows.Count>0){
                            string[] ary = cfdt2.Rows[0][0].ToString().Split('_');
                            int temp = Convert.ToInt32(ary[ary.Length-1]);
                            newyundanNum=oldyundanNum+"_"+(temp+1);
                        }
                    }
                }
                else
                {
                    throw new Exception("该运单无效！");
                }

                return new { oldyundanNum = oldyundanNum, newyundanNum = newyundanNum };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }


    [CSMethod("GetHPByYD2")]
    public DataTable GetHPByYD2(string ydid, string ydnum)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = "select * from yundan_chaifen where status=0 and  yundan_id=" + dbc.ToSqlValue(ydid) + " and yundan_chaifen_number='" + ydnum + "'";
                DataTable cfdt = dbc.ExecuteDataTable(str);
                //未拆
                if (Convert.ToInt32(cfdt.Rows[0]["chaifen_statue"].ToString()) == 0)
                {
                    ydnum = ydnum;
                }
                else
                {
                    ydnum = ydnum + "_1";
                }

                str = @"select * from yundan_goods where yundan_chaifen_id in 
                (select yundan_chaifen_id from yundan_chaifen where status=0 and yundan_id=@yundan_id and yundan_chaifen_number=@yundan_chaifen_number ) and status=0 order by addtime desc";
                SqlCommand cmd = new SqlCommand(str);
                cmd.Parameters.Add("@yundan_id", ydid);
                cmd.Parameters.Add("@yundan_chaifen_number", ydnum);
                DataTable dt = dbc.ExecuteDataTable(cmd);

                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }


    public DataTable GetHPByYD(string ydid, string ydnum)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = @"select * from yundan_goods where yundan_chaifen_id in 
                (select yundan_chaifen_id from yundan_chaifen where status=0 and yundan_id=@yundan_id and yundan_chaifen_number=@yundan_chaifen_number ) and status=0 order by addtime desc";
                SqlCommand cmd = new SqlCommand(str);
                cmd.Parameters.Add("@yundan_id", ydid);
                cmd.Parameters.Add("@yundan_chaifen_number", ydnum);
                DataTable dt = dbc.ExecuteDataTable(cmd);

                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("SaveCF")]
    public object SaveCF(string ydid, string oldyundanNum, string newyundanNum, JSReader[] hplist)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                dbc.BeginTransaction();

                string str = "select * from yundan_chaifen where status=0 and  yundan_id=" + dbc.ToSqlValue(ydid) + " and yundan_chaifen_number='" + oldyundanNum + "'";
                DataTable cfdt = dbc.ExecuteDataTable(str);
                //未拆
                if (Convert.ToInt32(cfdt.Rows[0]["chaifen_statue"].ToString()) == 0)
                {
                    DataTable kcdt = GetHPByYD(ydid, oldyundanNum);

                    #region 剩余
                    DataTable sydt = dbc.GetEmptyDataTable("yundan_goods");

                    for (int i = 0; i < kcdt.Rows.Count; i++)
                    {
                        int n = 1;
                        for (int j = 0; j < hplist.Length; j++) {
                            if (kcdt.Rows[i]["yundan_goods_id"].ToString() == hplist[j]["yundan_goods_id"].ToString())
                            {
                                DataRow dr = sydt.NewRow();
                                dr["yundan_goods_id"] = hplist[j]["yundan_goods_id"].ToString();
                                dr["yundan_chaifen_id"] = hplist[j]["yundan_chaifen_id"].ToString();
                                dr["yundan_goodsName"] = hplist[j]["yundan_goodsName"].ToString();
                                dr["yundan_goodsPack"] = hplist[j]["yundan_goodsPack"].ToString();
                                dr["yundan_goodsAmount"] = Convert.ToInt32(kcdt.Rows[i]["yundan_goodsAmount"]) - Convert.ToInt32(hplist[j]["yundan_goodsAmount"].ToString());
                                if (hplist[j]["yundan_goodsWeight"] != null && hplist[j]["yundan_goodsWeight"].ToString() != "")
                                {
                                    dr["yundan_goodsWeight"] = Convert.ToDecimal(hplist[j]["yundan_goodsWeight"].ToString());
                                }
                                if (hplist[j]["yundan_goodsVolume"] != null && hplist[j]["yundan_goodsVolume"].ToString() != "")
                                {
                                    dr["yundan_goodsVolume"] = Convert.ToDecimal(hplist[j]["yundan_goodsVolume"].ToString());
                                }
                                dr["status"] = hplist[j]["status"].ToString();
                                dr["addtime"] = hplist[j]["addtime"].ToString();
                                dr["adduser"] = hplist[j]["adduser"].ToString();
                                sydt.Rows.Add(dr);
                                n--;
                            }
                        }
                        if (n > 0) {
                            DataRow dr = sydt.NewRow();
                            dr["yundan_goods_id"] = Guid.NewGuid().ToString();
                            dr["yundan_chaifen_id"] = kcdt.Rows[i]["yundan_chaifen_id"];
                            dr["yundan_goodsName"] = kcdt.Rows[i]["yundan_goodsName"];
                            dr["yundan_goodsPack"] = kcdt.Rows[i]["yundan_goodsPack"];
                            dr["yundan_goodsAmount"] = kcdt.Rows[i]["yundan_goodsAmount"];
                            if (kcdt.Rows[i]["yundan_goodsWeight"] != null && kcdt.Rows[i]["yundan_goodsWeight"].ToString() != "")
                            {
                                dr["yundan_goodsWeight"] = Convert.ToDecimal(kcdt.Rows[i]["yundan_goodsWeight"]);
                            }
                            if (kcdt.Rows[i]["yundan_goodsVolume"] != null && kcdt.Rows[i]["yundan_goodsVolume"].ToString() != "")
                            {
                                dr["yundan_goodsVolume"] = Convert.ToDecimal(kcdt.Rows[i]["yundan_goodsVolume"]);
                            }
                            dr["status"] = kcdt.Rows[i]["status"];
                            dr["addtime"] = kcdt.Rows[i]["addtime"];
                            dr["adduser"] = kcdt.Rows[i]["adduser"];
                            sydt.Rows.Add(dr);
                        }
                    }
                   
                    //拆分表
                    string sy_yundan_chaifen_id = Guid.NewGuid().ToString();
                    DataTable sy_cfdt = dbc.GetEmptyDataTable("yundan_chaifen");
                    DataRow sy_cfdr = sy_cfdt.NewRow();
                    sy_cfdr["yundan_chaifen_id"] = sy_yundan_chaifen_id;
                    sy_cfdr["yundan_id"] = ydid;
                    //cfdr["zhuangchedan_id"]
                    sy_cfdr["chaifen_statue"] = 0;
                    sy_cfdr["yundan_chaifen_number"] = oldyundanNum+"_1";
                    sy_cfdr["is_leaf"] = 1;   //是否末级（0：否；1：是；）
                    sy_cfdr["status"] = 0;
                    sy_cfdr["addtime"] = DateTime.Now;
                    sy_cfdr["adduser"] = SystemUser.CurrentUser.UserID;
                    sy_cfdr["isDache"] = 0;
                    sy_cfdr["isZhuhuodaofu"] = 0;
                    sy_cfdr["isPeiSong"] = 0;
                    sy_cfdr["companyId"] = SystemUser.CurrentUser.CompanyID;
                    sy_cfdt.Rows.Add(sy_cfdr);
                    dbc.InsertTable(sy_cfdt);

                    //货品表
                    DataTable sy_hpdt = dbc.GetEmptyDataTable("yundan_goods");
                    for (int i = 0; i < sydt.Rows.Count; i++)
                    {
                        if (Convert.ToInt32(sydt.Rows[i]["yundan_goodsAmount"]) > 0)
                        {
                            DataRow sy_hpdr = sy_hpdt.NewRow();
                            sy_hpdr["yundan_goods_id"] = Guid.NewGuid().ToString();
                            sy_hpdr["yundan_chaifen_id"] = sy_yundan_chaifen_id;
                            sy_hpdr["yundan_goodsName"] = sydt.Rows[i]["yundan_goodsName"].ToString();
                            sy_hpdr["yundan_goodsPack"] = sydt.Rows[i]["yundan_goodsPack"].ToString();
                            sy_hpdr["yundan_goodsAmount"] = sydt.Rows[i]["yundan_goodsAmount"].ToString();
                            if (sydt.Rows[i]["yundan_goodsWeight"] != null && sydt.Rows[i]["yundan_goodsWeight"].ToString() != "")
                            {
                                sy_hpdr["yundan_goodsWeight"] = Convert.ToDecimal(sydt.Rows[i]["yundan_goodsWeight"].ToString());
                            }
                            if (sydt.Rows[i]["yundan_goodsVolume"] != null && sydt.Rows[i]["yundan_goodsVolume"].ToString() != "")
                            {
                                sy_hpdr["yundan_goodsVolume"] = Convert.ToDecimal(sydt.Rows[i]["yundan_goodsVolume"].ToString());
                            }
                            sy_hpdr["status"] = 0;
                            sy_hpdr["addtime"] = DateTime.Now;
                            sy_hpdr["adduser"] = SystemUser.CurrentUser.UserID;
                            sy_hpdt.Rows.Add(sy_hpdr);
                        }
                    }
                    dbc.InsertTable(sy_hpdt);
                    #endregion 

                    #region 拆分
                    string cf_yundan_chaifen_id = Guid.NewGuid().ToString();
                    DataTable cf_cfdt = dbc.GetEmptyDataTable("yundan_chaifen");
                    DataRow cf_cfdr = cf_cfdt.NewRow();
                    cf_cfdr["yundan_chaifen_id"] = cf_yundan_chaifen_id;
                    cf_cfdr["yundan_id"] = ydid;
                    //cfdr["zhuangchedan_id"]
                    cf_cfdr["chaifen_statue"] = 0;
                    cf_cfdr["yundan_chaifen_number"] = newyundanNum;
                    cf_cfdr["is_leaf"] = 1;   //是否末级（0：否；1：是；）
                    cf_cfdr["status"] = 0;
                    cf_cfdr["addtime"] = DateTime.Now;
                    cf_cfdr["adduser"] = SystemUser.CurrentUser.UserID;
                    cf_cfdr["isDache"] = 0;
                    cf_cfdr["isZhuhuodaofu"] = 0;
                    cf_cfdr["isPeiSong"] = 0;
                    cf_cfdr["companyId"] = SystemUser.CurrentUser.CompanyID;
                    cf_cfdt.Rows.Add(cf_cfdr);
                    dbc.InsertTable(cf_cfdt);

                    //货品表
                    DataTable cf_hpdt = dbc.GetEmptyDataTable("yundan_goods");
                    if (hplist.Length > 0)
                    {
                        for (int i = 0; i < hplist.Length; i++)
                        {
                            DataRow cf_hpdr = cf_hpdt.NewRow();
                            cf_hpdr["yundan_goods_id"] = Guid.NewGuid().ToString();
                            cf_hpdr["yundan_chaifen_id"] = cf_yundan_chaifen_id;
                            cf_hpdr["yundan_goodsName"] = hplist[i]["yundan_goodsName"].ToString();
                            cf_hpdr["yundan_goodsPack"] = hplist[i]["yundan_goodsPack"].ToString();
                            if (hplist[i]["yundan_goodsAmount"] != null && hplist[i]["yundan_goodsAmount"].ToString() != "")
                            {
                                cf_hpdr["yundan_goodsAmount"] = Convert.ToInt32(hplist[i]["yundan_goodsAmount"].ToString());
                            }
                            else { cf_hpdr["yundan_goodsAmount"] = 0; }
                            if (hplist[i]["yundan_goodsWeight"] != null && hplist[i]["yundan_goodsWeight"].ToString() != "")
                            {
                                cf_hpdr["yundan_goodsWeight"] = Convert.ToDecimal(hplist[i]["yundan_goodsWeight"].ToString());
                            }
                            if (hplist[i]["yundan_goodsVolume"] != null && hplist[i]["yundan_goodsVolume"].ToString() != "")
                            {
                                cf_hpdr["yundan_goodsVolume"] = Convert.ToDecimal(hplist[i]["yundan_goodsVolume"].ToString());
                            }
                            cf_hpdr["status"] = 0;
                            cf_hpdr["addtime"] = DateTime.Now;
                            cf_hpdr["adduser"] = SystemUser.CurrentUser.UserID;
                            cf_hpdt.Rows.Add(cf_hpdr);
                        }
                    }
                    dbc.InsertTable(cf_hpdt);

                    #endregion 

                    #region 更新主记录
                    //拆分表
                    DataTable zcfdt = dbc.GetEmptyDataTable("yundan_chaifen");
                    DataTableTracker zcfdtt = new DataTableTracker(zcfdt);
                    DataRow zcfdr = zcfdt.NewRow();
                    zcfdr["yundan_chaifen_id"] = cfdt.Rows[0]["yundan_chaifen_id"];
                    zcfdr["chaifen_statue"] = 1;
                    zcfdr["is_leaf"] = 0;   //是否末级（0：否；1：是；）
                    zcfdt.Rows.Add(zcfdr);
                    dbc.UpdateTable(zcfdt, zcfdtt);
                    #endregion 
                }
                else
                {
                    DataTable kcdt = GetHPByYD(ydid, oldyundanNum + "_1");

                    #region 剩余
                    DataTable sydt = dbc.GetEmptyDataTable("yundan_goods");

                    for (int i = 0; i < kcdt.Rows.Count; i++)
                    {
                        int n = 1;
                        for (int j = 0; j < hplist.Length; j++)
                        {
                            if (kcdt.Rows[i]["yundan_goods_id"].ToString() == hplist[j]["yundan_goods_id"].ToString())
                            {
                                DataRow dr = sydt.NewRow();
                                dr["yundan_goods_id"] = hplist[j]["yundan_goods_id"].ToString();
                                dr["yundan_chaifen_id"] = hplist[j]["yundan_chaifen_id"].ToString();
                                dr["yundan_goodsName"] = hplist[j]["yundan_goodsName"].ToString();
                                dr["yundan_goodsPack"] = hplist[j]["yundan_goodsPack"].ToString();
                                dr["yundan_goodsAmount"] = Convert.ToInt32(kcdt.Rows[i]["yundan_goodsAmount"]) - Convert.ToInt32(hplist[j]["yundan_goodsAmount"].ToString());
                                if (hplist[j]["yundan_goodsWeight"] != null && hplist[j]["yundan_goodsWeight"].ToString() != "")
                                {
                                    dr["yundan_goodsWeight"] = Convert.ToDecimal(hplist[j]["yundan_goodsWeight"].ToString());
                                }
                                if (hplist[j]["yundan_goodsVolume"] != null && hplist[j]["yundan_goodsVolume"].ToString() != "")
                                {
                                    dr["yundan_goodsVolume"] = Convert.ToDecimal(hplist[j]["yundan_goodsVolume"].ToString());
                                }
                                dr["status"] = hplist[j]["status"].ToString();
                                dr["addtime"] = hplist[j]["addtime"].ToString();
                                dr["adduser"] = hplist[j]["adduser"].ToString(); 
                                sydt.Rows.Add(dr);
                                n--;
                            }
                        }
                        if (n > 0)
                        {
                            DataRow dr = sydt.NewRow();
                            dr["yundan_goods_id"] = kcdt.Rows[i]["yundan_goods_id"];
                            dr["yundan_chaifen_id"] = kcdt.Rows[i]["yundan_chaifen_id"];
                            dr["yundan_goodsName"] = kcdt.Rows[i]["yundan_goodsName"];
                            dr["yundan_goodsPack"] = kcdt.Rows[i]["yundan_goodsPack"];
                            dr["yundan_goodsAmount"] = kcdt.Rows[i]["yundan_goodsAmount"];
                            if (kcdt.Rows[i]["yundan_goodsWeight"] != null && kcdt.Rows[i]["yundan_goodsWeight"].ToString() != "")
                            {
                                dr["yundan_goodsWeight"] = Convert.ToDecimal(kcdt.Rows[i]["yundan_goodsWeight"]);
                            }
                            if (kcdt.Rows[i]["yundan_goodsVolume"] != null && kcdt.Rows[i]["yundan_goodsVolume"].ToString() != "")
                            {
                                dr["yundan_goodsVolume"] = Convert.ToDecimal(kcdt.Rows[i]["yundan_goodsVolume"]);
                            }
                            dr["status"] = kcdt.Rows[i]["status"];
                            dr["addtime"] = kcdt.Rows[i]["addtime"];
                            dr["adduser"] = kcdt.Rows[i]["adduser"];
                            sydt.Rows.Add(dr);
                        }
                    }

                    string sql = "select yundan_chaifen_id from yundan_chaifen where status=0 and yundan_id=@yundan_id and yundan_chaifen_number=@yundan_chaifen_number";
                    SqlCommand cmd = new SqlCommand(sql);
                    cmd.Parameters.Add("@yundan_id", ydid);
                    cmd.Parameters.Add("@yundan_chaifen_number", oldyundanNum + "_1");
                    DataTable dt1 = dbc.ExecuteDataTable(cmd);

                   string sy_yundan_chaifen_id = dt1.Rows[0]["yundan_chaifen_id"].ToString();

                    //货品表
                   DataTable sy_hpdt = dbc.GetEmptyDataTable("yundan_goods");
                   DataTableTracker sy_hpdtt = new DataTableTracker(sy_hpdt);
                    for (int i = 0; i < sydt.Rows.Count; i++)
                    {
                        if (Convert.ToInt32(sydt.Rows[i]["yundan_goodsAmount"]) > 0)
                        {

                            DataRow sy_hpdr = sy_hpdt.NewRow();
                            sy_hpdr["yundan_goods_id"] = sydt.Rows[i]["yundan_goods_id"].ToString();
                            sy_hpdr["yundan_goodsAmount"] = sydt.Rows[i]["yundan_goodsAmount"].ToString();
                            sy_hpdt.Rows.Add(sy_hpdr);
                        }
                        else
                        {
                            DataRow sy_hpdr = sy_hpdt.NewRow();
                            sy_hpdr["yundan_goods_id"] = sydt.Rows[i]["yundan_goods_id"].ToString();
                            sy_hpdr["status"] = 1;
                            sy_hpdt.Rows.Add(sy_hpdr);
                        }
                    }
                    dbc.UpdateTable(sy_hpdt, sy_hpdtt);
                    #endregion 

                    #region 拆分
                    string cf_yundan_chaifen_id = Guid.NewGuid().ToString();
                    DataTable cf_cfdt = dbc.GetEmptyDataTable("yundan_chaifen");
                    DataRow cf_cfdr = cf_cfdt.NewRow();
                    cf_cfdr["yundan_chaifen_id"] = cf_yundan_chaifen_id;
                    cf_cfdr["yundan_id"] = ydid;
                    //cfdr["zhuangchedan_id"]
                    cf_cfdr["chaifen_statue"] = 0;
                    cf_cfdr["yundan_chaifen_number"] = newyundanNum;
                    cf_cfdr["is_leaf"] = 1;   //是否末级（0：否；1：是；）
                    cf_cfdr["status"] = 0;
                    cf_cfdr["addtime"] = DateTime.Now;
                    cf_cfdr["adduser"] = SystemUser.CurrentUser.UserID;
                    cf_cfdr["isDache"] = 0;
                    cf_cfdr["isZhuhuodaofu"] = 0;
                    cf_cfdr["isPeiSong"] = 0;
                    cf_cfdr["companyId"] = SystemUser.CurrentUser.CompanyID;
                    cf_cfdt.Rows.Add(cf_cfdr);
                    dbc.InsertTable(cf_cfdt);

                    //货品表
                    DataTable cf_hpdt = dbc.GetEmptyDataTable("yundan_goods");
                    if (hplist.Length > 0)
                    {
                        for (int i = 0; i < hplist.Length; i++)
                        {
                            DataRow cf_hpdr = cf_hpdt.NewRow();
                            cf_hpdr["yundan_goods_id"] = Guid.NewGuid().ToString();
                            cf_hpdr["yundan_chaifen_id"] = cf_yundan_chaifen_id;
                            cf_hpdr["yundan_goodsName"] = hplist[i]["yundan_goodsName"].ToString();
                            cf_hpdr["yundan_goodsPack"] = hplist[i]["yundan_goodsPack"].ToString();
                            if (hplist[i]["yundan_goodsAmount"] != null && hplist[i]["yundan_goodsAmount"].ToString() != "")
                            {
                                cf_hpdr["yundan_goodsAmount"] = Convert.ToInt32(hplist[i]["yundan_goodsAmount"].ToString());
                            }
                            else { cf_hpdr["yundan_goodsAmount"] = 0; }
                            if (hplist[i]["yundan_goodsWeight"] != null && hplist[i]["yundan_goodsWeight"].ToString() != "")
                            {
                                cf_hpdr["yundan_goodsWeight"] = Convert.ToDecimal(hplist[i]["yundan_goodsWeight"].ToString());
                            }
                            if (hplist[i]["yundan_goodsVolume"] != null && hplist[i]["yundan_goodsVolume"].ToString() != "")
                            {
                                cf_hpdr["yundan_goodsVolume"] = Convert.ToDecimal(hplist[i]["yundan_goodsVolume"].ToString());
                            }
                            cf_hpdr["status"] = 0;
                            cf_hpdr["addtime"] = DateTime.Now;
                            cf_hpdr["adduser"] = SystemUser.CurrentUser.UserID;
                            cf_hpdt.Rows.Add(cf_hpdr);
                        }
                    }
                    dbc.InsertTable(cf_hpdt);

                    #endregion 
                }

                dbc.CommitTransaction();
                return true;
            }
            catch (Exception ex)
            {
                dbc.RoolbackTransaction();
                throw ex;
            }
        }
    }

    #endregion 

    #region  回单批量登记
    /// <summary>
    /// 获取回单列表（包括所有拆分出来的表）
    /// </summary>
    /// <param name="pagnum"></param>
    /// <param name="pagesize"></param>
    /// <param name="fromOfficeId"></param>
    /// <param name="toOfficeId"></param>
    /// <param name="kssj"></param>
    /// <param name="jssj"></param>
    /// <param name="keyword"></param>
    /// <returns></returns>
    [CSMethod("GetHDList")]
    public object GetHDList(int pagnum, int pagesize, string fromOfficeId, string toOfficeId,string huidanType,string sjtype, string kssj, string jssj, 
        string ydh,string zcdh,string hpm,string fhr,string shr)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;
                string where = "";
                if (!string.IsNullOrEmpty(fromOfficeId))
                {
                    where += " and " + dbc.C_EQ("b.officeId", fromOfficeId);
                }
                if (!string.IsNullOrEmpty(toOfficeId))
                {
                    where += " and " + dbc.C_EQ("b.toOfficeId", toOfficeId);
                }
                if (!string.IsNullOrEmpty(huidanType))
                {
                    where += " and " + dbc.C_EQ("b.huidanType", huidanType);
                }
                if (!string.IsNullOrEmpty(sjtype))
                {
                    if (!string.IsNullOrEmpty(kssj))
                    {
                        where += " and b." + sjtype.Trim() + ">='" + Convert.ToDateTime(kssj) + "'";
                    }
                    if (!string.IsNullOrEmpty(jssj))
                    {
                        where += " and b." + sjtype.Trim() + "<='" + Convert.ToDateTime(jssj) + "'";
                    }
                }
                if (!string.IsNullOrEmpty(ydh))
                {
                    where += " and " + dbc.C_Like("b.yundanNum", ydh, LikeStyle.LeftAndRightLike);
                }
                if (!string.IsNullOrEmpty(zcdh))
                {
                    where += " and " + dbc.C_Like("e.zhuangchedanNum", zcdh, LikeStyle.LeftAndRightLike);
                }
                if (!string.IsNullOrEmpty(fhr))
                {
                    where += " and " + dbc.C_Like("b.fahuoPeople", fhr, LikeStyle.LeftAndRightLike);
                }
                if (!string.IsNullOrEmpty(shr))
                {
                    where += " and " + dbc.C_Like("b.shouhuoPeople", shr, LikeStyle.LeftAndRightLike);
                }

                string str = @" select a.*,b.*,c.officeName,d.officeName as toOfficeName,e.zhuangchedanNum from yundan_chaifen a left join yundan_yundan b
                                on a.yundan_id=b.yundan_id
                                left join jichu_office c on b.officeId=c.officeId
                                left join jichu_office d on b.officeId=d.officeId
                                left join zhuangchedan_zhuangchedan e on a.zhuangchedan_id=e.zhuangchedan_id
                                 where a.is_leaf=1 and a.zhuangchedan_id is not null  and b.status=0 " + where + " and a.companyId='"+SystemUser.CurrentUser.CompanyID+"' order by e.zhuangchedanNum asc";
                //开始取分页数据   
                System.Data.DataTable dtPage = new System.Data.DataTable();
                dtPage = dbc.GetPagedDataTable(str, pagesize, ref cp, out ac);

                return new { dt = dtPage, cp = cp, ac = ac };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }


   
    [CSMethod("SaveBSCHD")]
    public object SaveBSCHD(JSReader jsrIds, string bschdrq)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                List<string> idList = new List<string>();
                var idArray = jsrIds.ToArray();
                foreach (var id in idArray)
                {
                    idList.Add(id.ToString());
                
                    DataTable yddt = dbc.GetEmptyDataTable("yundan_yundan");
                    DataTableTracker yddtt = new DataTableTracker(yddt);
                    DataRow yddr = yddt.NewRow();
                    yddr["yundan_id"] = id.ToString();
                    if (!string.IsNullOrEmpty(bschdrq))
                    {
                        try
                        {
                            yddr["bschuidanDate"] = Convert.ToDateTime(bschdrq);
                        }
                        catch (Exception ex)
                        {
                            
                        }
                    }
                    
                    yddt.Rows.Add(yddr);
                    dbc.UpdateTable(yddt, yddtt);
                }
               
                dbc.CommitTransaction();
                return true;
            }
            catch (Exception ex)
            {
                dbc.RoolbackTransaction();
                throw ex;
            }
        }
    }

    [CSMethod("SaveHDSD")]
    public object SaveHDSD(JSReader jsrIds, string huidanDate)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                List<string> idList = new List<string>();
                var idArray = jsrIds.ToArray();
                foreach (var id in idArray)
                {
                    idList.Add(id.ToString());

                    DataTable yddt = dbc.GetEmptyDataTable("yundan_yundan");
                    DataTableTracker yddtt = new DataTableTracker(yddt);
                    DataRow yddr = yddt.NewRow();
                    yddr["yundan_id"] = id.ToString();
                    if (!string.IsNullOrEmpty(huidanDate))
                    {
                        try
                        {
                            yddr["huidanDate"] = Convert.ToDateTime(huidanDate);
                        }
                        catch (Exception ex)
                        {

                        }
                    }

                    yddt.Rows.Add(yddr);
                    dbc.UpdateTable(yddt, yddtt);
                }

                dbc.CommitTransaction();
                return true;
            }
            catch (Exception ex)
            {
                dbc.RoolbackTransaction();
                throw ex;
            }
        }
    }

    [CSMethod("SaveHDSC")]
    public object SaveHDSC(JSReader jsrIds, string huidanBack)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                List<string> idList = new List<string>();
                var idArray = jsrIds.ToArray();
                foreach (var id in idArray)
                {
                    idList.Add(id.ToString());

                    DataTable yddt = dbc.GetEmptyDataTable("yundan_yundan");
                    DataTableTracker yddtt = new DataTableTracker(yddt);
                    DataRow yddr = yddt.NewRow();
                    yddr["yundan_id"] = id.ToString();
                    if (!string.IsNullOrEmpty(huidanBack))
                    {
                        try
                        {
                            yddr["huidanBack"] = Convert.ToDateTime(huidanBack);
                        }
                        catch (Exception ex)
                        {

                        }
                    }

                    yddt.Rows.Add(yddr);
                    dbc.UpdateTable(yddt, yddtt);
                }

                dbc.CommitTransaction();
                return true;
            }
            catch (Exception ex)
            {
                dbc.RoolbackTransaction();
                throw ex;
            }
        }
    }
    #endregion

    #region 运单一览表

    #endregion 

}
