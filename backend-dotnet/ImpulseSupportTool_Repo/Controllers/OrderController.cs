using Microsoft.AspNetCore.Mvc;
//using OrderManagement.API.Models;
//using OrderManagement.API.Services;

namespace ImpulseSupportTool_Repo.Controllers
{   

    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _service;

        public OrderController(IOrderService service)
        {
            _service = service;
        }

        [HttpPost("GetOrder")]
        public async Task<IActionResult> GetOrder(
            [FromBody] OrderRequest request)
        {
            Console.WriteLine(">>> REQUEST RECEIVED");
            Console.WriteLine($">>> PoNumber: '{request.PoNumber}'");
            Console.WriteLine($">>> CountryCode: '{request.CountryCode}'");
            Console.WriteLine($">>> OrderNumber: '{request.OrderNumber}'");
            Console.WriteLine($">>> PartnerId: '{request.PartnerId}'");
            Console.WriteLine($">>> CustomerNumber: '{request.CustomerNumber}'");
            Console.WriteLine($">>> Sku: '{request.Sku}'");
            Console.WriteLine($">>> TransactionId: '{request.TransactionId}'");
            Console.WriteLine($">>> Eviorment: '{request.Environment}'");
            var result = await _service.GetOrderDetails(request);

            if (result == null)
            {
                return NotFound("Order not found");
            }

            return Ok(result);
        }
    }
}
