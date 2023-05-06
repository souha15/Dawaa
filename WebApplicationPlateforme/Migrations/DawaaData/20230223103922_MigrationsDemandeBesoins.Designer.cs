﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using WebApplicationPlateforme.Data;

namespace WebApplicationPlateforme.Migrations.DawaaData
{
    [DbContext(typeof(DawaaDataContext))]
    [Migration("20230223103922_MigrationsDemandeBesoins")]
    partial class MigrationsDemandeBesoins
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn)
                .HasAnnotation("ProductVersion", "3.1.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasColumnType("character varying(256)")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedName")
                        .HasColumnType("character varying(256)")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasName("RoleNameIndex");

                    b.ToTable("AspNetRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("ClaimType")
                        .HasColumnType("text");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("text");

                    b.Property<string>("RoleId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUser", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("integer");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("text");

                    b.Property<string>("Discriminator")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Email")
                        .HasColumnType("character varying(256)")
                        .HasMaxLength(256);

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("boolean");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("boolean");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("NormalizedEmail")
                        .HasColumnType("character varying(256)")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedUserName")
                        .HasColumnType("character varying(256)")
                        .HasMaxLength(256);

                    b.Property<string>("PasswordHash")
                        .HasColumnType("text");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("text");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("boolean");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("text");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("boolean");

                    b.Property<string>("UserName")
                        .HasColumnType("character varying(256)")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasName("UserNameIndex");

                    b.ToTable("AspNetUsers");

                    b.HasDiscriminator<string>("Discriminator").HasValue("IdentityUser");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("ClaimType")
                        .HasColumnType("text");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("text");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasColumnType("text");

                    b.Property<string>("ProviderKey")
                        .HasColumnType("text");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("text");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("text");

                    b.Property<string>("RoleId")
                        .HasColumnType("text");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("text");

                    b.Property<string>("LoginProvider")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.Property<string>("Value")
                        .HasColumnType("text");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens");
                });

            modelBuilder.Entity("WebApplicationPlateforme.Model.Demande_Besoins.DemandeBesoin", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("dateEnreg")
                        .HasColumnType("text");

                    b.Property<string>("dateEtat")
                        .HasColumnType("text");

                    b.Property<string>("dateFin")
                        .HasColumnType("text");

                    b.Property<string>("dateRh")
                        .HasColumnType("text");

                    b.Property<string>("details")
                        .HasColumnType("text");

                    b.Property<string>("etat")
                        .HasColumnType("text");

                    b.Property<string>("etatFin")
                        .HasColumnType("text");

                    b.Property<string>("etatRh")
                        .HasColumnType("text");

                    b.Property<string>("idFin")
                        .HasColumnType("text");

                    b.Property<string>("idRh")
                        .HasColumnType("text");

                    b.Property<string>("idUserCreator")
                        .HasColumnType("text");

                    b.Property<string>("nomFin")
                        .HasColumnType("text");

                    b.Property<string>("nomRh")
                        .HasColumnType("text");

                    b.Property<string>("raisonRefus")
                        .HasColumnType("text");

                    b.Property<string>("typebBesoin")
                        .HasColumnType("text");

                    b.Property<string>("userNameCreator")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("idUserCreator");

                    b.ToTable("DemandeBesoins");
                });

            modelBuilder.Entity("WebApplicationPlateforme.Model.Global.Administration", b =>
                {
                    b.Property<int?>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.Property<string>("Nom")
                        .HasColumnType("text");

                    b.Property<string>("NomDirecteur")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Administration");
                });

            modelBuilder.Entity("WebApplicationPlateforme.Model.Global.Departement", b =>
                {
                    b.Property<int?>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.Property<int>("IdAdministration")
                        .HasColumnType("integer");

                    b.Property<string>("Nom")
                        .HasColumnType("text");

                    b.Property<string>("NomAdministration")
                        .HasColumnType("text");

                    b.Property<string>("NomDirecteur")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("IdAdministration");

                    b.ToTable("Departement");
                });

            modelBuilder.Entity("WebApplicationPlateforme.Model.User.ApplicationUser", b =>
                {
                    b.HasBaseType("Microsoft.AspNetCore.Identity.IdentityUser");

                    b.Property<string>("FullName")
                        .HasColumnType("text");

                    b.Property<string>("FullNameEnglish")
                        .HasColumnType("text");

                    b.Property<string>("adresse")
                        .HasColumnType("text");

                    b.Property<string>("attribut1")
                        .HasColumnType("text");

                    b.Property<string>("attribut2")
                        .HasColumnType("text");

                    b.Property<string>("attribut3")
                        .HasColumnType("text");

                    b.Property<string>("attribut4")
                        .HasColumnType("text");

                    b.Property<string>("attribut5")
                        .HasColumnType("text");

                    b.Property<string>("attribut6")
                        .HasColumnType("text");

                    b.Property<string>("autreIndemnite")
                        .HasColumnType("text");

                    b.Property<string>("classement")
                        .HasColumnType("text");

                    b.Property<string>("dateNaissance")
                        .HasColumnType("text");

                    b.Property<string>("dateQualification")
                        .HasColumnType("text");

                    b.Property<string>("dateenreg")
                        .HasColumnType("text");

                    b.Property<string>("daterectrutement")
                        .HasColumnType("text");

                    b.Property<string>("degre")
                        .HasColumnType("text");

                    b.Property<string>("directeur")
                        .HasColumnType("text");

                    b.Property<string>("emploi")
                        .HasColumnType("text");

                    b.Property<string>("etatuser")
                        .HasColumnType("text");

                    b.Property<string>("faculteEcole")
                        .HasColumnType("text");

                    b.Property<string>("heureArrive")
                        .HasColumnType("text");

                    b.Property<string>("heureDepart")
                        .HasColumnType("text");

                    b.Property<int?>("idAdministration")
                        .HasColumnType("integer");

                    b.Property<int?>("idDepartement")
                        .HasColumnType("integer");

                    b.Property<string>("idUserCreator")
                        .HasColumnType("text");

                    b.Property<string>("indemnite")
                        .HasColumnType("text");

                    b.Property<string>("lieuNaissance")
                        .HasColumnType("text");

                    b.Property<string>("mention")
                        .HasColumnType("text");

                    b.Property<string>("nationalite")
                        .HasColumnType("text");

                    b.Property<string>("nomAdministration")
                        .HasColumnType("text");

                    b.Property<string>("nomDepartement")
                        .HasColumnType("text");

                    b.Property<string>("num")
                        .HasColumnType("text");

                    b.Property<string>("passeport")
                        .HasColumnType("text");

                    b.Property<string>("paysetude")
                        .HasColumnType("text");

                    b.Property<string>("photo")
                        .HasColumnType("text");

                    b.Property<string>("position")
                        .HasColumnType("text");

                    b.Property<string>("qualification")
                        .HasColumnType("text");

                    b.Property<string>("rang")
                        .HasColumnType("text");

                    b.Property<string>("registreCivil")
                        .HasColumnType("text");

                    b.Property<string>("religion")
                        .HasColumnType("text");

                    b.Property<string>("salaire")
                        .HasColumnType("text");

                    b.Property<string>("sexe")
                        .HasColumnType("text");

                    b.Property<string>("soldeconge")
                        .HasColumnType("text");

                    b.Property<string>("specialite")
                        .HasColumnType("text");

                    b.Property<string>("statut")
                        .HasColumnType("text");

                    b.Property<string>("tel")
                        .HasColumnType("text");

                    b.Property<string>("typeEmploi")
                        .HasColumnType("text");

                    b.Property<string>("typeQualification")
                        .HasColumnType("text");

                    b.Property<string>("typeSang")
                        .HasColumnType("text");

                    b.Property<string>("unite")
                        .HasColumnType("text");

                    b.Property<string>("userNameCreator")
                        .HasColumnType("text");

                    b.HasIndex("idAdministration");

                    b.HasIndex("idDepartement");

                    b.HasDiscriminator().HasValue("ApplicationUser");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("WebApplicationPlateforme.Model.Demande_Besoins.DemandeBesoin", b =>
                {
                    b.HasOne("WebApplicationPlateforme.Model.User.ApplicationUser", "ApplicationUser")
                        .WithMany()
                        .HasForeignKey("idUserCreator");
                });

            modelBuilder.Entity("WebApplicationPlateforme.Model.Global.Departement", b =>
                {
                    b.HasOne("WebApplicationPlateforme.Model.Global.Administration", "Administration")
                        .WithMany()
                        .HasForeignKey("IdAdministration")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("WebApplicationPlateforme.Model.User.ApplicationUser", b =>
                {
                    b.HasOne("WebApplicationPlateforme.Model.Global.Administration", "Administration")
                        .WithMany()
                        .HasForeignKey("idAdministration");

                    b.HasOne("WebApplicationPlateforme.Model.Global.Departement", "Departement")
                        .WithMany()
                        .HasForeignKey("idDepartement");
                });
#pragma warning restore 612, 618
        }
    }
}