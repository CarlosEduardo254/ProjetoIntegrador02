using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendDev.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarLucrosEAtualizacoesRemoverCOntatosStartup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AtualizacoesStartup",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    StartupId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    DataAtualizacao = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Descricao = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TipoAtualizacao = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AtualizacoesStartup", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AtualizacoesStartup_Startups_StartupId",
                        column: x => x.StartupId,
                        principalTable: "Startups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "LucrosMensais",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    StartupId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Data = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Valor = table.Column<decimal>(type: "decimal(65,30)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LucrosMensais", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LucrosMensais_Startups_StartupId",
                        column: x => x.StartupId,
                        principalTable: "Startups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_AtualizacoesStartup_StartupId",
                table: "AtualizacoesStartup",
                column: "StartupId");

            migrationBuilder.CreateIndex(
                name: "IX_LucrosMensais_StartupId",
                table: "LucrosMensais",
                column: "StartupId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AtualizacoesStartup");

            migrationBuilder.DropTable(
                name: "LucrosMensais");
        }
    }
}
