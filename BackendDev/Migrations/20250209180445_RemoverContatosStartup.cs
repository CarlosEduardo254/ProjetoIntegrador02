using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendDev.Migrations
{
    /// <inheritdoc />
    public partial class RemoverContatosStartup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ContatosMembros",
                table: "Startups");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ContatosMembros",
                table: "Startups",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
