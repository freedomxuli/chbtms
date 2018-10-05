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
                            left join jichu_office b on a.officeId=b.officeId where a.status=0 " + where + " order by a.addtime desc";
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

                cmd.Parameters.Clear();
                str = @"select * from yundan_goods where yundan_chaifen_id in 
                    (select yundan_chaifen_id from yundan_chaifen where status=0 and is_leaf=0 and yundan_id=@yundan_id) and status=0 order by addtime desc";
                cmd = new SqlCommand(str);
                cmd.Parameters.Add("@yundan_id", ydid); ;
                DataTable hpdt = dbc.ExecuteDataTable(cmd);

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
                string str = "  select clientId,people,tel,address from jichu_client where  status=0 order by people";
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
                string str = "  select driverId,people,tel,carNum from jichu_driver where  status=0 order by people";
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

                string str = "  select clientId,people,tel,address from jichu_client where  status=0 order by people";
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
                    //cfdr["chaifen_statue"]
                    //cfdr["yundan_chaifen_number"]
                    cfdr["is_leaf"]=1;   //是否末级（0：否；1：是；）
                    cfdr["status"]=0;
                    cfdr["addtime"]=DateTime.Now;
                    cfdr["adduser"]=SystemUser.CurrentUser.UserID;
                    cfdr["isDache"] = 0;
                    cfdr["isZhuhuodaofu"] = 0;
                    //cfdr["isPeiSong"]
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
                            if (hpdr["yundan_goodsWeight"] != null && hpdr["yundan_goodsWeight"].ToString() != "")
                            {
                                hpdr["yundan_goodsWeight"] = Convert.ToDecimal(hplist[i]["yundan_goodsWeight"].ToString());
                            }
                            if (hpdr["yundan_goodsVolume"] != null && hpdr["yundan_goodsVolume"].ToString() != "")
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

                    string str = "select * from yundan_chaifen where status=0  and is_leaf=0 and yundan_id=@yundan_id";
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

                string str = @" select a.*,b.people,b.tel,b.carNum from yundan_duanbo_fenliu a left join jichu_driver b 
                                  on a.driverId=b.driverId
                                   where yundanId="+dbc.ToSqlValue(ydid)+" order by a.addtime desc";
               
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
    public object SaveDBF(JSReader jsr,string ydid)
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

                    DataTable dt = dbc.GetEmptyDataTable("yundan_duanbo_fenliu");
                    DataRow dr = dt.NewRow();
                    dr["id"] = new Guid(id);
                    if (jsr["actionDate"] != null && jsr["actionDate"].ToString() != "")
                    {
                        dr["actionDate"] = Convert.ToDateTime(jsr["actionDate"].ToString());
                    }
                    dr["yundanId"] = ydid;
                    dr["driverId"] =    jsr["driverId"].ToString();
                    if(jsr["money"]!=null&&jsr["money"].ToString()!=""){
                       dr["money"]   = Convert.ToDecimal(jsr["money"].ToString());
                    }
                    dr["memo"] = jsr["memo"].ToString();
                    dr["addtime"] = DateTime.Now;
                    dt.Rows.Add(dr);
                    dbc.InsertTable(dt);
                }
                else
                {
                    //修改
                    string id = jsr["id"].ToString();
                    DataTable dt = dbc.GetEmptyDataTable("yundan_duanbo_fenliu");
                    DataTableTracker dtt = new DataTableTracker(dt);
                    DataRow dr = dt.NewRow();
                    dr["id"] = new Guid(id);
                    if (jsr["actionDate"] != null && jsr["actionDate"].ToString() != "")
                    {
                        dr["actionDate"] = Convert.ToDateTime(jsr["actionDate"].ToString());
                    }
                    dr["driverId"] = jsr["driverId"].ToString();
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
                string str = @" select a.*,b.people,b.tel,b.carNum from yundan_duanbo_fenliu a left join jichu_driver b 
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
                string str = "delete from yundan_duanbo_fenliu where id="+dbc.ToSqlValue(id);
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
}
