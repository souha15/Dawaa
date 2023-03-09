using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace WebApplicationPlateforme.Migrations.DawaaData
{
    public partial class MigrationsDemandeBesoins : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
           

            migrationBuilder.CreateTable(
                name: "DemandeBesoins",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    typebBesoin = table.Column<string>(nullable: true),
                    details = table.Column<string>(nullable: true),
                    etat = table.Column<string>(nullable: true),
                    dateEtat = table.Column<string>(nullable: true),
                    idRh = table.Column<string>(nullable: true),
                    nomRh = table.Column<string>(nullable: true),
                    dateRh = table.Column<string>(nullable: true),
                    etatRh = table.Column<string>(nullable: true),
                    idFin = table.Column<string>(nullable: true),
                    nomFin = table.Column<string>(nullable: true),
                    etatFin = table.Column<string>(nullable: true),
                    dateFin = table.Column<string>(nullable: true),
                    dateEnreg = table.Column<string>(nullable: true),
                    raisonRefus = table.Column<string>(nullable: true),
                    userNameCreator = table.Column<string>(nullable: true),
                    idUserCreator = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DemandeBesoins", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DemandeBesoins_AspNetUsers_idUserCreator",
                        column: x => x.idUserCreator,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

           
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            
            migrationBuilder.DropTable(
                name: "DemandeBesoins");

           
        }
    }
}
