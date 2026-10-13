//using OrderManagement.API.Models;

namespace ImpulseSupportTool_Repo
{
    public interface IOrderService
    {
        Task<OrderResponse> GetOrderDetails(OrderRequest request);
    }
}
