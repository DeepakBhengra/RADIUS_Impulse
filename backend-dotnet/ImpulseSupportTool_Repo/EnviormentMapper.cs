using Microsoft.Extensions.Configuration;
using Oracle.ManagedDataAccess.Client;

namespace ImpulseSupportTool_Repo
{
    public class EnvironmentMapper
    {
        private readonly IConfiguration _configuration;

        public EnvironmentMapper(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GetOdsConnectionString(string environment)
        {
            if (string.IsNullOrWhiteSpace(environment))
            {
                throw new ArgumentException(
                    "Environment is required. Expected Prod, Dev, or Qa.");
            }

            string connectionName = environment.Trim().ToUpperInvariant() switch
            {
                "PROD" => "ODSConnectionProd",
                "DEV" => "ODSConnectionDev",
                "QA" => "ODSConnectionQa",

                _ => throw new ArgumentException(
                    $"Invalid environment '{environment}'. " +
                    "Expected Prod, Dev, or Qa.")
            };

            // Get the non-secret connection details from appsettings.json
            string? baseConnectionString =
                _configuration.GetConnectionString(connectionName);

            if (string.IsNullOrWhiteSpace(baseConnectionString))
            {
                throw new InvalidOperationException(
                    $"ODS connection string '{connectionName}' is not configured.");
            }

            // Get password from User Secrets:
            // ODSConnectionQa:Password
            // ODSConnectionDev:Password
            // ODSConnectionProd:Password
            string? password =
                _configuration[$"{connectionName}:Password"];

            if (string.IsNullOrWhiteSpace(password))
            {
                throw new InvalidOperationException(
                    $"ODS User Secret '{connectionName}:Password' is not configured.");
            }

            var connectionBuilder =
                new OracleConnectionStringBuilder(baseConnectionString);

            connectionBuilder.Password = password;

            Console.WriteLine(
                $">>> ODS CONNECTION SELECTED: {connectionName}");

            Console.WriteLine(
                $">>> ODS USER: {connectionBuilder.UserID}");

            Console.WriteLine(
                $">>> ODS PASSWORD FOUND: {!string.IsNullOrWhiteSpace(password)}");

            return connectionBuilder.ConnectionString;
        }
    }
}