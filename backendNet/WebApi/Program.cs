using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using WebApi.Data;
using WebApi.Data.Repositories;
using WebApi.Services;

namespace WebApi
{
    //Trusted_Connection=True;
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            // ==========================================
            // REGISTRO DE SERVICIOS (Antes de builder.Build)
            // ==========================================
            builder.Services.AddDbContext<AppDbContext>(op => op.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
            builder.Services.AddScoped<ILineaNegocioRepository, LineaNegocioRepository>();
            builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
            builder.Services.AddScoped<ILineaNegocioService, LineaNegocioService>();
            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<IUsuarioService, UsuarioService>();
            // 4. Configurar CORS (Indispensable para enlazar con tu Angular)
            builder.Services.AddCors(op => {
                op.AddPolicy("PermitirAngular", policy =>
                {
                    policy.WithOrigins("http://localhost:4200") // URL de tu Angular
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                }); 
            });
            var jwtSettings = builder.Configuration.GetSection("Jwt");
            var key = Encoding.UTF8.GetBytes(jwtSettings.GetValue<string>("Key")!);

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings.GetValue<string>("Issuer"),
                    ValidAudience = jwtSettings.GetValue<string>("Audience"),
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                };
            });



            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            //builder.Services.AddSwaggerGen();
            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo { Title = "WebApiVimatica", Version = "v1" });

                // 1. Definir el esquema de seguridad JWT
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Introduce el token JWT de esta manera: Bearer {tu_token_aqui}"
                });

                // 2. Hacer que Swagger aplique esta seguridad de forma global a los endpoints con [Authorize]
                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] {}
                    }
                });
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            // 5. Habilitar CORS (¡OJO! Debe ir estrictamente antes de UseAuthorization)
            app.UseCors("PermitirAngular");
            app.UseAuthentication(); // ?? AGREGA ESTA LÍNEA AQUÍ
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}