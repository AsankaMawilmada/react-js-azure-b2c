using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/public")]
public sealed class PublicController : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public IActionResult Get() =>
        Ok(new { message = "This endpoint is public.", serverTime = DateTimeOffset.UtcNow });
}
