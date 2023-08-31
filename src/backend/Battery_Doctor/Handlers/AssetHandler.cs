using Battery_Doctor.Data;
using Battery_Doctor.Models;

namespace Battery_Doctor.Handlers
{
    public class AssetHandler
    {
        public static int GetAssetAmount(int id)
        {
            int amount = 0;
            using(ApplicationContext db = new())
            {
                List<Asset> assets = db.Assets.Where(a => a.BatteryId == id).ToList();

                amount = assets.Count();

                foreach(Asset asset in assets) 
                {
                    amount = amount - db.Invoice_Details.Where(i => i.AssetId == asset.Id).Count();
                }
            }

            return amount;
        }
    }
}
