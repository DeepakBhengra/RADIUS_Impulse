using ImpulseSupportTool_Repo;
//using OrderManagement.API.Models;
using OrderManagement.API.Repositories;

namespace ImpulseSupportTool_Repo

{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _repository;

        public OrderService(IOrderRepository repository)
        {
            _repository = repository;
        }

        public async Task<OrderResponse> GetOrderDetails(OrderRequest request)
        {
            return await _repository.GetOrder(request);
        }
    }
}