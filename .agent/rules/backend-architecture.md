---
trigger: model_decision
description: ./backend/src/@modules/
---

# 🏛️ Architectural Rules: Hexagonal Architecture (NestJS)

Эти правила определяют границы и зависимости между слоями Domain, Application и Infrastructure.

## 🧱 Layers Definition

| Name | Path | Priority |
| :--- | :--- | :--- |
| **Domain** | `src/@modules/*/domain` | 1 |
| **Application** | `src/@modules/*/application` | 2 |
| **Infrastructure** | `src/@modules/*/infrastructure` | 3 |

## 🚫 Dependency Rules

| From Layer | Rule | Access Allowed |
| :--- | :--- | :--- |
| **Infrastructure** | Может импортировать только внутренние слои. | `Domain`, `Application` |
| **Application** | **Критическое правило:** Не должен зависеть от внешних деталей. | `Domain` |
| **Domain** | **Ядро:** Не должен иметь никаких внешних зависимостей. | **CANNOT access** `Application`, `Infrastructure` |

## 📁 File Placement Rules

| Rule Name | Pattern | Must Be In Path |
| :--- | :--- | :--- |
| **Controller Placement** | `*.controller.ts` | `src/@modules/*/infrastructure` |
| **Repository Placement** | `*.repository.ts` | `src/@modules/*/infrastructure` |
| **Service Placement** | `*.service.ts` | `src/@modules/*/application` |
| **DTO Placement** | `*.dto.ts` | `src/@modules/*/application` |
| **Schema Placement** | `*.schema.ts` | `src/@modules/*/domain` |
| **Interface Placement** | `*.interface.ts` | `src/@modules/*/domain` |