//using OrderManagement.API.Models;

namespace ImpulseSupportTool_Repo
{
    public interface IOrderRepository
    {
        Task<OrderResponse> GetOrder(OrderRequest request);
    }
}
