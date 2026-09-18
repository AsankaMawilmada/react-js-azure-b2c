using Microsoft.Identity.Web;

namespace Api.Extensions;

public static class ApiExtensions
{
    public static IServiceCollection AddApiServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddMicrosoftIdentityWebApiAuthentication(configuration, "AzureAdB2C");
        services.AddAuthorization();
        services.AddCors(options =>
        {
            options.AddPolicy("frontend", policy =>
            {
                policy.WithOrigins(configuration.GetSection("Cors:Origins").Get<string[]>() ?? [])
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });
        services.AddControllers();
        services.AddOpenApi();

        return services;
    }

    public static WebApplication UseApiPipeline(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
        }

        app.UseHttpsRedirection();
        app.UseCors("frontend");
        app.UseAuthentication();
        app.UseAuthorization();

        return app;
    }
}
