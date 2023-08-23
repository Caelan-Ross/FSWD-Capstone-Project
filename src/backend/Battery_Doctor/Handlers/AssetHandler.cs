using Battery_Doctor.Data;

namespace Battery_Doctor.Handlers
{
    public class AssetHandler
    {
        public static int GetAssetAmount(int id)
        {
            int amount = 0;
            using(ApplicationContext db = new())
            {
               amount = db.Assets.Where(a => a.BatteryId == id).Count(); 
            }

            return amount;
        }
    }
}
