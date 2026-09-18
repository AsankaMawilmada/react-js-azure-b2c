using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web;
using Microsoft.Identity.Web.Resource;

namespace Api.Controllers;

[ApiController]
[Route("api/profile")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public sealed class ProfileController : ControllerBase
{
    [HttpGet]
    [RequiredScope("access_as_user")]
    public IActionResult Get() => Ok(new
    {
        message = "This endpoint is protected by Azure B2C.",
        name = User.Identity?.Name,
        subject = User.FindFirst("sub")?.Value,
        scopes = User.FindAll("scp").Select(claim => claim.Value).ToArray()
    });
}
