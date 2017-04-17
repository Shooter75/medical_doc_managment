﻿using System;
using System.Collections.Generic;
using System.Web.Http;
using AutoMapper;

using MedicalDocManagment.DAL.Entities;
using MedicalDocManagment.DAL;
using MedicalDocManagment.WebUI.Models;
using MedicalDocManagment.DAL.Repository.Interfaces;
using MedicalDocManagment.DAL.Repository;
using MedicalDocManagement.BLL.DTO;
using MedicalDocManagement.BLL.Services;
using MedicalDocManagement.BLL.Services.Abstract;
using MedicalDocManagment.WebUI.Models.Main;


namespace MedicalDocManagment.WebUI.Controllers
{
    public class ChildCardsController : ApiController
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly IChildCardsService _childCardsService; 

        public ChildCardsController()
        {
            _unitOfWork = new UnitOfWork();
            //TODO DI
            _childCardsService = new ChildCardsService();
        }

        //[Authorize]
        [HttpPost]
        public IHttpActionResult AddPatient(AddPatientModel addPatientModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Context context = new Context();

            ChildCard newChildCard = new ChildCard
            {
                LastName = addPatientModel.LastName,
                FirstName = addPatientModel.FirstName,
                SecondName = addPatientModel.SecondName,
                Date = addPatientModel.Date,
                CheckIn = addPatientModel.Checkin,
                CheckOut = addPatientModel.Checkout,
                DirectedBy = addPatientModel.DirectedBy
            };
            newChildCard.Diagnosis = context.DiagnosesMkh.Find(addPatientModel.DiagnosisCode);

            ChildCard result = null;
            try
            {
                result = context.ChildrenCards.Add(newChildCard);
                context.SaveChanges();
            }
            catch (Exception exception)
            {
                return InternalServerError(exception);
            }

            return Ok(result);
        }

        [HttpGet]
        public IHttpActionResult GetClassesMkh()
        {
            var classesMkhDTO = _childCardsService.GetClassesMkh();

            var config = new MapperConfiguration(cfg => cfg.CreateMap<ClassMkhDTO, ClassMkhVM>());
            var mapper = config.CreateMapper();
            var classesMkhVM = mapper.Map<List<ClassMkhVM>>(classesMkhDTO);

            return Ok(classesMkhVM);
        }

        //[Authorize]
        [HttpGet]
        public IHttpActionResult GetClassesMkh(string id)
        {
            var classMkhDTO = _childCardsService.GetClassesMkh(id);

            var config = new MapperConfiguration(cfg => cfg.CreateMap<ClassMkhDTO, ClassMkhVM>());
            var mapper = config.CreateMapper();
            var classMkhVM = mapper.Map<ClassMkhVM>(classMkhDTO);

            return Ok(classMkhVM);
        }

        //[Authorize]
        [HttpGet]
        public IHttpActionResult GetBlocksMkh(string classMkhId)
        {
            var blocksMkhDTO = _childCardsService.GetRelatedBlocksMkh(classMkhId);

            var config = new MapperConfiguration(cfg => cfg.CreateMap<BlockMkhDTO, BlockMkhVM>());
            var mapper = config.CreateMapper();
            var blocksMkhVM = mapper.Map<List<BlockMkhVM>>(blocksMkhDTO);

            return Ok(blocksMkhVM);
        }

        //[Authorize]
        [HttpGet]
        public IHttpActionResult GetNosologiesMkh(string blockMkhId)
        {
            var nosologiesMkhDTO = _childCardsService.GetRelatedNosologiesMkh(blockMkhId);

            var config = new MapperConfiguration(cfg => cfg.CreateMap<NosologyMkhDTO, NosologyMkhVM>());
            var mapper = config.CreateMapper();
            var nosologiesMkhVM = mapper.Map<List<NosologyMkhVM>>(nosologiesMkhDTO);

            return Ok(nosologiesMkhVM);
        }

        //[Authorize]
        [HttpGet]
        public IHttpActionResult GetDiagnosesMkh(string nosologyMkhId)
        {
            var diagnosesMkhDTO = _childCardsService.GetRelatedDiagnosesMkh(nosologyMkhId);

            var config = new MapperConfiguration(cfg => cfg.CreateMap<DiagnosisMkhDTO, DiagnosisMkhVM>());
            var mapper = config.CreateMapper();
            var diagnosesMkhVM = mapper.Map<List<DiagnosisMkhVM>>(diagnosesMkhDTO);

            return Ok(diagnosesMkhVM);
        }
    }
}