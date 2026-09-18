using Api.Extensions;

namespace Api;

public sealed class Startup
{
    private readonly IConfiguration configuration;

    public Startup(IConfiguration configuration)
    {
        this.configuration = configuration;
    }

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddApiServices(configuration);
    }

    public void Configure(WebApplication app)
    {
        app.UseApiPipeline();
        app.MapControllers();
    }
}
