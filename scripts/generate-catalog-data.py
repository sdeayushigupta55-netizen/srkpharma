#!/usr/bin/env python3
"""Generate scripts/product-catalog-data.mjs from SRK CNS PRODUCTS LIST PDF."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PDF = Path(__file__).resolve().parent.parent / 'public/images/SRK CNS PRODUCTS LIST Ethi.pdf'
OUT = ROOT / 'scripts' / 'product-catalog-data.mjs'

# Serial number -> category (from PDF section headers)
def category_for(num: int) -> str:
    if num <= 12:
        return 'alcohol-deaddiction'
    if num <= 45:
        return 'anti-depressant'
    if num <= 74:
        return 'anti-epileptic'
    if num <= 82:
        return 'anti-parkinsons'
    if num <= 113:
        return 'anti-psychotic'
    if num <= 131:
        return 'anxiolytic'
    if num <= 135:
        return 'mood-stabilizers'
    if num <= 159:
        return 'neuropathic-pain'
    if num <= 161:
        return 'anti-cough'
    if num >= 174:
        return 'neuro-otology'
    return 'neuroprotective'

# Explicit slug overrides: (serial, normalized brand key) -> slug
SLUG_OVERRIDES: dict[tuple[int, str], str] = {
    (11, 'AEGON 0.2'): 'aegon-02',
    (12, 'AEGON 0.4'): 'aegon-04',
    (15, 'CHLOZAPAM 0.5'): 'chlozapam-050',
    (15, 'CHLOZAPAM 0.50'): 'chlozapam-050',
    (16, 'CHLOZAPAM P'): 'clonazepam-p',
    (34, 'SUXEVIN 12.5'): 'suxevin-12-5',
    (54, 'SAMOGIN 50'): 'samogin-50-tab',
    (55, 'SAMOGIN 10'): 'samogin-10-inj',
    (56, 'SAMOGIN 50'): 'samogin-50-disp',
    (57, 'SAMOGIN 100'): 'samogin-100-disp',
    (58, 'SHIRBEC 500'): 'shirbec-500',
    (62, 'SHIRBEC 500'): 'shirbec-500-blister',
    (84, 'SRIPRID 100'): 'sriprid-100',
    (85, 'SRIPRID 100'): 'sriprid-100-sr',
    (81, 'SRIPRIM 0.25'): 'sripram-025',
    (82, 'SRIPRIM 1'): 'sripram-1',
    (106, 'SRINZA 5'): 'srinza-5-tab',
    (108, 'SRINZA 5'): 'srinza-5-md',
    (114, 'MARLBORO 0.25'): 'marlboo-025',
    (115, 'MARLBORO 0.50'): 'marlboo-050',
    (116, 'MARLBORO SR'): 'marlboo-sr',
    (119, 'UNZOLAM P'): 'unzolam-p',
    (121, 'CHLOZAPAM 0.50'): 'chlozapam-050',
    (149, 'SRITANE 5'): 'sritane-5',
    (150, 'SRITANE 10'): 'sritane-10',
    (161, 'COFSRI S'): 'cofsri-sf',
}

KNOWN_IMAGES: dict[str, str] = {
    'aegon-02': 'jpeg', 'aegon-04': 'jpeg', 'aegon-s': 'jpeg', 'aegon-sr': 'jpeg',
    'chlozapam-010': 'jpeg', 'chlozapam-025': 'jpeg', 'chlozapam-050': 'png',
    'citlopram-plus': 'jpeg', 'clonazepam-p': 'jpeg', 'cofsri-sf': 'png',
    'kroger-5': 'jpeg', 'marlboo-025': 'jpeg', 'marlboo-050': 'jpeg', 'marlboo-sr': 'jpeg',
    'nitzpam-10': 'jpeg', 'nitzpam-5': 'jpeg', 'silepram-25': 'jpeg', 'silepram-50': 'jpeg',
    'smimine-25': 'jpeg', 'smimine-75': 'jpeg', 'smimine-d': 'jpeg', 'smimine-fort': 'jpeg',
    'sricat-333': 'jpeg', 'sricat-666': 'jpeg', 'srifram-250': 'jpeg', 'srifram-500': 'jpeg',
    'sripline-10': 'jpeg', 'sripline-25': 'jpeg', 'sripram-025': 'png', 'sripram-1': 'png',
    'sritane-10': 'png', 'sritane-5': 'png', 'srithan-10': 'jpeg', 'srithan-5': 'jpeg',
    'sritrl-100': 'jpeg', 'sritrl-50': 'jpeg', 'srixone-25': 'jpeg', 'srixone-50': 'jpeg',
    'sudex-100': 'jpeg', 'suxevin-12-5': 'jpeg', 'suxevin-25': 'jpeg',
    'unzolam-025': 'jpeg', 'unzolam-050': 'jpeg', 'unzolam-p': 'png',
}

NRX_BRANDS = {
    'ALPRAZOLAM', 'CLONAZEPAM', 'ETIZOLAM', 'METHADONE', 'BUPRENORPHINE', 'NALOXONE',
    'DIAZEPAM', 'NITRAZEPAM', 'LORAZEPAM', 'ZOLPIDEM', 'CODEINE', 'TRAMADOL',
    'CHLORDIAZEPOXIDE', 'CLIDINIUM', 'CHlordiazepoxide'.upper(),
}

# Hand-curated catalog from client PDF (Sr 1–170; item 78 absent in source document)
RAW: list[dict] = [
    {'num': 1, 'name': 'SRIFRAM 250', 'slug': 'srifram-250', 'genericName': 'Disulfiram Tablets IP', 'composition': 'Disulfiram IP 250 mg', 'dosage': '250 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 2, 'name': 'SRIFRAM 500', 'slug': 'srifram-500', 'genericName': 'Disulfiram Tablets IP', 'composition': 'Disulfiram IP 500 mg', 'dosage': '500 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 3, 'name': 'SRICAT 333', 'slug': 'sricat-333', 'genericName': 'Acamprosate Calcium Enteric-Coated Tablets', 'composition': 'Acamprosate Calcium 333 mg', 'dosage': '333 mg', 'packSize': '10 × 6 Tablets', 'prescriptionType': 'Rx'},
    {'num': 4, 'name': 'SRICAT 666', 'slug': 'sricat-666', 'genericName': 'Acamprosate Calcium Enteric-Coated Tablets', 'composition': 'Acamprosate Calcium 666 mg', 'dosage': '666 mg', 'packSize': '10 × 6 Tablets', 'prescriptionType': 'Rx'},
    {'num': 5, 'name': 'SRIXONE 50', 'slug': 'srixone-50', 'genericName': 'Naltrexone Hydrochloride IP', 'composition': 'Naltrexone Hydrochloride IP 50 mg', 'dosage': '50 mg', 'packSize': '10 × 6 Tablets', 'prescriptionType': 'Rx'},
    {'num': 6, 'name': 'SRIXONE 25', 'slug': 'srixone-25', 'genericName': 'Naltrexone Hydrochloride IP', 'composition': 'Naltrexone Hydrochloride IP 25 mg', 'dosage': '25 mg', 'packSize': '10 × 6 Tablets', 'prescriptionType': 'Rx'},
    {'num': 7, 'name': 'SRITHAN 5', 'slug': 'srithan-5', 'genericName': 'Methadone Hydrochloride IP', 'composition': 'Methadone Hydrochloride IP 5 mg', 'dosage': '5 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 8, 'name': 'SRITHAN 10', 'slug': 'srithan-10', 'genericName': 'Methadone Hydrochloride IP', 'composition': 'Methadone Hydrochloride IP 10 mg', 'dosage': '10 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 9, 'name': 'AEGON SR', 'slug': 'aegon-sr', 'genericName': 'Buprenorphine & Naloxone Sublingual Tablets IP', 'composition': 'Buprenorphine 2 mg + Naloxone 0.5 mg', 'dosage': '2 mg / 0.5 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 10, 'name': 'AEGON S', 'slug': 'aegon-s', 'genericName': 'Buprenorphine & Naloxone Sublingual Tablets IP', 'composition': 'Buprenorphine 0.4 mg + Naloxone 0.1 mg', 'dosage': '0.4 mg / 0.1 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 11, 'name': 'AEGON 0.2', 'slug': 'aegon-02', 'genericName': 'Buprenorphine Sublingual Tablets IP', 'composition': 'Buprenorphine IP eq. to Buprenorphine 0.2 mg', 'dosage': '0.2 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 12, 'name': 'AEGON 0.4', 'slug': 'aegon-04', 'genericName': 'Buprenorphine Sublingual Tablets IP', 'composition': 'Buprenorphine IP eq. to Buprenorphine 0.4 mg', 'dosage': '0.4 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 13, 'name': 'SRIPLINE 10', 'slug': 'sripline-10', 'genericName': 'Amitriptyline Hydrochloride IP', 'composition': 'Amitriptyline Hydrochloride IP 10 mg', 'dosage': '10 mg', 'packSize': '20 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 14, 'name': 'SRIPLINE 25', 'slug': 'sripline-25', 'genericName': 'Amitriptyline Hydrochloride IP', 'composition': 'Amitriptyline Hydrochloride IP 25 mg', 'dosage': '25 mg', 'packSize': '20 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 15, 'name': 'CHLOZAPAM 0.50', 'slug': 'chlozapam-050', 'genericName': 'Clonazepam IP Mouth Dissolving Tablets', 'composition': 'Clonazepam IP 0.50 mg', 'dosage': '0.50 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 16, 'name': 'CHLOZAPAM P', 'slug': 'clonazepam-p', 'genericName': 'Clonazepam & Propranolol Tablets', 'composition': 'Clonazepam IP 0.5 mg + Propranolol Hydrochloride IP 20 mg', 'dosage': '0.5 mg / 20 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 17, 'name': 'CHLOZAPAM 0.10', 'slug': 'chlozapam-010', 'genericName': 'Clonazepam IP Mouth Dissolving Tablets', 'composition': 'Clonazepam IP 0.10 mg', 'dosage': '0.10 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 18, 'name': 'CITLOPRAM PLUS', 'slug': 'citlopram-plus', 'genericName': 'Escitalopram & Clonazepam Tablets', 'composition': 'Escitalopram Oxalate 10 mg + Clonazepam 0.5 mg', 'dosage': '10 mg / 0.5 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 19, 'name': 'CITLOPRAM S PLUS', 'slug': 'citlopram-s-plus', 'genericName': 'Escitalopram & Clonazepam Tablets', 'composition': 'Escitalopram 10 mg + Clonazepam 0.5 mg', 'dosage': '10 mg / 0.5 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 20, 'name': 'CITLOPRAM PLUS 5', 'slug': 'citlopram-plus-5', 'genericName': 'Escitalopram & Clonazepam Tablets', 'composition': 'Escitalopram 5 mg + Clonazepam 0.5 mg', 'dosage': '5 mg / 0.5 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 21, 'name': 'CITLOPRAM PLUS 20', 'slug': 'citlopram-plus-20', 'genericName': 'Escitalopram & Clonazepam Tablets', 'composition': 'Escitalopram Oxalate IP eq. to Escitalopram 20 mg + Clonazepam IP 0.25 mg', 'dosage': '20 mg / 0.25 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 22, 'name': 'CITLOPRAM 10', 'slug': 'citlopram-10', 'genericName': 'Escitalopram Tablets', 'composition': 'Escitalopram Oxalate IP eq. to Escitalopram 10 mg', 'dosage': '10 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 23, 'name': 'CITLOPRAM 5', 'slug': 'citlopram-5', 'genericName': 'Escitalopram Tablets', 'composition': 'Escitalopram Oxalate IP eq. to Escitalopram 5 mg', 'dosage': '5 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 24, 'name': 'SULOXETIN 20', 'slug': 'suloxetin-20', 'genericName': 'Duloxetine Gastro-Resistant Tablets IP', 'composition': 'Duloxetine 20 mg', 'dosage': '20 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 25, 'name': 'SULOXETIN 40', 'slug': 'suloxetin-40', 'genericName': 'Duloxetine Gastro-Resistant Tablets IP', 'composition': 'Duloxetine 40 mg', 'dosage': '40 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 26, 'name': 'SUDEX 50', 'slug': 'sudex-50', 'genericName': 'Desvenlafaxine Extended Release Tablets', 'composition': 'Desvenlafaxine Succinate eq. to Desvenlafaxine 50 mg', 'dosage': '50 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 27, 'name': 'SUDEX 100', 'slug': 'sudex-100', 'genericName': 'Desvenlafaxine Extended Release Tablets', 'composition': 'Desvenlafaxine Succinate eq. to Desvenlafaxine 100 mg', 'dosage': '100 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 28, 'name': 'SMIMINE 25', 'slug': 'smimine-25', 'genericName': 'Imipramine Hydrochloride IP', 'composition': 'Imipramine Hydrochloride IP 25 mg', 'dosage': '25 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 29, 'name': 'SMIMINE 75', 'slug': 'smimine-75', 'genericName': 'Imipramine Hydrochloride IP', 'composition': 'Imipramine Hydrochloride IP 75 mg', 'dosage': '75 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 30, 'name': 'SMIMINE D', 'slug': 'smimine-d', 'genericName': 'Imipramine & Diazepam Tablets', 'composition': 'Imipramine HCl 25 mg + Diazepam 5 mg', 'dosage': '25 mg / 5 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 31, 'name': 'SMIMINE FORT', 'slug': 'smimine-fort', 'genericName': 'Imipramine & Diazepam Tablets', 'composition': 'Imipramine HCl 25 mg + Diazepam 2 mg', 'dosage': '25 mg / 2 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 32, 'name': 'SILEPRAM 25', 'slug': 'silepram-25', 'genericName': 'Milnacipran Hydrochloride IP', 'composition': 'Milnacipran Hydrochloride IP 25 mg', 'dosage': '25 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 33, 'name': 'SILEPRAM 50', 'slug': 'silepram-50', 'genericName': 'Milnacipran Hydrochloride IP', 'composition': 'Milnacipran Hydrochloride IP 50 mg', 'dosage': '50 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 34, 'name': 'SUXEVIN 12.5', 'slug': 'suxevin-12-5', 'genericName': 'Paroxetine Controlled Release Tablets IP', 'composition': 'Paroxetine Controlled Release IP 12.5 mg', 'dosage': '12.5 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 35, 'name': 'SUXEVIN 25', 'slug': 'suxevin-25', 'genericName': 'Paroxetine Controlled Release Tablets IP', 'composition': 'Paroxetine Controlled Release IP 25 mg', 'dosage': '25 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 36, 'name': 'SRITRL 50', 'slug': 'sritrl-50', 'genericName': 'Sertraline Hydrochloride IP', 'composition': 'Sertraline Hydrochloride IP 50 mg', 'dosage': '50 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 37, 'name': 'SRITRL 100', 'slug': 'sritrl-100', 'genericName': 'Sertraline Hydrochloride IP', 'composition': 'Sertraline Hydrochloride IP 100 mg', 'dosage': '100 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 38, 'name': 'SRIVENA 37.5', 'slug': 'srivena-375', 'genericName': 'Venlafaxine Prolonged-Release Capsules BP', 'composition': 'Venlafaxine 37.5 mg', 'dosage': '37.5 mg', 'packSize': '10 × 2 × 10 Capsules', 'prescriptionType': 'Rx'},
    {'num': 39, 'name': 'SRIVENA 75', 'slug': 'srivena-75', 'genericName': 'Venlafaxine Prolonged-Release Capsules BP', 'composition': 'Venlafaxine 75 mg', 'dosage': '75 mg', 'packSize': '10 × 2 × 10 Capsules', 'prescriptionType': 'Rx'},
    {'num': 40, 'name': 'SRIZPO C', 'slug': 'srizpo-c', 'genericName': 'Chlordiazepoxide & Clidinium Tablets', 'composition': 'Chlordiazepoxide 5 mg + Clidinium Bromide 2.5 mg', 'dosage': '5 mg / 2.5 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 41, 'name': 'SRIZPO 10', 'slug': 'srizpo-10', 'genericName': 'Chlordiazepoxide Tablets', 'composition': 'Chlordiazepoxide IP 10 mg', 'dosage': '10 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 42, 'name': 'SLUVOX 50', 'slug': 'sluvox-50', 'genericName': 'Fluvoxamine Tablets', 'composition': 'Fluvoxamine 50 mg', 'dosage': '50 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 43, 'name': 'SLUVOX 100', 'slug': 'sluvox-100', 'genericName': 'Fluvoxamine Tablets', 'composition': 'Fluvoxamine 100 mg', 'dosage': '100 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 44, 'name': 'SPDEM 5', 'slug': 'spdem-5', 'genericName': 'Zolpidem Tartrate Tablets IP', 'composition': 'Zolpidem Tartrate IP 5 mg', 'dosage': '5 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 45, 'name': 'SPDEM 10', 'slug': 'spdem-10', 'genericName': 'Zolpidem Tartrate Tablets IP', 'composition': 'Zolpidem Tartrate IP 10 mg', 'dosage': '10 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
]

# Continue RAW in part 2 - append anti-epileptic through neuroprotective
RAW += [
    {'num': 46, 'name': 'SRIBAZIM 200', 'slug': 'sribazim-200', 'genericName': 'Carbamazepine Tablets IP', 'composition': 'Carbamazepine IP 200 mg', 'dosage': '200 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 47, 'name': 'SRIBAZIM 100', 'slug': 'sribazim-100', 'genericName': 'Carbamazepine Tablets IP', 'composition': 'Carbamazepine IP 100 mg', 'dosage': '100 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 48, 'name': 'SRIBAZIM FORT', 'slug': 'sribazim-fort', 'genericName': 'Carbamazepine Tablets IP', 'composition': 'Carbamazepine IP 200 mg', 'dosage': '200 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 49, 'name': 'SRIBAZIM 400', 'slug': 'sribazim-400', 'genericName': 'Carbamazepine Tablets IP', 'composition': 'Carbamazepine IP 400 mg', 'dosage': '400 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 50, 'name': 'SLABOZ 5', 'slug': 'slaboz-5', 'genericName': 'Clobazam Mouth Dissolving Tablets IP', 'composition': 'Clobazam IP 5 mg', 'dosage': '5 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 51, 'name': 'SLABOZ 10', 'slug': 'slaboz-10', 'genericName': 'Clobazam Mouth Dissolving Tablets IP', 'composition': 'Clobazam IP 10 mg', 'dosage': '10 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 52, 'name': 'SALMIDE 200', 'slug': 'salmide-200', 'genericName': 'Eslicarbazepine Acetate Tablets IP', 'composition': 'Eslicarbazepine Acetate IP 200 mg', 'dosage': '200 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 53, 'name': 'SALMIDE 400', 'slug': 'salmide-400', 'genericName': 'Eslicarbazepine Acetate Tablets IP', 'composition': 'Eslicarbazepine Acetate IP 400 mg', 'dosage': '400 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 54, 'name': 'SAMOGIN 50', 'slug': 'samogin-50-tab', 'genericName': 'Lacosamide Tablets', 'composition': 'Lacosamide Ph. Eur. 50 mg', 'dosage': '50 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 55, 'name': 'SAMOGIN 10', 'slug': 'samogin-10-inj', 'genericName': 'Lacosamide Injection', 'composition': 'Lacosamide Ph. Eur. 10 mg per ml', 'dosage': '10 mg/ml', 'packSize': '20 ml Injection', 'prescriptionType': 'Rx'},
    {'num': 56, 'name': 'SAMOGIN 50', 'slug': 'samogin-50-disp', 'genericName': 'Lamotrigine Dispersible Tablets IP', 'composition': 'Lamotrigine IP 50 mg', 'dosage': '50 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 57, 'name': 'SAMOGIN 100', 'slug': 'samogin-100-disp', 'genericName': 'Lamotrigine Dispersible Tablets IP', 'composition': 'Lamotrigine IP 100 mg', 'dosage': '100 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 58, 'name': 'SHIRBEC 500', 'slug': 'shirbec-500', 'genericName': 'Levetiracetam Tablets IP', 'composition': 'Levetiracetam IP 500 mg', 'dosage': '500 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 59, 'name': 'SHIRBEC 750', 'slug': 'shirbec-750', 'genericName': 'Levetiracetam Tablets IP', 'composition': 'Levetiracetam IP 750 mg', 'dosage': '750 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 60, 'name': 'SHIRBEC 1000', 'slug': 'shirbec-1000', 'genericName': 'Levetiracetam Tablets IP', 'composition': 'Levetiracetam IP 1000 mg', 'dosage': '1000 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 61, 'name': 'SHIRBEC 250', 'slug': 'shirbec-250', 'genericName': 'Levetiracetam Tablets IP', 'composition': 'Levetiracetam IP 250 mg', 'dosage': '250 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 62, 'name': 'SHIRBEC 500', 'slug': 'shirbec-500-blister', 'genericName': 'Levetiracetam Tablets IP', 'composition': 'Levetiracetam IP 500 mg', 'dosage': '500 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 63, 'name': 'SHIRBEC 100', 'slug': 'shirbec-100-syrup', 'genericName': 'Levetiracetam Oral Solution IP', 'composition': 'Levetiracetam IP 100 mg per ml', 'dosage': '100 mg/ml', 'packSize': '100 ml Syrup', 'prescriptionType': 'Rx'},
    {'num': 64, 'name': 'SRIPIRAL 600', 'slug': 'sripiral-600', 'genericName': 'Oxcarbazepine Sustained Release Tablets IP', 'composition': 'Oxcarbazepine IP 600 mg', 'dosage': '600 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 65, 'name': 'SRIPIRAL 300', 'slug': 'sripiral-300', 'genericName': 'Oxcarbazepine Dispersible Tablets IP', 'composition': 'Oxcarbazepine IP 300 mg', 'dosage': '300 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 66, 'name': 'SRIMITOR 200', 'slug': 'srimitor-200', 'genericName': 'Sodium Valproate Controlled Release Tablets IP', 'composition': 'Sodium Valproate IP 200 mg + Valproic Acid IP 87 mg (eq. Sodium Valproate 300 mg)', 'dosage': '300 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 67, 'name': 'SRIMITOR 133.5', 'slug': 'srimitor-1335', 'genericName': 'Sodium Valproate Controlled Release Tablets IP', 'composition': 'Sodium Valproate IP 133.5 mg + Valproic Acid IP 58 mg (eq. Sodium Valproate 200 mg)', 'dosage': '200 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 68, 'name': 'SPIMAT 25', 'slug': 'spimat-25', 'genericName': 'Topiramate Tablets IP', 'composition': 'Topiramate IP 25 mg', 'dosage': '25 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 69, 'name': 'SPIMAT 50', 'slug': 'spimat-50', 'genericName': 'Topiramate Tablets IP', 'composition': 'Topiramate IP 50 mg', 'dosage': '50 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 70, 'name': 'SIDIROX 500', 'slug': 'sidirox-500', 'genericName': 'Divalproex Sodium Extended Release Tablets IP', 'composition': 'Divalproex Sodium IP eq. to Valproic Acid 500 mg', 'dosage': '500 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 71, 'name': 'SRIDET 5', 'slug': 'sridet-5', 'genericName': 'Lemborexant Tablets', 'composition': 'Lemborexant 5 mg', 'dosage': '5 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 72, 'name': 'SRIDET 10', 'slug': 'sridet-10', 'genericName': 'Lemborexant Tablets', 'composition': 'Lemborexant 10 mg', 'dosage': '10 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 73, 'name': 'SRIPRAM 10', 'slug': 'sripram-10', 'genericName': 'Methylphenidate Hydrochloride Extended Release Tablets USP', 'composition': 'Methylphenidate HCl USP 10 mg', 'dosage': '10 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 74, 'name': 'PRIDEC 0.25', 'slug': 'pridec-025', 'genericName': 'Pramipexole Dihydrochloride Tablets USP', 'composition': 'Pramipexole Dihydrochloride (as Monohydrate) USP 0.25 mg', 'dosage': '0.25 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 75, 'name': 'PRIDEC 0.50', 'slug': 'pridec-050', 'genericName': 'Pramipexole Dihydrochloride Tablets USP', 'composition': 'Pramipexole Dihydrochloride (as Monohydrate) USP 0.50 mg', 'dosage': '0.50 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 76, 'name': 'SRILEPA CL', 'slug': 'sriepa-cl', 'genericName': 'Carbidopa & Levodopa Tablets IP', 'composition': 'Carbidopa Anhydrous 10 mg + Levodopa IP 100 mg', 'dosage': '10 mg / 100 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 77, 'name': 'SRILEPA 25', 'slug': 'sriepa-25', 'genericName': 'Carbidopa & Levodopa Tablets IP', 'composition': 'Carbidopa Anhydrous 25 mg + Levodopa IP 100 mg', 'dosage': '25 mg / 100 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 78, 'name': 'SRILEPA 100', 'slug': 'sriepa-100', 'genericName': 'Carbidopa & Levodopa Controlled Release Tablets IP', 'composition': 'Carbidopa Anhydrous 25 mg + Levodopa IP 100 mg (Controlled Release)', 'dosage': '25 mg / 100 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 79, 'name': 'SRILEPA C 200', 'slug': 'sriepa-c-200', 'genericName': 'Carbidopa & Levodopa Tablets IP', 'composition': 'Carbidopa IP eq. to Carbidopa Anhydrous 50 mg + Levodopa IP 200 mg', 'dosage': '50 mg / 200 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 80, 'name': 'SRILEPA C 250', 'slug': 'sriepa-c-250', 'genericName': 'Carbidopa & Levodopa Tablets IP', 'composition': 'Carbidopa IP eq. to Carbidopa Anhydrous 25 mg + Levodopa IP 250 mg', 'dosage': '25 mg / 250 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 81, 'name': 'SRIPRIM 0.25', 'slug': 'sripram-025', 'genericName': 'Pramipexole Dihydrochloride Tablets USP', 'composition': 'Pramipexole Dihydrochloride (as Monohydrate) USP 0.25 mg', 'dosage': '0.25 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 82, 'name': 'SRIPRIM 1', 'slug': 'sripram-1', 'genericName': 'Pramipexole Dihydrochloride Tablets USP', 'composition': 'Pramipexole Dihydrochloride (as Monohydrate) USP 1 mg', 'dosage': '1 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
]

RAW += [
    {'num': 83, 'name': 'SRIPRID 50', 'slug': 'sriprid-50', 'genericName': 'Amisulpride Tablets IP', 'composition': 'Amisulpride IP 50 mg', 'dosage': '50 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 84, 'name': 'SRIPRID 100', 'slug': 'sriprid-100', 'genericName': 'Amisulpride Tablets IP', 'composition': 'Amisulpride IP 100 mg', 'dosage': '100 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 85, 'name': 'SRIPRID 100 SR', 'slug': 'sriprid-100-sr', 'genericName': 'Amisulpride Sustained Release Tablets IP', 'composition': 'Amisulpride IP 100 mg', 'dosage': '100 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 86, 'name': 'SPZOLE 15', 'slug': 'spzole-15', 'genericName': 'Aripiprazole Tablets IP', 'composition': 'Aripiprazole IP 15 mg', 'dosage': '15 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 87, 'name': 'SPZOLE 10', 'slug': 'spzole-10', 'genericName': 'Aripiprazole Tablets IP', 'composition': 'Aripiprazole IP 10 mg', 'dosage': '10 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 88, 'name': 'SEPRIDOL 5', 'slug': 'sepridol-5', 'genericName': 'Haloperidol Tablets IP', 'composition': 'Haloperidol IP 5 mg', 'dosage': '5 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 89, 'name': 'SEPRIDOL 10', 'slug': 'sepridol-10', 'genericName': 'Haloperidol Tablets IP', 'composition': 'Haloperidol IP 10 mg', 'dosage': '10 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 90, 'name': 'SEPRIDE 50', 'slug': 'sepride-50', 'genericName': 'Levosulpiride Tablets', 'composition': 'Levosulpiride 50 mg', 'dosage': '50 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 91, 'name': 'SEPRIDE 100', 'slug': 'sepride-100', 'genericName': 'Levosulpiride Tablets', 'composition': 'Levosulpiride 100 mg', 'dosage': '100 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 92, 'name': 'SOZAPINE 50', 'slug': 'sozapine-50', 'genericName': 'Clozapine Tablets IP', 'composition': 'Clozapine IP 50 mg', 'dosage': '50 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 93, 'name': 'SOZAPINE 100', 'slug': 'sozapine-100', 'genericName': 'Clozapine Tablets IP', 'composition': 'Clozapine IP 100 mg', 'dosage': '100 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 94, 'name': 'SLIDONE 3', 'slug': 'slidone-3', 'genericName': 'Paliperidone Extended Release Tablets USP', 'composition': 'Paliperidone USP 3 mg', 'dosage': '3 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 95, 'name': 'SLIDONE 6', 'slug': 'slidone-6', 'genericName': 'Paliperidone Extended Release Tablets USP', 'composition': 'Paliperidone USP 6 mg', 'dosage': '6 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 96, 'name': 'SRIZODONE 100', 'slug': 'srizodone-100', 'genericName': 'Quetiapine Fumarate Tablets IP', 'composition': 'Quetiapine Fumarate IP eq. to Quetiapine 100 mg', 'dosage': '100 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 97, 'name': 'SRIZODONE 50', 'slug': 'srizodone-50', 'genericName': 'Quetiapine Fumarate Tablets IP', 'composition': 'Quetiapine Fumarate IP eq. to Quetiapine 50 mg', 'dosage': '50 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 98, 'name': 'SRIZODONE D', 'slug': 'srizodone-d', 'genericName': 'Quetiapine Sustained Release Tablets IP', 'composition': 'Quetiapine Fumarate IP eq. to Quetiapine 100 mg', 'dosage': '100 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 99, 'name': 'SRIPAR 2', 'slug': 'sripar-2', 'genericName': 'Risperidone Tablets IP', 'composition': 'Risperidone IP 2 mg', 'dosage': '2 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 100, 'name': 'SRIPAR 4', 'slug': 'sripar-4', 'genericName': 'Risperidone Tablets IP', 'composition': 'Risperidone IP 4 mg', 'dosage': '4 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 101, 'name': 'SRIPAR 3', 'slug': 'sripar-3', 'genericName': 'Risperidone & Trihexyphenidyl Tablets', 'composition': 'Risperidone BP 3 mg + Trihexyphenidyl Hydrochloride BP 2 mg', 'dosage': '3 mg / 2 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 102, 'name': 'SRITHIO 10', 'slug': 'srithio-10', 'genericName': 'Thioridazine Hydrochloride Tablets USP', 'composition': 'Thioridazine Hydrochloride USP 10 mg', 'dosage': '10 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 103, 'name': 'SRITHIO 25', 'slug': 'srithio-25', 'genericName': 'Thioridazine Hydrochloride Tablets USP', 'composition': 'Thioridazine Hydrochloride USP 25 mg', 'dosage': '25 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 104, 'name': 'SRITHIO O', 'slug': 'srithio-o', 'genericName': 'Olanzapine Pamoate Prolonged Release Injection', 'composition': 'Olanzapine Pamoate Monohydrate eq. to Olanzapine 405 mg', 'dosage': '405 mg/vial', 'packSize': '405 mg Vial Injection', 'prescriptionType': 'Rx'},
    {'num': 105, 'name': 'SRINZA 10', 'slug': 'srinza-10', 'genericName': 'Olanzapine Orally Disintegrating Tablets USP', 'composition': 'Olanzapine USP 10 mg', 'dosage': '10 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 106, 'name': 'SRINZA 5', 'slug': 'srinza-5-tab', 'genericName': 'Olanzapine Orally Disintegrating Tablets USP', 'composition': 'Olanzapine USP 5 mg', 'dosage': '5 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 107, 'name': 'OZAPHINE 5', 'slug': 'ozaphine-5', 'genericName': 'Olanzapine Sprinkle Sachet', 'composition': 'Olanzapine 5 mg', 'dosage': '5 mg', 'packSize': '1 × 10 Sachets', 'prescriptionType': 'Rx'},
    {'num': 108, 'name': 'SRINZA 5 MD', 'slug': 'srinza-5-md', 'genericName': 'Olanzapine Mouth Dissolving Tablets IP', 'composition': 'Olanzapine IP 5 mg', 'dosage': '5 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 109, 'name': 'SRINZA 2.5', 'slug': 'srinza-25', 'genericName': 'Olanzapine Mouth Dissolving Tablets IP', 'composition': 'Olanzapine IP 2.5 mg', 'dosage': '2.5 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 110, 'name': 'SRIPROZ LT', 'slug': 'sriproz-lt', 'genericName': 'Trifluoperazine, Trihexyphenidyl & Chlorpromazine Tablets', 'composition': 'Chlorpromazine HCl 50 mg + Trifluoperazine 5 mg + Benzhexol HCl 2 mg', 'dosage': '50 mg / 5 mg / 2 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 111, 'name': 'SRIFLUZ B', 'slug': 'srifluz-b', 'genericName': 'Trifluoperazine & Trihexyphenidyl Tablets', 'composition': 'Trifluoperazine HCl eq. to Trifluoperazine 5 mg + Benzhexol HCl 2 mg', 'dosage': '5 mg / 2 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 112, 'name': 'SRITROLA 10', 'slug': 'sritrola-10', 'genericName': 'Atomoxetine Hydrochloride Tablets IP', 'composition': 'Atomoxetine HCl IP eq. to Atomoxetine 10 mg', 'dosage': '10 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 113, 'name': 'SRITROLA 40', 'slug': 'sritrola-40', 'genericName': 'Atomoxetine Hydrochloride Tablets IP', 'composition': 'Atomoxetine HCl IP eq. to Atomoxetine 40 mg', 'dosage': '40 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 114, 'name': 'MARLBOO 0.25', 'slug': 'marlboo-025', 'genericName': 'Alprazolam Tablets IP', 'composition': 'Alprazolam IP 0.25 mg', 'dosage': '0.25 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 115, 'name': 'MARLBOO 0.50', 'slug': 'marlboo-050', 'genericName': 'Alprazolam Dispersible Tablets', 'composition': 'Alprazolam 0.50 mg', 'dosage': '0.50 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 116, 'name': 'MARLBOO SR', 'slug': 'marlboo-sr', 'genericName': 'Sertraline & Alprazolam SR Tablets', 'composition': 'Alprazolam 0.25 mg (SR) + Sertraline HCl 50 mg', 'dosage': '0.25 mg / 50 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 117, 'name': 'UNZOLAM 0.25', 'slug': 'unzolam-025', 'genericName': 'Etizolam Mouth Dissolving Tablets IP', 'composition': 'Etizolam IP 0.25 mg', 'dosage': '0.25 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 118, 'name': 'UNZOLAM 0.50', 'slug': 'unzolam-050', 'genericName': 'Etizolam Mouth Dissolving Tablets IP', 'composition': 'Etizolam IP 0.50 mg', 'dosage': '0.50 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 119, 'name': 'UNZOLAM P', 'slug': 'unzolam-p', 'genericName': 'Etizolam & Propranolol Hydrochloride Tablets', 'composition': 'Etizolam IP 0.50 mg + Propranolol Hydrochloride IP 20 mg', 'dosage': '0.50 mg / 20 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 120, 'name': 'CHLOZAPAM 0.25', 'slug': 'chlozapam-025', 'genericName': 'Clonazepam Dispersible Tablets IP', 'composition': 'Clonazepam IP 0.25 mg', 'dosage': '0.25 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 121, 'name': 'CHLOZAPAM 0.50', 'slug': 'chlozapam-050-disp', 'genericName': 'Clonazepam Dispersible Tablets IP', 'composition': 'Clonazepam IP 0.50 mg', 'dosage': '0.50 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 122, 'name': 'NITZPAM 5', 'slug': 'nitzpam-5', 'genericName': 'Nitrazepam Tablets', 'composition': 'Nitrazepam 5 mg', 'dosage': '5 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 123, 'name': 'NITZPAM 10', 'slug': 'nitzpam-10', 'genericName': 'Nitrazepam Tablets', 'composition': 'Nitrazepam 10 mg', 'dosage': '10 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 124, 'name': 'KROGER 5', 'slug': 'kroger-5', 'genericName': 'Diazepam Tablets IP', 'composition': 'Diazepam IP 5 mg', 'dosage': '5 mg', 'packSize': '10 × 2 × 10 Capsules', 'prescriptionType': 'NRx'},
    {'num': 125, 'name': 'KROGER 10', 'slug': 'kroger-10', 'genericName': 'Diazepam Tablets IP', 'composition': 'Diazepam IP 10 mg', 'dosage': '10 mg', 'packSize': '10 × 2 × 10 Capsules', 'prescriptionType': 'NRx'},
    {'num': 126, 'name': 'KROGER SR', 'slug': 'kroger-sr', 'genericName': 'Diazepam & Imipramine Tablets', 'composition': 'Diazepam 5 mg + Imipramine HCl 25 mg', 'dosage': '5 mg / 25 mg', 'packSize': '10 × 2 × 10 Capsules', 'prescriptionType': 'NRx'},
    {'num': 127, 'name': 'SHRIMLOZ 5', 'slug': 'shrimloz-5', 'genericName': 'Zolpidem Tablets', 'composition': 'Zolpidem 5 mg', 'dosage': '5 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 128, 'name': 'SHRIMLOZ 10', 'slug': 'shrimloz-10', 'genericName': 'Zolpidem Tablets', 'composition': 'Zolpidem 10 mg', 'dosage': '10 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 129, 'name': 'SRITIVAN 1', 'slug': 'sritivan-1', 'genericName': 'Lorazepam Mouth Dissolving Tablets IP', 'composition': 'Lorazepam IP 1 mg', 'dosage': '1 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 130, 'name': 'SRITIVAN 2', 'slug': 'sritivan-2', 'genericName': 'Lorazepam Mouth Dissolving Tablets IP', 'composition': 'Lorazepam IP 2 mg', 'dosage': '2 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 131, 'name': 'SRITIVAN 0.50', 'slug': 'sritivan-050', 'genericName': 'Lorazepam Mouth Dissolving Tablets IP', 'composition': 'Lorazepam IP 0.5 mg', 'dosage': '0.5 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 132, 'name': 'SNIUM 300', 'slug': 'snium-300', 'genericName': 'Lithium Carbonate Tablets IP', 'composition': 'Lithium Carbonate IP 300 mg', 'dosage': '300 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 133, 'name': 'SNIUM 400', 'slug': 'snium-400', 'genericName': 'Lithium Carbonate Prolonged Release Tablets IP', 'composition': 'Lithium Carbonate IP 400 mg', 'dosage': '400 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 134, 'name': 'SEPROX 250', 'slug': 'seprox-250', 'genericName': 'Divalproex Sodium Prolonged Release Tablets IP', 'composition': 'Divalproex Sodium IP eq. to Valproic Acid 250 mg', 'dosage': '250 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 135, 'name': 'SEPROX 500', 'slug': 'seprox-500', 'genericName': 'Divalproex Sodium Prolonged Release Tablets IP', 'composition': 'Divalproex Sodium IP eq. to Valproic Acid 500 mg', 'dosage': '500 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 136, 'name': 'SRIPILIN 100', 'slug': 'sripilin-100', 'genericName': 'Gabapentin Capsules IP', 'composition': 'Gabapentin IP 100 mg', 'dosage': '100 mg', 'packSize': '10 × 10 Capsules', 'prescriptionType': 'Rx'},
    {'num': 137, 'name': 'SRIPILIN 300', 'slug': 'sripilin-300', 'genericName': 'Gabapentin Capsules IP', 'composition': 'Gabapentin IP 300 mg', 'dosage': '300 mg', 'packSize': '10 × 10 Capsules', 'prescriptionType': 'Rx'},
    {'num': 138, 'name': 'SRIVITA MTS', 'slug': 'srivita-mts', 'genericName': 'Alpha Lipoic Acid, Methylcobalamin & Vitamin Tablets', 'composition': 'Alpha Lipoic Acid 100 mg + Mecobalamin 1500 mcg + Pyridoxine HCl 3 mg + Folic Acid 1.5 mg + Vitamin D3 1000 IU', 'dosage': 'Multivitamin combo', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 139, 'name': 'SRIVITA FORT', 'slug': 'srivita-fort', 'genericName': 'Levo-carnitine, Methylcobalamin & Folic Acid Tablets', 'composition': 'Levo-carnitine 250 mg + Methylcobalamin 1500 mcg + Folic Acid 1.5 mg', 'dosage': 'Combo', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 140, 'name': 'SRIVITA M', 'slug': 'srivita-m', 'genericName': 'Mecobalamin Injection IP', 'composition': 'Mecobalamin IP 500 mcg per ml', 'dosage': '500 mcg/ml', 'packSize': 'Ampoules', 'prescriptionType': 'Rx'},
    {'num': 141, 'name': 'SRIVITA V', 'slug': 'srivita-v', 'genericName': 'Neuropathic Vitamin Capsules', 'composition': 'Methylcobalamin 1500 mcg + Alpha Lipoic Acid 100 mg + Vitamin B6 3 mg + Folic Acid 1.5 mg + Zinc 15 mg + Chromium 60 mcg + Selenium 65 mcg + Biotin 100 mcg + Inositol 2 mg', 'dosage': 'Combo', 'packSize': '10 × 10 Capsules', 'prescriptionType': 'Rx'},
    {'num': 142, 'name': 'SRIMINE 500', 'slug': 'srimine-500', 'genericName': 'Methylcobalamin Tablets', 'composition': 'Methylcobalamin 500 mcg', 'dosage': '500 mcg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 143, 'name': 'SRIMINE 1500', 'slug': 'srimine-1500', 'genericName': 'Methylcobalamin Tablets', 'composition': 'Methylcobalamin 1500 mcg', 'dosage': '1500 mcg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 144, 'name': 'SRIGA E', 'slug': 'sriga-e', 'genericName': 'Alpha Lipoic Acid & Enzogenol Capsules', 'composition': 'Alpha Lipoic Acid 300 mg + Enzogenol 25 mg', 'dosage': '300 mg / 25 mg', 'packSize': '10 × 10 Capsules', 'prescriptionType': 'Rx'},
    {'num': 145, 'name': 'SRIGA 75', 'slug': 'sriga-75', 'genericName': 'Pregabalin Capsules IP', 'composition': 'Pregabalin IP 75 mg', 'dosage': '75 mg', 'packSize': '10 × 10 Capsules', 'prescriptionType': 'NRx'},
    {'num': 146, 'name': 'SRIGA 150', 'slug': 'sriga-150', 'genericName': 'Pregabalin Capsules IP', 'composition': 'Pregabalin IP 150 mg', 'dosage': '150 mg', 'packSize': '10 × 10 Capsules', 'prescriptionType': 'NRx'},
    {'num': 147, 'name': 'GEBELIN NTM', 'slug': 'gebelin-ntm', 'genericName': 'Pregabalin & Methylcobalamin Capsules', 'composition': 'Pregabalin IP 75 mg + Methylcobalamin IP 1500 mcg', 'dosage': '75 mg / 1500 mcg', 'packSize': '10 × 10 Capsules', 'prescriptionType': 'NRx'},
    {'num': 148, 'name': 'GEBELIN FORTE', 'slug': 'gebelin-forte', 'genericName': 'Pregabalin, Methylcobalamin & Alpha Lipoic Acid Capsules', 'composition': 'Pregabalin 75 mg + Methylcobalamin 750 mcg + Alpha Lipoic Acid 100 mg + Pyridoxine HCl 3 mg + Folic Acid 1.5 mg', 'dosage': 'Combo', 'packSize': '10 × 10 Capsules', 'prescriptionType': 'NRx'},
    {'num': 149, 'name': 'SRITANE 5', 'slug': 'sritane-5', 'genericName': 'Rizatriptan Tablets IP', 'composition': 'Rizatriptan 5 mg', 'dosage': '5 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 150, 'name': 'SRITANE 10', 'slug': 'sritane-10', 'genericName': 'Rizatriptan Tablets IP', 'composition': 'Rizatriptan 10 mg', 'dosage': '10 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 151, 'name': 'SRIPTY P', 'slug': 'sripty-p', 'genericName': 'Nortriptyline & Pregabalin Tablets', 'composition': 'Nortriptyline HCl eq. to Nortriptyline 10 mg + Pregabalin IP 75 mg', 'dosage': '10 mg / 75 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 152, 'name': 'SRIPTY SR', 'slug': 'sripty-sr', 'genericName': 'Nortriptyline & Pregabalin SR Tablets', 'composition': 'Nortriptyline HCl eq. to Nortriptyline 10 mg + Pregabalin IP 50 mg (SR)', 'dosage': '10 mg / 50 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 153, 'name': 'SRITADOLE 50', 'slug': 'sritadole-50', 'genericName': 'Tapentadol Hydrochloride Tablets IP', 'composition': 'Tapentadol HCl IP eq. to Tapentadol 50 mg', 'dosage': '50 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 154, 'name': 'SRITADOLE 100', 'slug': 'sritadole-100', 'genericName': 'Tapentadol Hydrochloride Tablets IP', 'composition': 'Tapentadol HCl IP eq. to Tapentadol 100 mg', 'dosage': '100 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 155, 'name': 'SRILOFENE 20', 'slug': 'srilofene-20', 'genericName': 'Baclofen Extended Release Tablets', 'composition': 'Baclofen 20 mg', 'dosage': '20 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 156, 'name': 'SREDOL P', 'slug': 'sredol-p', 'genericName': 'Tramadol & Paracetamol Tablets', 'composition': 'Tramadol HCl 37.5 mg + Paracetamol 325 mg', 'dosage': '37.5 mg / 325 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 157, 'name': 'SREDOL DS', 'slug': 'sredol-ds', 'genericName': 'Tramadol & Diclofenac Tablets', 'composition': 'Tramadol HCl 50 mg + Diclofenac Sodium 75 mg', 'dosage': '50 mg / 75 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 158, 'name': 'SREDOL 50', 'slug': 'sredol-50', 'genericName': 'Tramadol Hydrochloride Capsules BP', 'composition': 'Tramadol Hydrochloride BP 50 mg', 'dosage': '50 mg', 'packSize': '10 × 10 Capsules', 'prescriptionType': 'NRx'},
    {'num': 159, 'name': 'SREDOL INJ', 'slug': 'sredol-inj', 'genericName': 'Tramadol Hydrochloride Injection IP', 'composition': 'Tramadol Hydrochloride IP 50 mg/2 ml', 'dosage': '50 mg/2 ml', 'packSize': '1 × 10 Ampules', 'prescriptionType': 'NRx'},
    {'num': 160, 'name': 'COFSRI P', 'slug': 'cofsri-p', 'genericName': 'Codeine Phosphate & Paracetamol Tablets IP', 'composition': 'Codeine Phosphate IP 30 mg + Paracetamol IP 650 mg', 'dosage': '30 mg / 650 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'NRx'},
    {'num': 161, 'name': 'COFSRI SF', 'slug': 'cofsri-sf', 'genericName': 'Codeine Phosphate & Triprolidine Hydrochloride Syrup', 'composition': 'Codeine Phosphate IP 10 mg + Triprolidine HCl IP 1.25 mg per 5 ml', 'dosage': '100 ml syrup', 'packSize': '100 ml Syrup', 'prescriptionType': 'NRx'},
    {'num': 162, 'name': 'SRIVON', 'slug': 'srivon', 'genericName': 'Edaravone Injection', 'composition': 'Edaravone 1.5 mg/ml', 'dosage': '1.5 mg/ml', 'packSize': '20 ml Ampoule', 'prescriptionType': 'Rx'},
    {'num': 163, 'name': 'SIRTAM 400', 'slug': 'sirtam-400', 'genericName': 'Piracetam Capsules IP', 'composition': 'Piracetam IP 400 mg', 'dosage': '400 mg', 'packSize': '10 × 10 Capsules', 'prescriptionType': 'Rx'},
    {'num': 164, 'name': 'SIRTAM 800', 'slug': 'sirtam-800', 'genericName': 'Piracetam Capsules IP', 'composition': 'Piracetam IP 800 mg', 'dosage': '800 mg', 'packSize': '10 × 10 Capsules', 'prescriptionType': 'Rx'},
    {'num': 165, 'name': 'SRENET', 'slug': 'srenet', 'genericName': 'Piracetam Injection', 'composition': 'Piracetam 200 mg/ml', 'dosage': '200 mg/ml', 'packSize': '15 ml Ampoule', 'prescriptionType': 'Rx'},
    {'num': 166, 'name': 'SIRTAM SYRUP', 'slug': 'sirtam-syrup', 'genericName': 'Piracetam Syrup IP', 'composition': 'Piracetam IP 500 mg per 5 ml', 'dosage': '500 mg/5 ml', 'packSize': '100 ml Bottle', 'prescriptionType': 'Rx'},
    {'num': 167, 'name': 'SHRICET INJ', 'slug': 'shricet-inj', 'genericName': 'Citicoline Injection', 'composition': 'Citicoline 250 mg/ml', 'dosage': '250 mg/ml', 'packSize': '2 ml / 4 ml Injection Vial', 'prescriptionType': 'Rx'},
    {'num': 168, 'name': 'SHRICET 500', 'slug': 'shricet-500', 'genericName': 'Citicoline Tablets IP', 'composition': 'Citicoline Sodium IP eq. to Citicoline 500 mg', 'dosage': '500 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 169, 'name': 'SHRICET P', 'slug': 'shricet-p', 'genericName': 'Citicoline & Piracetam Tablets IP', 'composition': 'Citicoline Sodium IP eq. to Citicoline 500 mg + Piracetam IP 400 mg', 'dosage': '500 mg / 400 mg', 'packSize': '10 × 10 Tablets', 'prescriptionType': 'Rx'},
    {'num': 170, 'name': 'SHRICET SYRUP', 'slug': 'shricet-syrup', 'genericName': 'Citicoline Syrup', 'composition': 'Citicoline 500 mg per 5 ml', 'dosage': '500 mg/5 ml', 'packSize': '60 ml Syrup Bottle', 'prescriptionType': 'Rx'},
]


def js_str(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


def main() -> None:
    catalog = []
    for item in RAW:
        num = item['num']
        entry = {
            'name': item['name'],
            'slug': item['slug'],
            'genericName': item['genericName'],
            'composition': item['composition'],
            'dosage': item['dosage'],
            'packSize': item['packSize'],
            'category': category_for(num),
            'prescriptionType': item['prescriptionType'],
        }
        ext = KNOWN_IMAGES.get(item['slug'])
        if ext:
            entry['imageExt'] = ext
        catalog.append(entry)

    lines = ['/** SRK Group master catalog — generated from client PDF */', 'export const catalogRaw = [']
    for e in catalog:
        parts = [
            f"  {{",
            f"    name: {js_str(e['name'])},",
            f"    slug: {js_str(e['slug'])},",
            f"    genericName: {js_str(e['genericName'])},",
            f"    composition: {js_str(e['composition'])},",
            f"    dosage: {js_str(e['dosage'])},",
            f"    packSize: {js_str(e['packSize'])},",
            f"    category: {js_str(e['category'])},",
            f"    prescriptionType: {js_str(e['prescriptionType'])},",
        ]
        if 'imageExt' in e:
            parts.append(f"    imageExt: {js_str(e['imageExt'])},"
            )
        parts.append('  },')
        lines.extend(parts)
    lines.append(']')
    lines.append('')

    OUT.write_text('\n'.join(lines), encoding='utf-8')
    slugs = [e['slug'] for e in catalog]
    dupes = [s for s in set(slugs) if slugs.count(s) > 1]
    print(f'Wrote {len(catalog)} products to {OUT}')
    if dupes:
        print('DUPLICATE SLUGS:', dupes)
    nums = {e['num'] for e in RAW}
    missing = sorted(set(range(1, 171)) - nums)
    print('Missing serial numbers:', missing)


if __name__ == '__main__':
    main()
