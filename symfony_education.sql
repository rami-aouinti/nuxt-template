-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Erstellungszeit: 22. Nov 2025 um 01:55
-- Server-Version: 10.11.13-MariaDB-0ubuntu0.24.04.1
-- PHP-Version: 8.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `symfony_education`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `access_url`
--

CREATE TABLE `access_url` (
  `id` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `tree_root` int(11) DEFAULT NULL,
  `lft` int(11) NOT NULL,
  `lvl` int(11) NOT NULL,
  `rgt` int(11) NOT NULL,
  `url` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `active` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `tms` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `url_type` tinyint(1) DEFAULT NULL,
  `limit_courses` int(11) DEFAULT NULL,
  `limit_active_courses` int(11) DEFAULT NULL,
  `limit_sessions` int(11) DEFAULT NULL,
  `limit_users` int(11) DEFAULT NULL,
  `limit_teachers` int(11) DEFAULT NULL,
  `limit_disk_space` int(11) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `is_login_only` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `access_url`
--

INSERT INTO `access_url` (`id`, `resource_node_id`, `parent_id`, `tree_root`, `lft`, `lvl`, `rgt`, `url`, `description`, `active`, `created_by`, `tms`, `url_type`, `limit_courses`, `limit_active_courses`, `limit_sessions`, `limit_users`, `limit_teachers`, `limit_disk_space`, `email`, `is_login_only`) VALUES
(1, 4, NULL, 1, 1, 0, 2, 'http://localhost/', '', 1, 1, '2025-11-21 22:22:16', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `access_url_rel_color_theme`
--

CREATE TABLE `access_url_rel_color_theme` (
  `id` int(11) NOT NULL,
  `url_id` int(11) NOT NULL,
  `color_theme_id` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `access_url_rel_color_theme`
--

INSERT INTO `access_url_rel_color_theme` (`id`, `url_id`, `color_theme_id`, `active`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, '2025-11-21 22:22:17', '2025-11-21 22:22:17');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `access_url_rel_course`
--

CREATE TABLE `access_url_rel_course` (
  `id` int(11) NOT NULL,
  `c_id` int(11) NOT NULL,
  `access_url_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `access_url_rel_course`
--

INSERT INTO `access_url_rel_course` (`id`, `c_id`, `access_url_id`) VALUES
(1, 1, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `access_url_rel_course_category`
--

CREATE TABLE `access_url_rel_course_category` (
  `id` int(11) NOT NULL,
  `access_url_id` int(11) DEFAULT NULL,
  `course_category_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `access_url_rel_course_category`
--

INSERT INTO `access_url_rel_course_category` (`id`, `access_url_id`, `course_category_id`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 3);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `access_url_rel_plugin`
--

CREATE TABLE `access_url_rel_plugin` (
  `id` int(11) NOT NULL,
  `plugin_id` int(11) NOT NULL,
  `url_id` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL,
  `configuration` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '(DC2Type:json)' CHECK (json_valid(`configuration`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `access_url_rel_session`
--

CREATE TABLE `access_url_rel_session` (
  `id` int(11) NOT NULL,
  `session_id` int(11) DEFAULT NULL,
  `access_url_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `access_url_rel_session`
--

INSERT INTO `access_url_rel_session` (`id`, `session_id`, `access_url_id`) VALUES
(1, 1, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `access_url_rel_user`
--

CREATE TABLE `access_url_rel_user` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `access_url_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `access_url_rel_user`
--

INSERT INTO `access_url_rel_user` (`id`, `user_id`, `access_url_id`) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 4, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `access_url_rel_usergroup`
--

CREATE TABLE `access_url_rel_usergroup` (
  `id` int(11) NOT NULL,
  `access_url_id` int(11) DEFAULT NULL,
  `usergroup_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `access_url_rel_usergroup`
--

INSERT INTO `access_url_rel_usergroup` (`id`, `access_url_id`, `usergroup_id`) VALUES
(1, 1, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `admin`
--

INSERT INTO `admin` (`id`, `user_id`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `agenda_reminder`
--

CREATE TABLE `agenda_reminder` (
  `id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `date_interval` varchar(255) NOT NULL COMMENT '(DC2Type:dateinterval)',
  `sent` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `ai_requests`
--

CREATE TABLE `ai_requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `tool_name` varchar(255) NOT NULL,
  `tool_item_id` bigint(20) DEFAULT NULL,
  `requested_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `request_text` longtext NOT NULL,
  `prompt_tokens` int(11) DEFAULT NULL,
  `completion_tokens` int(11) DEFAULT NULL,
  `total_tokens` int(11) DEFAULT NULL,
  `ai_provider` varchar(50) NOT NULL,
  `ai_model` varchar(255) DEFAULT NULL,
  `ai_endpoint` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `announcement_rel_group`
--

CREATE TABLE `announcement_rel_group` (
  `group_id` int(11) NOT NULL,
  `announcement_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `asset`
--

CREATE TABLE `asset` (
  `id` binary(16) NOT NULL COMMENT '(DC2Type:uuid)',
  `title` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `compressed` tinyint(1) NOT NULL,
  `mime_type` longtext DEFAULT NULL,
  `original_name` longtext DEFAULT NULL,
  `dimensions` longtext DEFAULT NULL COMMENT '(DC2Type:simple_array)',
  `size` int(11) NOT NULL,
  `crop` varchar(255) DEFAULT NULL,
  `metadata` longtext DEFAULT NULL COMMENT '(DC2Type:array)',
  `description` longtext DEFAULT NULL,
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `attempt_feedback`
--

CREATE TABLE `attempt_feedback` (
  `id` binary(16) NOT NULL COMMENT '(DC2Type:uuid)',
  `attempt_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `asset_id` binary(16) DEFAULT NULL COMMENT '(DC2Type:uuid)',
  `comment` longtext NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `attempt_file`
--

CREATE TABLE `attempt_file` (
  `id` binary(16) NOT NULL COMMENT '(DC2Type:uuid)',
  `attempt_id` int(11) DEFAULT NULL,
  `asset_id` binary(16) DEFAULT NULL COMMENT '(DC2Type:uuid)',
  `comment` longtext NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `azure_sync_state`
--

CREATE TABLE `azure_sync_state` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `value` longtext NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `block`
--

CREATE TABLE `block` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `path` varchar(190) NOT NULL,
  `controller` varchar(100) NOT NULL,
  `active` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `branch_sync`
--

CREATE TABLE `branch_sync` (
  `id` int(11) NOT NULL,
  `access_url_id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `unique_id` varchar(50) NOT NULL,
  `title` varchar(250) NOT NULL,
  `description` longtext DEFAULT NULL,
  `branch_ip` varchar(40) DEFAULT NULL,
  `latitude` decimal(10,0) DEFAULT NULL,
  `longitude` decimal(10,0) DEFAULT NULL,
  `dwn_speed` int(11) DEFAULT NULL,
  `up_speed` int(11) DEFAULT NULL,
  `delay` int(11) DEFAULT NULL,
  `admin_mail` varchar(250) DEFAULT NULL,
  `admin_name` varchar(250) DEFAULT NULL,
  `admin_phone` varchar(250) DEFAULT NULL,
  `last_sync_trans_id` int(11) DEFAULT NULL,
  `last_sync_trans_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `last_sync_type` varchar(20) DEFAULT NULL,
  `ssl_pub_key` varchar(250) DEFAULT NULL,
  `branch_type` varchar(250) DEFAULT NULL,
  `lft` int(11) DEFAULT NULL,
  `rgt` int(11) DEFAULT NULL,
  `lvl` int(11) DEFAULT NULL,
  `root` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `branch_sync`
--

INSERT INTO `branch_sync` (`id`, `access_url_id`, `parent_id`, `unique_id`, `title`, `description`, `branch_ip`, `latitude`, `longitude`, `dwn_speed`, `up_speed`, `delay`, `admin_mail`, `admin_name`, `admin_phone`, `last_sync_trans_id`, `last_sync_trans_date`, `last_sync_type`, `ssl_pub_key`, `branch_type`, `lft`, `rgt`, `lvl`, `root`) VALUES
(1, 1, NULL, 'b1dab055c28e267401515c2040b3d7c31622cd57', 'localhost', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'c3a895650da7bcca4a6da900da4fb51500314978', NULL, 1, 2, 0, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `branch_transaction`
--

CREATE TABLE `branch_transaction` (
  `id` int(11) NOT NULL,
  `status_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `transaction_id` int(11) NOT NULL,
  `action` varchar(20) DEFAULT NULL,
  `item_id` varchar(255) DEFAULT NULL,
  `origin` varchar(255) DEFAULT NULL,
  `dest_id` varchar(255) DEFAULT NULL,
  `external_info` varchar(255) DEFAULT NULL,
  `time_insert` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `time_update` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `failed_attempts` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `branch_transaction_status`
--

CREATE TABLE `branch_transaction_status` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `career`
--

CREATE TABLE `career` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `catalogue_course_rel_access_url_rel_usergroup`
--

CREATE TABLE `catalogue_course_rel_access_url_rel_usergroup` (
  `id` int(11) NOT NULL,
  `course_id` int(11) DEFAULT NULL,
  `access_url_id` int(11) DEFAULT NULL,
  `usergroup_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `catalogue_session_rel_access_url_rel_usergroup`
--

CREATE TABLE `catalogue_session_rel_access_url_rel_usergroup` (
  `id` int(11) NOT NULL,
  `session_id` int(11) DEFAULT NULL,
  `access_url_id` int(11) DEFAULT NULL,
  `usergroup_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `chat`
--

CREATE TABLE `chat` (
  `id` int(11) NOT NULL,
  `from_user` int(11) DEFAULT NULL,
  `to_user` int(11) DEFAULT NULL,
  `message` longtext NOT NULL,
  `sent` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `recd` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `chat_video`
--

CREATE TABLE `chat_video` (
  `id` int(11) NOT NULL,
  `from_user` int(11) NOT NULL,
  `to_user` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `datetime` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `color_theme`
--

CREATE TABLE `color_theme` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `variables` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '(DC2Type:json)' CHECK (json_valid(`variables`)),
  `slug` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `color_theme`
--

INSERT INTO `color_theme` (`id`, `title`, `variables`, `slug`, `created_at`, `updated_at`) VALUES
(1, 'Chamilo', '{\"--color-primary-base\":\"46 117 163\",\"--color-primary-gradient\":\"-1 86 130\",\"--color-primary-button-text\":\"46 117 163\",\"--color-primary-button-alternative-text\":\"255 255 255\",\"--color-secondary-base\":\"243 126 47\",\"--color-secondary-gradient\":\"193 81 -31\",\"--color-secondary-button-text\":\"255 255 255\",\"--color-tertiary-base\":\"51 51 51\",\"--color-tertiary-gradient\":\"103 103 103\",\"--color-tertiary-button-text\":\"51 51 51\",\"--color-success-base\":\"119 170 12\",\"--color-success-gradient\":\"80 128 -43\",\"--color-success-button-text\":\"255 255 255\",\"--color-info-base\":\"13 123 253\",\"--color-info-gradient\":\"-33 83 211\",\"--color-info-button-text\":\"255 255 255\",\"--color-warning-base\":\"245 206 1\",\"--color-warning-gradient\":\"189 151 -65\",\"--color-warning-button-text\":\"0 0 0\",\"--color-danger-base\":\"223 59 59\",\"--color-danger-gradient\":\"180 -13 20\",\"--color-danger-button-text\":\"255 255 255\",\"--color-form-base\":\"46 117 163\"}', 'chamilo', '2025-11-21 22:22:17', '2025-11-21 22:22:17');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `conference_activity`
--

CREATE TABLE `conference_activity` (
  `id` int(11) NOT NULL,
  `meeting_id` int(11) DEFAULT NULL,
  `participant_id` int(11) DEFAULT NULL,
  `in_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `out_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `close` tinyint(1) NOT NULL,
  `type` varchar(50) NOT NULL,
  `event` varchar(255) NOT NULL,
  `activity_data` longtext DEFAULT NULL,
  `signature_file` varchar(255) DEFAULT NULL,
  `signed_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `metrics` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '(DC2Type:json)' CHECK (json_valid(`metrics`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `conference_meeting`
--

CREATE TABLE `conference_meeting` (
  `id` int(11) NOT NULL,
  `c_id` int(11) DEFAULT NULL,
  `session_id` int(11) DEFAULT NULL,
  `access_url_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `calendar_id` int(11) DEFAULT NULL,
  `service_provider` varchar(20) NOT NULL,
  `remote_id` varchar(255) DEFAULT NULL,
  `internal_meeting_id` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `attendee_pw` varchar(255) DEFAULT NULL,
  `moderator_pw` varchar(255) DEFAULT NULL,
  `record` tinyint(1) NOT NULL,
  `status` int(11) NOT NULL,
  `welcome_msg` longtext DEFAULT NULL,
  `visibility` int(11) NOT NULL,
  `voice_bridge` int(11) DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `has_video_m4v` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `closed_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `meeting_list_item` longtext DEFAULT NULL,
  `meeting_info_get` longtext DEFAULT NULL,
  `sign_attendance` tinyint(1) NOT NULL,
  `reason_to_sign_attendance` longtext DEFAULT NULL,
  `account_email` varchar(255) DEFAULT NULL,
  `webinar_schema` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `conference_recording`
--

CREATE TABLE `conference_recording` (
  `id` int(11) NOT NULL,
  `meeting_id` int(11) DEFAULT NULL,
  `format_type` varchar(50) NOT NULL,
  `resource_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `contact_form_contact_category`
--

CREATE TABLE `contact_form_contact_category` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `course`
--

CREATE TABLE `course` (
  `id` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `room_id` int(11) DEFAULT NULL,
  `title` varchar(250) DEFAULT NULL,
  `code` varchar(40) NOT NULL,
  `visual_code` varchar(40) DEFAULT NULL,
  `directory` varchar(40) DEFAULT NULL,
  `course_language` varchar(20) NOT NULL,
  `description` longtext DEFAULT NULL,
  `introduction` longtext DEFAULT NULL,
  `visibility` int(11) NOT NULL,
  `show_score` int(11) DEFAULT NULL,
  `tutor_name` varchar(200) DEFAULT NULL,
  `department_name` varchar(30) DEFAULT NULL,
  `department_url` varchar(180) DEFAULT NULL,
  `video_url` varchar(255) NOT NULL,
  `sticky` tinyint(1) NOT NULL,
  `disk_quota` int(11) DEFAULT NULL,
  `last_visit` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `last_edit` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `creation_date` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `expiration_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `subscribe` tinyint(1) NOT NULL,
  `unsubscribe` tinyint(1) NOT NULL,
  `registration_code` varchar(255) DEFAULT NULL,
  `legal` longtext DEFAULT NULL,
  `activate_legal` int(11) DEFAULT NULL,
  `add_teachers_to_sessions_courses` tinyint(1) DEFAULT NULL,
  `course_type_id` int(11) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `popularity` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `course`
--

INSERT INTO `course` (`id`, `resource_node_id`, `room_id`, `title`, `code`, `visual_code`, `directory`, `course_language`, `description`, `introduction`, `visibility`, `show_score`, `tutor_name`, `department_name`, `department_url`, `video_url`, `sticky`, `disk_quota`, `last_visit`, `last_edit`, `creation_date`, `expiration_date`, `subscribe`, `unsubscribe`, `registration_code`, `legal`, `activate_legal`, `add_teachers_to_sessions_courses`, `course_type_id`, `duration`, `popularity`) VALUES
(1, 5, NULL, 'Symofny', 'SYMFONY', 'SYMFONY', NULL, 'en_US', 'Course Description', '', 2, 1, '', '', '', '', 0, 1000, '2025-11-21 22:28:42', '2025-11-21 22:28:42', '2025-11-21 22:28:42', '2026-11-21 22:28:42', 1, 0, NULL, '', 0, 0, NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `course_category`
--

CREATE TABLE `course_category` (
  `id` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `asset_id` binary(16) DEFAULT NULL COMMENT '(DC2Type:uuid)',
  `title` longtext NOT NULL,
  `code` varchar(40) NOT NULL,
  `tree_pos` int(11) DEFAULT NULL,
  `children_count` smallint(6) DEFAULT NULL,
  `auth_course_child` varchar(40) DEFAULT NULL,
  `auth_cat_child` varchar(40) DEFAULT NULL,
  `description` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `course_category`
--

INSERT INTO `course_category` (`id`, `parent_id`, `asset_id`, `title`, `code`, `tree_pos`, `children_count`, `auth_course_child`, `auth_cat_child`, `description`) VALUES
(1, NULL, NULL, 'Language skills', 'LANG', 1, 0, 'TRUE', 'TRUE', NULL),
(2, NULL, NULL, 'PC Skills', 'PC', 2, 0, 'TRUE', 'TRUE', NULL),
(3, NULL, NULL, 'Projects', 'PROJ', 3, 0, 'TRUE', 'TRUE', NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `course_rel_category`
--

CREATE TABLE `course_rel_category` (
  `course_id` int(11) NOT NULL,
  `course_category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `course_rel_category`
--

INSERT INTO `course_rel_category` (`course_id`, `course_category_id`) VALUES
(1, 2);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `course_rel_class`
--

CREATE TABLE `course_rel_class` (
  `course_code` varchar(40) NOT NULL,
  `class_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `course_rel_user`
--

CREATE TABLE `course_rel_user` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `c_id` int(11) DEFAULT NULL,
  `relation_type` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `is_tutor` tinyint(1) DEFAULT NULL,
  `sort` int(11) DEFAULT NULL,
  `user_course_cat` int(11) DEFAULT NULL,
  `legal_agreement` int(11) DEFAULT NULL,
  `progress` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `course_rel_user`
--

INSERT INTO `course_rel_user` (`id`, `user_id`, `c_id`, `relation_type`, `status`, `is_tutor`, `sort`, `user_course_cat`, `legal_agreement`, `progress`) VALUES
(1, 1, 1, 0, 1, 1, 0, 0, NULL, 0),
(2, 4, 1, 0, 5, 0, 1, 0, NULL, 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `course_rel_user_catalogue`
--

CREATE TABLE `course_rel_user_catalogue` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `c_id` int(11) DEFAULT NULL,
  `visible` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `course_request`
--

CREATE TABLE `course_request` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `code` varchar(40) NOT NULL,
  `course_language` varchar(20) NOT NULL,
  `title` varchar(250) NOT NULL,
  `description` longtext DEFAULT NULL,
  `category_code` varchar(40) DEFAULT NULL,
  `tutor_name` varchar(200) DEFAULT NULL,
  `visual_code` varchar(40) DEFAULT NULL,
  `request_date` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `objetives` longtext DEFAULT NULL,
  `target_audience` longtext DEFAULT NULL,
  `status` int(11) NOT NULL,
  `info` int(11) NOT NULL,
  `exemplary_content` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `course_type`
--

CREATE TABLE `course_type` (
  `id` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `translation_var` varchar(40) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `props` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `course_type`
--

INSERT INTO `course_type` (`id`, `title`, `translation_var`, `description`, `props`) VALUES
(1, 'All tools', NULL, NULL, NULL),
(2, 'Entry exam', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_announcement`
--

CREATE TABLE `c_announcement` (
  `iid` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `title` longtext NOT NULL,
  `content` longtext DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `email_sent` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `c_announcement`
--

INSERT INTO `c_announcement` (`iid`, `resource_node_id`, `title`, `content`, `end_date`, `email_sent`) VALUES
(1, 48, 'This is an announcement example', 'This is an announcement example. Only trainers are allowed to publish announcements.', '2025-11-21', NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_announcement_attachment`
--

CREATE TABLE `c_announcement_attachment` (
  `iid` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `announcement_id` int(11) DEFAULT NULL,
  `path` varchar(255) NOT NULL,
  `comment` longtext DEFAULT NULL,
  `size` int(11) NOT NULL,
  `filename` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_attendance`
--

CREATE TABLE `c_attendance` (
  `iid` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `title` longtext NOT NULL,
  `description` longtext DEFAULT NULL,
  `active` int(11) NOT NULL,
  `attendance_qualify_title` varchar(255) DEFAULT NULL,
  `attendance_qualify_max` int(11) NOT NULL,
  `attendance_weight` double NOT NULL,
  `locked` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_attendance_calendar`
--

CREATE TABLE `c_attendance_calendar` (
  `iid` int(11) NOT NULL,
  `attendance_id` int(11) DEFAULT NULL,
  `date_time` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `done_attendance` tinyint(1) NOT NULL,
  `blocked` tinyint(1) NOT NULL,
  `duration` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_attendance_calendar_rel_group`
--

CREATE TABLE `c_attendance_calendar_rel_group` (
  `iid` int(11) NOT NULL,
  `group_id` int(11) DEFAULT NULL,
  `calendar_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_attendance_result`
--

CREATE TABLE `c_attendance_result` (
  `iid` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `attendance_id` int(11) DEFAULT NULL,
  `score` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_attendance_result_comment`
--

CREATE TABLE `c_attendance_result_comment` (
  `iid` int(11) NOT NULL,
  `attendance_sheet_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `comment` longtext DEFAULT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `author_user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_attendance_sheet`
--

CREATE TABLE `c_attendance_sheet` (
  `iid` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `attendance_calendar_id` int(11) DEFAULT NULL,
  `presence` int(11) DEFAULT NULL,
  `signature` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_attendance_sheet_log`
--

CREATE TABLE `c_attendance_sheet_log` (
  `iid` int(11) NOT NULL,
  `attendance_id` int(11) DEFAULT NULL,
  `lastedit_user_id` int(11) DEFAULT NULL,
  `lastedit_date` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `lastedit_type` varchar(200) NOT NULL,
  `calendar_date_value` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_autogroup_user_invitation`
--

CREATE TABLE `c_autogroup_user_invitation` (
  `id` int(11) NOT NULL,
  `group_category_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `confirm` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_blog`
--

CREATE TABLE `c_blog` (
  `iid` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `title` longtext NOT NULL,
  `blog_subtitle` varchar(250) DEFAULT NULL,
  `date_creation` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_blog_attachment`
--

CREATE TABLE `c_blog_attachment` (
  `iid` int(11) NOT NULL,
  `blog_id` int(11) DEFAULT NULL,
  `post_id` int(11) DEFAULT NULL,
  `comment_id` int(11) DEFAULT NULL,
  `path` varchar(255) NOT NULL,
  `comment` longtext DEFAULT NULL,
  `size` int(11) NOT NULL,
  `filename` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_blog_comment`
--

CREATE TABLE `c_blog_comment` (
  `iid` int(11) NOT NULL,
  `author_id` int(11) DEFAULT NULL,
  `blog_id` int(11) DEFAULT NULL,
  `post_id` int(11) NOT NULL,
  `parent_comment_id` int(11) DEFAULT NULL,
  `comment_id` int(11) NOT NULL DEFAULT 0,
  `title` varchar(250) NOT NULL,
  `comment` longtext NOT NULL,
  `date_creation` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_blog_post`
--

CREATE TABLE `c_blog_post` (
  `iid` int(11) NOT NULL,
  `author_id` int(11) DEFAULT NULL,
  `blog_id` int(11) DEFAULT NULL,
  `title` varchar(250) NOT NULL,
  `full_text` longtext NOT NULL,
  `date_creation` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_blog_rating`
--

CREATE TABLE `c_blog_rating` (
  `iid` int(11) NOT NULL,
  `blog_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `post_id` int(11) NOT NULL,
  `rating_type` varchar(40) NOT NULL,
  `rating` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_blog_rel_user`
--

CREATE TABLE `c_blog_rel_user` (
  `iid` int(11) NOT NULL,
  `blog_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_blog_task`
--

CREATE TABLE `c_blog_task` (
  `iid` int(11) NOT NULL,
  `blog_id` int(11) NOT NULL,
  `author_id` int(11) DEFAULT NULL,
  `task_id` int(11) NOT NULL DEFAULT 0,
  `title` varchar(250) NOT NULL,
  `description` longtext DEFAULT NULL,
  `color` varchar(10) NOT NULL DEFAULT '#0ea5e9',
  `system_task` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_blog_task_rel_user`
--

CREATE TABLE `c_blog_task_rel_user` (
  `iid` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `blog_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `target_date` date NOT NULL,
  `status` smallint(6) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_calendar_event`
--

CREATE TABLE `c_calendar_event` (
  `iid` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `parent_event_id` int(11) DEFAULT NULL,
  `room_id` int(11) DEFAULT NULL,
  `career_id` int(11) DEFAULT NULL,
  `promotion_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `content` longtext DEFAULT NULL,
  `start_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `end_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `all_day` tinyint(1) NOT NULL,
  `comment` longtext DEFAULT NULL,
  `color` varchar(20) DEFAULT NULL,
  `invitation_type` varchar(255) DEFAULT NULL,
  `collective` tinyint(1) NOT NULL,
  `subscription_visibility` int(11) NOT NULL,
  `subscription_item_id` int(11) DEFAULT NULL,
  `max_attendees` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `c_calendar_event`
--

INSERT INTO `c_calendar_event` (`iid`, `resource_node_id`, `parent_event_id`, `room_id`, `career_id`, `promotion_id`, `title`, `content`, `start_date`, `end_date`, `all_day`, `comment`, `color`, `invitation_type`, `collective`, `subscription_visibility`, `subscription_item_id`, `max_attendees`) VALUES
(1, 45, NULL, NULL, NULL, NULL, 'Course creation', 'This course was created at this time', '2025-11-21 21:28:42', '2025-11-21 21:28:42', 0, '', '', NULL, 0, 0, NULL, 0),
(2, 80, NULL, NULL, NULL, NULL, 'dsdsds', '<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body>\n<div class=\"tiny-content\"><p>fdssdss</p></div>\n</body>\n</html>', '2025-11-19 00:45:00', '2025-11-27 00:45:00', 0, NULL, '#4682B4', NULL, 0, 0, NULL, 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_calendar_event_attachment`
--

CREATE TABLE `c_calendar_event_attachment` (
  `iid` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `agenda_id` int(11) DEFAULT NULL,
  `comment` longtext DEFAULT NULL,
  `filename` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_calendar_event_repeat`
--

CREATE TABLE `c_calendar_event_repeat` (
  `iid` int(11) NOT NULL,
  `cal_id` int(11) DEFAULT NULL,
  `cal_type` varchar(20) DEFAULT NULL,
  `cal_end` int(11) DEFAULT NULL,
  `cal_frequency` int(11) DEFAULT NULL,
  `cal_days` varchar(7) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_calendar_event_repeat_not`
--

CREATE TABLE `c_calendar_event_repeat_not` (
  `iid` int(11) NOT NULL,
  `cal_id` int(11) DEFAULT NULL,
  `cal_date` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_chat_connected`
--

CREATE TABLE `c_chat_connected` (
  `iid` int(11) NOT NULL,
  `c_id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `to_group_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `last_connection` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `c_chat_connected`
--

INSERT INTO `c_chat_connected` (`iid`, `c_id`, `session_id`, `to_group_id`, `user_id`, `last_connection`) VALUES
(1, 1, 1, 0, 4, '2025-11-21 22:45:52'),
(3, 1, 0, 0, 4, '2025-11-22 00:41:01');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_chat_conversation`
--

CREATE TABLE `c_chat_conversation` (
  `id` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `c_chat_conversation`
--

INSERT INTO `c_chat_conversation` (`id`, `resource_node_id`, `title`) VALUES
(1, 57, 'messages-2025-11-21_sid-1-log.html'),
(2, 58, 'messages-2025-11-21_sid-1-log.html'),
(3, 61, 'messages-2025-11-21_uid-1-1-log.html'),
(4, 62, 'messages-2025-11-21_uid-1-1-log.html'),
(5, 65, 'messages-2025-11-21-log.html'),
(6, 66, 'messages-2025-11-21-log.html'),
(7, 71, 'messages-2025-11-22_uid-1-4-log.html'),
(8, 72, 'messages-2025-11-22_uid-1-4-log.html'),
(9, 75, 'messages-2025-11-22-log.html'),
(10, 76, 'messages-2025-11-22-log.html');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_course_description`
--

CREATE TABLE `c_course_description` (
  `iid` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `title` longtext DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `description_type` int(11) NOT NULL,
  `progress` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_course_setting`
--

CREATE TABLE `c_course_setting` (
  `iid` int(11) NOT NULL,
  `c_id` int(11) NOT NULL,
  `variable` varchar(255) NOT NULL,
  `subkey` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `value` longtext DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `subkeytext` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `c_course_setting`
--

INSERT INTO `c_course_setting` (`iid`, `c_id`, `variable`, `subkey`, `type`, `category`, `value`, `title`, `comment`, `subkeytext`) VALUES
(1, 1, 'email_alert_manager_on_new_doc', NULL, NULL, 'work', '0', '', NULL, NULL),
(2, 1, 'email_alert_on_new_doc_dropbox', NULL, NULL, 'dropbox', '0', '', NULL, NULL),
(3, 1, 'allow_user_edit_agenda', NULL, NULL, 'agenda', '0', '', NULL, NULL),
(4, 1, 'allow_user_edit_announcement', NULL, NULL, 'announcement', '0', '', NULL, NULL),
(5, 1, 'email_alert_manager_on_new_quiz', NULL, NULL, 'quiz', '1', '', NULL, NULL),
(6, 1, 'allow_user_image_forum', NULL, NULL, 'forum', '1', '', NULL, NULL),
(7, 1, 'course_theme', NULL, NULL, 'theme', '', '', NULL, NULL),
(8, 1, 'allow_learning_path_theme', NULL, NULL, 'theme', '1', '', NULL, NULL),
(9, 1, 'allow_open_chat_window', NULL, NULL, 'chat', '1', '', NULL, NULL),
(10, 1, 'email_alert_to_teacher_on_new_user_in_course', NULL, NULL, 'registration', '0', '', NULL, NULL),
(11, 1, 'allow_user_view_user_list', NULL, NULL, 'user', '1', '', NULL, NULL),
(12, 1, 'display_info_advance_inside_homecourse', NULL, NULL, 'thematic_advance', '1', '', NULL, NULL),
(13, 1, 'email_alert_students_on_new_homework', NULL, NULL, 'work', '0', '', NULL, NULL),
(14, 1, 'enable_lp_auto_launch', NULL, NULL, 'learning_path', '0', '', NULL, NULL),
(15, 1, 'enable_exercise_auto_launch', NULL, NULL, 'exercise', '0', '', NULL, NULL),
(16, 1, 'enable_document_auto_launch', NULL, NULL, 'document', '0', '', NULL, NULL),
(17, 1, 'pdf_export_watermark_text', NULL, NULL, 'learning_path', '', '', NULL, NULL),
(18, 1, 'allow_public_certificates', NULL, NULL, 'certificates', '', '', NULL, NULL),
(19, 1, 'documents_default_visibility', NULL, NULL, 'document', 'visible', '', NULL, NULL),
(20, 1, 'show_course_in_user_language', NULL, NULL, '', '2', '', NULL, NULL),
(21, 1, 'email_to_teachers_on_new_work_feedback', NULL, NULL, '', '1', '', NULL, NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_document`
--

CREATE TABLE `c_document` (
  `iid` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `comment` longtext DEFAULT NULL,
  `filetype` varchar(15) NOT NULL,
  `readonly` tinyint(1) NOT NULL,
  `template` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `c_document`
--

INSERT INTO `c_document` (`iid`, `resource_node_id`, `title`, `comment`, `filetype`, `readonly`, `template`) VALUES
(1, 34, 'Audio', NULL, 'folder', 0, 0),
(2, 35, 'Images', NULL, 'folder', 0, 0),
(3, 36, 'Gallery', NULL, 'folder', 0, 0),
(4, 37, 'Video', NULL, 'folder', 0, 0),
(5, 38, 'mr_chamilo', '', 'folder', 0, 0),
(6, 39, 'svg', '', 'folder', 0, 0),
(7, 40, 'collaborative.svg', '', 'file', 0, 0),
(8, 41, 'teaching.svg', '', 'file', 0, 0),
(9, 42, 'doubts.png', '', 'file', 0, 0),
(10, 43, 'collaborative.png', '', 'file', 0, 0),
(11, 44, 'ListeningComprehension.mp3', '', 'file', 0, 0),
(12, 55, 'chat_conversations', '', 'folder', 0, 0),
(13, 59, 'messages-2025-11-21_sid-1-log.html', 'Daily chat copy', 'file', 0, 0),
(14, 63, 'messages-2025-11-21_uid-1-1-log.html', 'Daily chat copy', 'file', 0, 0),
(15, 67, 'messages-2025-11-21-log.html', 'Daily chat copy', 'file', 0, 0),
(16, 73, 'messages-2025-11-22_uid-1-4-log.html', 'Daily chat copy', 'file', 0, 0),
(17, 77, 'messages-2025-11-22-log.html', 'Daily chat copy', 'file', 0, 0),
(18, 81, 'Default certificate', NULL, 'certificate', 0, 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_dropbox_category`
--

CREATE TABLE `c_dropbox_category` (
  `iid` int(11) NOT NULL,
  `c_id` int(11) NOT NULL,
  `cat_id` int(11) NOT NULL,
  `title` longtext NOT NULL,
  `received` tinyint(1) NOT NULL,
  `sent` tinyint(1) NOT NULL,
  `user_id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_dropbox_feedback`
--

CREATE TABLE `c_dropbox_feedback` (
  `iid` int(11) NOT NULL,
  `c_id` int(11) NOT NULL,
  `feedback_id` int(11) NOT NULL,
  `file_id` int(11) NOT NULL,
  `author_user_id` int(11) NOT NULL,
  `feedback` longtext NOT NULL,
  `feedback_date` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_dropbox_file`
--

CREATE TABLE `c_dropbox_file` (
  `iid` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `c_id` int(11) NOT NULL DEFAULT 0,
  `uploader_id` int(11) NOT NULL,
  `filename` varchar(190) NOT NULL,
  `filesize` int(11) NOT NULL DEFAULT 0,
  `title` varchar(255) NOT NULL,
  `description` varchar(250) DEFAULT NULL,
  `author` varchar(250) DEFAULT NULL,
  `upload_date` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `last_upload_date` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `cat_id` int(11) NOT NULL DEFAULT 0,
  `session_id` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_dropbox_person`
--

CREATE TABLE `c_dropbox_person` (
  `iid` int(11) NOT NULL,
  `c_id` int(11) NOT NULL,
  `file_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_dropbox_post`
--

CREATE TABLE `c_dropbox_post` (
  `iid` int(11) NOT NULL,
  `feedback_date` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `feedback` longtext DEFAULT NULL,
  `cat_id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `c_id` int(11) NOT NULL,
  `file_id` int(11) NOT NULL,
  `dest_user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_forum_attachment`
--

CREATE TABLE `c_forum_attachment` (
  `iid` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `post_id` int(11) DEFAULT NULL,
  `c_id` int(11) NOT NULL,
  `path` varchar(255) NOT NULL,
  `comment` longtext DEFAULT NULL,
  `size` int(11) NOT NULL,
  `filename` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_forum_category`
--

CREATE TABLE `c_forum_category` (
  `iid` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `cat_comment` longtext DEFAULT NULL,
  `locked` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `c_forum_category`
--

INSERT INTO `c_forum_category` (`iid`, `resource_node_id`, `title`, `cat_comment`, `locked`) VALUES
(1, 49, 'Example Forum Category', '', 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_forum_forum`
--

CREATE TABLE `c_forum_forum` (
  `iid` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `forum_last_post` int(11) DEFAULT NULL,
  `forum_category` int(11) DEFAULT NULL,
  `lp_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `forum_comment` longtext DEFAULT NULL,
  `forum_threads` int(11) DEFAULT NULL,
  `forum_posts` int(11) DEFAULT NULL,
  `allow_anonymous` int(11) DEFAULT NULL,
  `allow_edit` int(11) DEFAULT NULL,
  `approval_direct_post` varchar(20) DEFAULT NULL,
  `allow_attachments` int(11) DEFAULT NULL,
  `allow_new_threads` int(11) DEFAULT NULL,
  `default_view` varchar(20) DEFAULT NULL,
  `forum_of_group` varchar(20) DEFAULT NULL,
  `forum_group_public_private` varchar(20) DEFAULT NULL,
  `locked` int(11) NOT NULL,
  `forum_image` varchar(255) NOT NULL,
  `start_time` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `end_time` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `moderated` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `c_forum_forum`
--

INSERT INTO `c_forum_forum` (`iid`, `resource_node_id`, `forum_last_post`, `forum_category`, `lp_id`, `title`, `forum_comment`, `forum_threads`, `forum_posts`, `allow_anonymous`, `allow_edit`, `approval_direct_post`, `allow_attachments`, `allow_new_threads`, `default_view`, `forum_of_group`, `forum_group_public_private`, `locked`, `forum_image`, `start_time`, `end_time`, `moderated`) VALUES
(1, 50, NULL, 1, NULL, 'Example Forum', '<p>ferererer</p>', NULL, 0, 0, 0, '0', 0, 0, 'flat', '0', 'public', 0, '', '2025-11-22 00:59:00', '2025-11-29 00:59:00', 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_forum_mailcue`
--

CREATE TABLE `c_forum_mailcue` (
  `iid` int(11) NOT NULL,
  `c_id` int(11) NOT NULL,
  `thread_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_forum_notification`
--

CREATE TABLE `c_forum_notification` (
  `iid` int(11) NOT NULL,
  `c_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `forum_id` int(11) NOT NULL,
  `thread_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `c_forum_notification`
--

INSERT INTO `c_forum_notification` (`iid`, `c_id`, `user_id`, `forum_id`, `thread_id`, `post_id`) VALUES
(1, 1, 4, 1, 0, 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_forum_post`
--

CREATE TABLE `c_forum_post` (
  `iid` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `thread_id` int(11) DEFAULT NULL,
  `forum_id` int(11) DEFAULT NULL,
  `poster_id` int(11) DEFAULT NULL,
  `post_parent_id` int(11) DEFAULT NULL,
  `title` varchar(250) NOT NULL,
  `post_text` longtext DEFAULT NULL,
  `post_date` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `post_notification` tinyint(1) DEFAULT NULL,
  `visible` tinyint(1) NOT NULL,
  `status` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `c_forum_post`
--

INSERT INTO `c_forum_post` (`iid`, `resource_node_id`, `thread_id`, `forum_id`, `poster_id`, `post_parent_id`, `title`, `post_text`, `post_date`, `post_notification`, `visible`, `status`) VALUES
(1, 52, 1, 1, 1, NULL, 'Example Thread', 'Example content', '2025-11-21 22:28:42', 0, 1, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_forum_thread`
--

CREATE TABLE `c_forum_thread` (
  `iid` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `forum_id` int(11) DEFAULT NULL,
  `thread_poster_id` int(11) DEFAULT NULL,
  `thread_last_post` int(11) DEFAULT NULL,
  `lp_item_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `thread_date` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `thread_replies` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `thread_views` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `thread_sticky` tinyint(1) NOT NULL,
  `locked` int(11) NOT NULL,
  `thread_title_qualify` varchar(255) DEFAULT NULL,
  `thread_qualify_max` double NOT NULL,
  `thread_close_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `thread_weight` double NOT NULL,
  `thread_peer_qualify` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `c_forum_thread`
--

INSERT INTO `c_forum_thread` (`iid`, `resource_node_id`, `forum_id`, `thread_poster_id`, `thread_last_post`, `lp_item_id`, `title`, `thread_date`, `thread_replies`, `thread_views`, `thread_sticky`, `locked`, `thread_title_qualify`, `thread_qualify_max`, `thread_close_date`, `thread_weight`, `thread_peer_qualify`) VALUES
(1, 51, 1, 1, 1, NULL, 'Example Thread', '2025-11-21 22:28:42', 0, 1, 0, 0, '', 0, NULL, 0, 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_forum_thread_qualify`
--

CREATE TABLE `c_forum_thread_qualify` (
  `iid` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `thread_id` int(11) DEFAULT NULL,
  `qualify_user_id` int(11) DEFAULT NULL,
  `c_id` int(11) NOT NULL,
  `qualify` double NOT NULL,
  `qualify_time` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_forum_thread_qualify_log`
--

CREATE TABLE `c_forum_thread_qualify_log` (
  `iid` int(11) NOT NULL,
  `c_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `thread_id` int(11) NOT NULL,
  `qualify` double NOT NULL,
  `qualify_user_id` int(11) DEFAULT NULL,
  `qualify_time` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `session_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_glossary`
--

CREATE TABLE `c_glossary` (
  `iid` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `title` longtext NOT NULL,
  `description` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_group_category`
--

CREATE TABLE `c_group_category` (
  `iid` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `peer_assessment` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `doc_state` tinyint(1) NOT NULL,
  `calendar_state` tinyint(1) NOT NULL,
  `work_state` tinyint(1) NOT NULL,
  `announcements_state` tinyint(1) NOT NULL,
  `forum_state` tinyint(1) NOT NULL,
  `wiki_state` tinyint(1) NOT NULL,
  `chat_state` tinyint(1) NOT NULL,
  `max_student` int(11) NOT NULL,
  `self_reg_allowed` tinyint(1) NOT NULL,
  `self_unreg_allowed` tinyint(1) NOT NULL,
  `groups_per_user` int(11) NOT NULL,
  `document_access` int(11) NOT NULL DEFAULT 0,
  `min_student` int(11) DEFAULT NULL,
  `begin_inscription_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `end_inscription_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `only_me` tinyint(1) NOT NULL DEFAULT 0,
  `allow_coach_change_options_groups` tinyint(1) NOT NULL DEFAULT 0,
  `allow_change_group_name` int(11) DEFAULT 1,
  `allow_autogroup` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `c_group_category`
--

INSERT INTO `c_group_category` (`iid`, `resource_node_id`, `peer_assessment`, `title`, `description`, `doc_state`, `calendar_state`, `work_state`, `announcements_state`, `forum_state`, `wiki_state`, `chat_state`, `max_student`, `self_reg_allowed`, `self_unreg_allowed`, `groups_per_user`, `document_access`, `min_student`, `begin_inscription_date`, `end_inscription_date`, `only_me`, `allow_coach_change_options_groups`, `allow_change_group_name`, `allow_autogroup`) VALUES
(1, 33, NULL, 'Default groups', '', 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, NULL, NULL, NULL, 0, 0, 1, 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_group_category_rel_user`
--

CREATE TABLE `c_group_category_rel_user` (
  `id` int(11) NOT NULL,
  `group_category_id` int(11) NOT NULL,
  `population_type` smallint(6) NOT NULL,
  `population_id` int(11) NOT NULL,
  `status_in_category` smallint(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_group_info`
--

CREATE TABLE `c_group_info` (
  `iid` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `title` varchar(100) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `description` longtext DEFAULT NULL,
  `max_student` int(11) NOT NULL,
  `doc_state` int(11) NOT NULL,
  `calendar_state` int(11) NOT NULL,
  `work_state` int(11) NOT NULL,
  `announcements_state` int(11) NOT NULL,
  `forum_state` int(11) NOT NULL,
  `wiki_state` int(11) NOT NULL,
  `chat_state` int(11) NOT NULL,
  `self_registration_allowed` tinyint(1) NOT NULL,
  `self_unregistration_allowed` tinyint(1) NOT NULL,
  `document_access` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_group_rel_tutor`
--

CREATE TABLE `c_group_rel_tutor` (
  `iid` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `c_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_group_rel_user`
--

CREATE TABLE `c_group_rel_user` (
  `iid` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `c_id` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `role` varchar(50) NOT NULL,
  `ready_autogroup` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_group_rel_usergroup`
--

CREATE TABLE `c_group_rel_usergroup` (
  `id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `usergroup_id` int(11) NOT NULL,
  `session_id` int(11) DEFAULT NULL,
  `c_id` int(11) DEFAULT NULL,
  `ready_autogroup` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_link`
--

CREATE TABLE `c_link` (
  `iid` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `custom_image_id` binary(16) DEFAULT NULL COMMENT '(DC2Type:uuid)',
  `url` longtext NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext DEFAULT NULL,
  `target` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `c_link`
--

INSERT INTO `c_link` (`iid`, `resource_node_id`, `category_id`, `custom_image_id`, `url`, `title`, `description`, `target`) VALUES
(1, 46, NULL, NULL, 'http://www.google.com', 'Quick and powerful search engine', 'Quick and powerful search engine', '_self'),
(2, 47, NULL, NULL, 'http://www.wikipedia.org', 'Free online encyclopedia', 'Free online encyclopedia', '_self');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_link_category`
--

CREATE TABLE `c_link_category` (
  `iid` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_lp`
--

CREATE TABLE `c_lp` (
  `iid` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `asset_id` binary(16) DEFAULT NULL COMMENT '(DC2Type:uuid)',
  `lp_type` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `ref` longtext DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `path` longtext NOT NULL,
  `force_commit` tinyint(1) NOT NULL,
  `default_view_mod` varchar(32) NOT NULL DEFAULT 'embedded',
  `default_encoding` varchar(32) NOT NULL DEFAULT 'UTF-8',
  `content_maker` longtext NOT NULL,
  `content_local` varchar(32) NOT NULL DEFAULT 'local',
  `content_license` longtext NOT NULL,
  `prevent_reinit` tinyint(1) NOT NULL DEFAULT 1,
  `js_lib` longtext NOT NULL,
  `debug` tinyint(1) NOT NULL,
  `theme` varchar(255) NOT NULL,
  `author` longtext NOT NULL,
  `prerequisite` int(11) NOT NULL,
  `hide_toc_frame` tinyint(1) NOT NULL,
  `seriousgame_mode` tinyint(1) NOT NULL,
  `use_max_score` int(11) NOT NULL DEFAULT 1,
  `autolaunch` int(11) NOT NULL,
  `max_attempts` int(11) NOT NULL,
  `subscribe_users` int(11) NOT NULL,
  `created_on` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `modified_on` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `published_on` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `expired_on` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `accumulate_scorm_time` int(11) NOT NULL DEFAULT 1,
  `accumulate_work_time` int(11) NOT NULL DEFAULT 0,
  `next_lp_id` int(11) NOT NULL DEFAULT 0,
  `subscribe_user_by_date` tinyint(1) NOT NULL DEFAULT 0,
  `display_not_allowed_lp` tinyint(1) DEFAULT 0,
  `duration` int(11) DEFAULT NULL,
  `auto_forward_video` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_lp_category`
--

CREATE TABLE `c_lp_category` (
  `iid` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `title` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_lp_category_rel_user`
--

CREATE TABLE `c_lp_category_rel_user` (
  `id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_lp_item`
--

CREATE TABLE `c_lp_item` (
  `iid` int(11) NOT NULL,
  `lp_id` int(11) DEFAULT NULL,
  `item_root` int(11) DEFAULT NULL,
  `parent_item_id` int(11) DEFAULT NULL,
  `title` varchar(511) NOT NULL,
  `item_type` varchar(32) NOT NULL,
  `ref` longtext NOT NULL,
  `description` varchar(511) DEFAULT NULL,
  `path` longtext NOT NULL,
  `min_score` double NOT NULL,
  `max_score` double DEFAULT 100,
  `mastery_score` double DEFAULT NULL,
  `display_order` int(11) NOT NULL,
  `prerequisite` longtext DEFAULT NULL,
  `parameters` longtext DEFAULT NULL,
  `launch_data` longtext NOT NULL,
  `max_time_allowed` varchar(13) DEFAULT NULL,
  `terms` longtext DEFAULT NULL,
  `search_did` int(11) DEFAULT NULL,
  `audio` varchar(250) DEFAULT NULL,
  `prerequisite_min_score` double DEFAULT NULL,
  `prerequisite_max_score` double DEFAULT NULL,
  `previous_item_id` int(11) DEFAULT NULL,
  `next_item_id` int(11) DEFAULT NULL,
  `lvl` int(11) NOT NULL,
  `duration` int(11) DEFAULT NULL,
  `export_allowed` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_lp_item_view`
--

CREATE TABLE `c_lp_item_view` (
  `iid` int(11) NOT NULL,
  `lp_item_id` int(11) DEFAULT NULL,
  `lp_view_id` int(11) DEFAULT NULL,
  `view_count` int(11) NOT NULL,
  `start_time` int(11) NOT NULL,
  `total_time` int(11) NOT NULL,
  `score` double NOT NULL,
  `status` varchar(32) NOT NULL DEFAULT 'not attempted',
  `suspend_data` longtext DEFAULT NULL,
  `lesson_location` longtext DEFAULT NULL,
  `core_exit` varchar(32) NOT NULL DEFAULT 'none',
  `max_score` varchar(8) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_lp_iv_interaction`
--

CREATE TABLE `c_lp_iv_interaction` (
  `iid` int(11) NOT NULL,
  `c_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `lp_iv_id` int(11) NOT NULL,
  `interaction_id` varchar(255) NOT NULL,
  `interaction_type` varchar(255) NOT NULL,
  `weighting` double NOT NULL,
  `completion_time` varchar(16) NOT NULL,
  `correct_responses` longtext NOT NULL,
  `student_response` longtext NOT NULL,
  `result` varchar(255) NOT NULL,
  `latency` varchar(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_lp_iv_objective`
--

CREATE TABLE `c_lp_iv_objective` (
  `iid` int(11) NOT NULL,
  `c_id` int(11) NOT NULL,
  `lp_iv_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `objective_id` varchar(255) NOT NULL,
  `score_raw` double NOT NULL,
  `score_max` double NOT NULL,
  `score_min` double NOT NULL,
  `status` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_lp_rel_user`
--

CREATE TABLE `c_lp_rel_user` (
  `iid` int(11) NOT NULL,
  `lp_id` int(11) NOT NULL,
  `c_id` int(11) NOT NULL,
  `session_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `creator_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `start_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `end_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `is_open_without_date` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_lp_rel_usergroup`
--

CREATE TABLE `c_lp_rel_usergroup` (
  `id` int(11) NOT NULL,
  `lp_id` int(11) DEFAULT NULL,
  `c_id` int(11) NOT NULL,
  `session_id` int(11) DEFAULT NULL,
  `usergroup_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_lp_user_access`
--

CREATE TABLE `c_lp_user_access` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `lp_id` int(11) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `end_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `is_open_without_date` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_lp_view`
--

CREATE TABLE `c_lp_view` (
  `iid` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `lp_id` int(11) DEFAULT NULL,
  `c_id` int(11) DEFAULT NULL,
  `session_id` int(11) DEFAULT NULL,
  `view_count` int(11) NOT NULL,
  `last_item` int(11) NOT NULL,
  `progress` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_notebook`
--

CREATE TABLE `c_notebook` (
  `iid` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `creation_date` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `update_date` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `status` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_peer_assessment`
--

CREATE TABLE `c_peer_assessment` (
  `id` int(11) NOT NULL,
  `c_id` int(11) DEFAULT NULL,
  `group_category_id` int(11) DEFAULT NULL,
  `max_correction_per_student` int(11) DEFAULT 0,
  `state` int(11) DEFAULT 0,
  `start_work_repository_option` int(11) DEFAULT 0,
  `end_work_repository_option` int(11) DEFAULT NULL,
  `start_correction_option` int(11) DEFAULT 0,
  `end_correction_option` int(11) DEFAULT 0,
  `distribute_correction_option` int(11) NOT NULL DEFAULT 0,
  `end_repository_option` int(11) DEFAULT NULL,
  `examiner_role_condition` tinyint(1) DEFAULT 0,
  `student_access_to_correction` tinyint(1) DEFAULT 0,
  `comment_constraint` tinyint(1) DEFAULT 0,
  `correct_own_work` tinyint(1) DEFAULT 0,
  `correct_benchmark_work` tinyint(1) DEFAULT 0,
  `distribution_algorithm` tinyint(1) DEFAULT 0,
  `send_work_start_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `send_work_end_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `start_correction_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `end_correction_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_peer_assessment_correction`
--

CREATE TABLE `c_peer_assessment_correction` (
  `id` int(11) NOT NULL,
  `peer_assessment_id` int(11) DEFAULT NULL,
  `student_group_id` int(11) DEFAULT NULL,
  `examiner_id` int(11) DEFAULT NULL,
  `examiner_group_id` int(11) DEFAULT NULL,
  `total_score` int(11) DEFAULT NULL,
  `maximum_score` int(11) DEFAULT NULL,
  `delivered` tinyint(1) DEFAULT NULL,
  `examiner_folder_id` int(11) DEFAULT NULL,
  `examiner_document_id` int(11) DEFAULT NULL,
  `completed` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_peer_assessment_correction_criteria`
--

CREATE TABLE `c_peer_assessment_correction_criteria` (
  `id` int(11) NOT NULL,
  `peer_assessment_correction_id` int(11) DEFAULT NULL,
  `peer_assessment_criteria_id` int(11) DEFAULT NULL,
  `comment` longtext DEFAULT NULL,
  `score` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_peer_assessment_criteria`
--

CREATE TABLE `c_peer_assessment_criteria` (
  `id` int(11) NOT NULL,
  `peer_assessment_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `position` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_peer_assessment_log`
--

CREATE TABLE `c_peer_assessment_log` (
  `id` int(11) NOT NULL,
  `peer_assessment_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_peer_assessment_rel_student_publication`
--

CREATE TABLE `c_peer_assessment_rel_student_publication` (
  `id` int(11) NOT NULL,
  `peer_assessment_id` int(11) DEFAULT NULL,
  `student_publication_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `student_publication_folder_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_peer_autogroup_rel_student_publication`
--

CREATE TABLE `c_peer_autogroup_rel_student_publication` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `student_publication_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `peer_autogroup_id` int(11) DEFAULT NULL,
  `vote` tinyint(1) DEFAULT 0,
  `date_vote` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `student_publication_parent_id` int(11) DEFAULT NULL,
  `student_publication_folder_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_plagiarism_compilatio_docs`
--

CREATE TABLE `c_plagiarism_compilatio_docs` (
  `id` int(11) NOT NULL,
  `c_id` int(11) NOT NULL,
  `document_id` int(11) NOT NULL,
  `compilatio_id` varchar(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_quiz`
--

CREATE TABLE `c_quiz` (
  `iid` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `quiz_category_id` int(11) DEFAULT NULL,
  `title` longtext NOT NULL,
  `description` longtext DEFAULT NULL,
  `sound` varchar(255) DEFAULT NULL,
  `type` int(11) NOT NULL,
  `random` int(11) NOT NULL,
  `random_answers` tinyint(1) NOT NULL,
  `results_disabled` int(11) NOT NULL,
  `access_condition` longtext DEFAULT NULL,
  `max_attempt` int(11) NOT NULL,
  `start_time` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `end_time` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `feedback_type` int(11) NOT NULL,
  `expired_time` int(11) NOT NULL,
  `propagate_neg` int(11) NOT NULL,
  `save_correct_answers` int(11) DEFAULT NULL,
  `review_answers` int(11) NOT NULL,
  `random_by_category` int(11) NOT NULL,
  `text_when_finished` longtext DEFAULT NULL,
  `text_when_finished_failure` longtext DEFAULT NULL,
  `display_category_name` int(11) NOT NULL,
  `pass_percentage` int(11) DEFAULT NULL,
  `prevent_backwards` int(11) NOT NULL DEFAULT 0,
  `question_selection_type` int(11) DEFAULT NULL,
  `hide_question_number` int(11) NOT NULL DEFAULT 0,
  `hide_question_title` tinyint(1) NOT NULL,
  `show_previous_button` tinyint(1) NOT NULL DEFAULT 1,
  `notifications` varchar(255) DEFAULT NULL,
  `autolaunch` tinyint(1) DEFAULT 0,
  `hide_attempts_table` tinyint(1) NOT NULL DEFAULT 0,
  `page_result_configuration` longtext NOT NULL COMMENT '(DC2Type:array)',
  `display_chart_degree_certainty` int(11) NOT NULL DEFAULT 0,
  `send_email_chart_degree_certainty` int(11) NOT NULL DEFAULT 0,
  `not_display_balance_percentage_categorie_question` int(11) NOT NULL DEFAULT 0,
  `display_chart_degree_certainty_category` int(11) NOT NULL DEFAULT 0,
  `gather_questions_categories` int(11) NOT NULL DEFAULT 0,
  `duration` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `c_quiz`
--

INSERT INTO `c_quiz` (`iid`, `resource_node_id`, `quiz_category_id`, `title`, `description`, `sound`, `type`, `random`, `random_answers`, `results_disabled`, `access_condition`, `max_attempt`, `start_time`, `end_time`, `feedback_type`, `expired_time`, `propagate_neg`, `save_correct_answers`, `review_answers`, `random_by_category`, `text_when_finished`, `text_when_finished_failure`, `display_category_name`, `pass_percentage`, `prevent_backwards`, `question_selection_type`, `hide_question_number`, `hide_question_title`, `show_previous_button`, `notifications`, `autolaunch`, `hide_attempts_table`, `page_result_configuration`, `display_chart_degree_certainty`, `send_email_chart_degree_certainty`, `not_display_balance_percentage_categorie_question`, `display_chart_degree_certainty_category`, `gather_questions_categories`, `duration`) VALUES
(1, 78, NULL, 'sym', '', '', 2, 0, 0, 0, NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, '', '', 1, 0, 0, 1, 0, 0, 1, '', 0, 0, 'a:0:{}', 0, 0, 0, 0, 0, NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_quiz_answer`
--

CREATE TABLE `c_quiz_answer` (
  `iid` int(10) UNSIGNED NOT NULL,
  `question_id` int(11) DEFAULT NULL,
  `answer` longtext NOT NULL,
  `correct` int(11) DEFAULT NULL,
  `comment` longtext DEFAULT NULL,
  `ponderation` double NOT NULL DEFAULT 0,
  `position` int(11) NOT NULL,
  `hotspot_coordinates` longtext DEFAULT NULL,
  `hotspot_type` varchar(40) DEFAULT NULL,
  `answer_code` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `c_quiz_answer`
--

INSERT INTO `c_quiz_answer` (`iid`, `question_id`, `answer`, `correct`, `comment`, `ponderation`, `position`, `hotspot_coordinates`, `hotspot_type`, `answer_code`) VALUES
(1, 1, '<p>erere</p>', 1, '', 1, 1, NULL, NULL, NULL),
(2, 1, '<p>reer</p>', 0, '', 0, 2, NULL, NULL, NULL),
(3, 1, '<p>erere</p>', 0, '', 0, 3, NULL, NULL, NULL),
(4, 1, '<p>rerererere</p>', 0, '', 0, 4, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_quiz_category`
--

CREATE TABLE `c_quiz_category` (
  `id` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `c_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext DEFAULT NULL,
  `position` int(11) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_quiz_question`
--

CREATE TABLE `c_quiz_question` (
  `iid` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `question` longtext NOT NULL,
  `description` longtext DEFAULT NULL,
  `ponderation` double NOT NULL DEFAULT 0,
  `position` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `picture` varchar(50) DEFAULT NULL,
  `level` int(11) NOT NULL,
  `feedback` longtext DEFAULT NULL,
  `extra` varchar(255) DEFAULT NULL,
  `question_code` varchar(10) DEFAULT NULL,
  `mandatory` int(11) NOT NULL,
  `duration` int(11) DEFAULT NULL,
  `parent_media_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `c_quiz_question`
--

INSERT INTO `c_quiz_question` (`iid`, `resource_node_id`, `question`, `description`, `ponderation`, `position`, `type`, `picture`, `level`, `feedback`, `extra`, `question_code`, `mandatory`, `duration`, `parent_media_id`) VALUES
(1, 79, 'rrrrrrrr', '', 1, 1, 1, NULL, 1, NULL, '', NULL, 0, NULL, 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_quiz_question_category`
--

CREATE TABLE `c_quiz_question_category` (
  `iid` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_quiz_question_option`
--

CREATE TABLE `c_quiz_question_option` (
  `iid` int(11) NOT NULL,
  `question_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `position` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_quiz_question_rel_category`
--

CREATE TABLE `c_quiz_question_rel_category` (
  `question_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_quiz_rel_category`
--

CREATE TABLE `c_quiz_rel_category` (
  `iid` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `exercise_id` int(11) DEFAULT NULL,
  `count_questions` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_quiz_rel_question`
--

CREATE TABLE `c_quiz_rel_question` (
  `iid` int(11) NOT NULL,
  `question_id` int(11) DEFAULT NULL,
  `quiz_id` int(11) DEFAULT NULL,
  `question_order` int(11) NOT NULL,
  `destination` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `c_quiz_rel_question`
--

INSERT INTO `c_quiz_rel_question` (`iid`, `question_id`, `quiz_id`, `question_order`, `destination`) VALUES
(1, 1, 1, 1, NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_shortcut`
--

CREATE TABLE `c_shortcut` (
  `id` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `shortcut_node_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_student_publication`
--

CREATE TABLE `c_student_publication` (
  `iid` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `group_category_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `accepted` tinyint(1) DEFAULT NULL,
  `post_group_id` int(11) NOT NULL,
  `sent_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `filetype` varchar(10) NOT NULL,
  `has_properties` int(11) NOT NULL,
  `view_properties` tinyint(1) DEFAULT NULL,
  `qualification` double NOT NULL,
  `date_of_qualification` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `qualificator_id` int(11) NOT NULL,
  `weight` double NOT NULL,
  `allow_text_assignment` int(11) NOT NULL,
  `contains_file` int(11) NOT NULL,
  `document_id` int(11) NOT NULL,
  `filesize` int(11) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `student_delete_own_publication` tinyint(1) DEFAULT 0,
  `default_visibility` tinyint(1) DEFAULT 0,
  `extensions` longtext DEFAULT NULL,
  `group_category_work_id` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_student_publication_assignment`
--

CREATE TABLE `c_student_publication_assignment` (
  `iid` int(11) NOT NULL,
  `publication_id` int(11) DEFAULT NULL,
  `expires_on` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `ends_on` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `add_to_calendar` int(11) NOT NULL,
  `enable_qualification` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_student_publication_comment`
--

CREATE TABLE `c_student_publication_comment` (
  `iid` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `work_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `comment` longtext DEFAULT NULL,
  `file` varchar(255) DEFAULT NULL,
  `sent_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_student_publication_correction`
--

CREATE TABLE `c_student_publication_correction` (
  `id` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_student_publication_rel_document`
--

CREATE TABLE `c_student_publication_rel_document` (
  `iid` int(11) NOT NULL,
  `work_id` int(11) DEFAULT NULL,
  `document_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_student_publication_rel_user`
--

CREATE TABLE `c_student_publication_rel_user` (
  `iid` int(11) NOT NULL,
  `work_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_survey`
--

CREATE TABLE `c_survey` (
  `iid` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `code` varchar(40) DEFAULT NULL,
  `title` longtext NOT NULL,
  `subtitle` longtext DEFAULT NULL,
  `lang` varchar(20) DEFAULT NULL,
  `avail_from` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `avail_till` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `is_shared` varchar(1) DEFAULT NULL,
  `template` varchar(20) DEFAULT NULL,
  `intro` longtext DEFAULT NULL,
  `surveythanks` longtext DEFAULT NULL,
  `creation_date` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `invited` int(11) NOT NULL,
  `answered` int(11) NOT NULL,
  `invite_mail` longtext NOT NULL,
  `reminder_mail` longtext NOT NULL,
  `mail_subject` varchar(255) NOT NULL,
  `anonymous` varchar(10) NOT NULL,
  `access_condition` longtext DEFAULT NULL,
  `shuffle` tinyint(1) NOT NULL,
  `one_question_per_page` tinyint(1) NOT NULL,
  `survey_version` varchar(255) NOT NULL,
  `lft` int(11) DEFAULT NULL,
  `rgt` int(11) DEFAULT NULL,
  `lvl` int(11) DEFAULT NULL,
  `survey_type` int(11) NOT NULL,
  `show_form_profile` int(11) NOT NULL,
  `form_fields` longtext NOT NULL,
  `visible_results` int(11) DEFAULT NULL,
  `is_mandatory` tinyint(1) NOT NULL DEFAULT 0,
  `display_question_number` tinyint(1) NOT NULL DEFAULT 1,
  `duration` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_survey_answer`
--

CREATE TABLE `c_survey_answer` (
  `iid` int(11) NOT NULL,
  `survey_id` int(11) DEFAULT NULL,
  `question_id` int(11) DEFAULT NULL,
  `option_id` longtext NOT NULL,
  `value` int(11) NOT NULL,
  `user` varchar(250) NOT NULL,
  `session_id` int(11) DEFAULT NULL,
  `c_lp_item_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_survey_invitation`
--

CREATE TABLE `c_survey_invitation` (
  `iid` int(11) NOT NULL,
  `c_id` int(11) DEFAULT NULL,
  `session_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `survey_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `invitation_code` varchar(250) NOT NULL,
  `answered` int(11) NOT NULL,
  `invitation_date` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `reminder_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `answered_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `c_lp_item_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_survey_question`
--

CREATE TABLE `c_survey_question` (
  `iid` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `parent_option_id` int(11) DEFAULT NULL,
  `survey_id` int(11) DEFAULT NULL,
  `survey_question` longtext NOT NULL,
  `survey_question_comment` longtext NOT NULL,
  `type` varchar(250) NOT NULL,
  `display` varchar(10) NOT NULL,
  `sort` int(11) NOT NULL,
  `shared_question_id` int(11) DEFAULT NULL,
  `max_value` int(11) DEFAULT NULL,
  `survey_group_pri` int(11) NOT NULL,
  `survey_group_sec1` int(11) NOT NULL,
  `survey_group_sec2` int(11) NOT NULL,
  `is_required` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_survey_question_option`
--

CREATE TABLE `c_survey_question_option` (
  `iid` int(11) NOT NULL,
  `question_id` int(11) DEFAULT NULL,
  `survey_id` int(11) DEFAULT NULL,
  `option_text` longtext NOT NULL,
  `sort` int(11) NOT NULL,
  `value` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_thematic`
--

CREATE TABLE `c_thematic` (
  `iid` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `title` longtext NOT NULL,
  `content` longtext DEFAULT NULL,
  `active` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_thematic_advance`
--

CREATE TABLE `c_thematic_advance` (
  `iid` int(11) NOT NULL,
  `thematic_id` int(11) DEFAULT NULL,
  `attendance_id` int(11) DEFAULT NULL,
  `room_id` int(11) DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `start_date` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `duration` int(11) NOT NULL,
  `done_advance` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_thematic_plan`
--

CREATE TABLE `c_thematic_plan` (
  `iid` int(11) NOT NULL,
  `thematic_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext DEFAULT NULL,
  `description_type` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_tool`
--

CREATE TABLE `c_tool` (
  `iid` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `c_id` int(11) NOT NULL,
  `session_id` int(11) DEFAULT NULL,
  `tool_id` int(11) NOT NULL,
  `title` longtext NOT NULL,
  `visibility` tinyint(1) DEFAULT NULL,
  `position` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `c_tool`
--

INSERT INTO `c_tool` (`iid`, `resource_node_id`, `c_id`, `session_id`, `tool_id`, `title`, `visibility`, `position`) VALUES
(1, 6, 1, NULL, 1, 'agenda', 1, 0),
(2, 7, 1, NULL, 2, 'announcement', 1, 1),
(3, 8, 1, NULL, 4, 'student_publication', 1, 2),
(4, 9, 1, NULL, 5, 'attendance', 1, 3),
(5, 10, 1, NULL, 6, 'blog', 1, 4),
(6, 11, 1, NULL, 7, 'chat', 1, 5),
(7, 12, 1, NULL, 8, 'course_description', 1, 6),
(8, 13, 1, NULL, 9, 'course_homepage', 0, 7),
(9, 14, 1, NULL, 10, 'course_progress', 1, 8),
(10, 15, 1, NULL, 11, 'course_tool', 0, 9),
(11, 16, 1, NULL, 13, 'document', 1, 10),
(12, 17, 1, NULL, 14, 'dropbox', 1, 11),
(13, 18, 1, NULL, 15, 'quiz', 1, 12),
(14, 19, 1, NULL, 16, 'forum', 1, 13),
(15, 20, 1, NULL, 18, 'glossary', 1, 14),
(16, 21, 1, NULL, 19, 'gradebook', 1, 15),
(17, 22, 1, NULL, 20, 'group', 1, 16),
(18, 23, 1, NULL, 21, 'learnpath', 1, 17),
(19, 24, 1, NULL, 22, 'link', 1, 18),
(20, 25, 1, NULL, 23, 'course_maintenance', 0, 19),
(21, 26, 1, NULL, 24, 'member', 0, 20),
(22, 27, 1, NULL, 26, 'notebook', 1, 21),
(23, 28, 1, NULL, 28, 'portfolio', 1, 22),
(24, 29, 1, NULL, 30, 'course_setting', 0, 23),
(25, 30, 1, NULL, 32, 'survey', 1, 24),
(26, 31, 1, NULL, 35, 'tracking', 1, 25),
(27, 32, 1, NULL, 39, 'wiki', 1, 26);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_tool_intro`
--

CREATE TABLE `c_tool_intro` (
  `iid` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `c_tool_id` int(11) NOT NULL,
  `intro_text` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `c_tool_intro`
--

INSERT INTO `c_tool_intro` (`iid`, `resource_node_id`, `c_tool_id`, `intro_text`) VALUES
(1, 53, 8, '<div class=\"tiny-content\"><article class=\"text-token-text-primary w-full focus:outline-none [--shadow-height:45px] has-data-writing-block:pointer-events-none has-data-writing-block:-mt-(--shadow-height) has-data-writing-block:pt-(--shadow-height) [&amp;:has([data-writing-block])&gt;*]:pointer-events-auto [content-visibility:auto] supports-[content-visibility:auto]:[contain-intrinsic-size:auto_100lvh] scroll-mt-[calc(var(--header-height)+min(200px,max(70px,20svh)))]\" dir=\"auto\" tabindex=\"-1\" data-turn-id=\"request-WEB:e301eba7-dbfd-4ff8-8258-5ffc63e01d64-3\" data-testid=\"conversation-turn-8\" data-scroll-anchor=\"true\" data-turn=\"assistant\">\n<div class=\"text-base my-auto mx-auto pb-10 [--thread-content-margin:--spacing(4)] thread-sm:[--thread-content-margin:--spacing(6)] thread-lg:[--thread-content-margin:--spacing(16)] px-(--thread-content-margin)\">\n<div class=\"[--thread-content-max-width:40rem] thread-lg:[--thread-content-max-width:48rem] mx-auto max-w-(--thread-content-max-width) flex-1 group/turn-messages focus-visible:outline-hidden relative flex w-full min-w-0 flex-col agent-turn\" tabindex=\"-1\">\n<div class=\"flex max-w-full flex-col grow\">\n<div class=\"min-h-8 text-message relative flex w-full flex-col items-end gap-2 text-start break-words whitespace-normal [.text-message+&amp;]:mt-1\" dir=\"auto\" data-message-author-role=\"assistant\" data-message-id=\"4a99bc8a-f026-4028-b111-234b1b80f73b\" data-message-model-slug=\"gpt-5-1-thinking\">\n<div class=\"flex w-full flex-col gap-1 empty:hidden first:pt-[1px]\">\n<div class=\"markdown prose dark:prose-invert w-full break-words light markdown-new-styling\">\n<p data-start=\"0\" data-end=\"31\"><span style=\"font-size: 24pt;\"><strong>Welcome to this Symfony course!</strong></span></p>\n<p data-start=\"33\" data-end=\"324\">Symfony is a powerful, modern PHP framework used to build secure, scalable web applications and APIs. It is widely adopted in the industry, powers major platforms (including parts of Drupal and Laravel&rsquo;s core components), and provides a solid foundation for professional backend development.</p>\n<p data-start=\"326\" data-end=\"736\">In this course, you will learn how to structure real-world applications using Symfony&rsquo;s best practices. We will explore the core concepts of the framework&mdash;routing, controllers, services, dependency injection, configuration, and environments&mdash;as well as working with databases through Doctrine ORM. Step by step, you will learn how to design clean architectures, write reusable code, and expose robust HTTP APIs.</p>\n<p data-start=\"738\" data-end=\"784\">By the end of the course, you will be able to:</p>\n<ul data-start=\"786\" data-end=\"1270\">\n<li data-start=\"786\" data-end=\"831\">\n<p data-start=\"788\" data-end=\"831\">Install and configure a Symfony application</p>\n</li>\n<li data-start=\"832\" data-end=\"894\">\n<p data-start=\"834\" data-end=\"894\">Define routes and build controllers for web pages and APIs</p>\n</li>\n<li data-start=\"895\" data-end=\"966\">\n<p data-start=\"897\" data-end=\"966\">Work with Doctrine to manage entities, migrations, and repositories</p>\n</li>\n<li data-start=\"967\" data-end=\"1036\">\n<p data-start=\"969\" data-end=\"1036\">Use services, dependency injection, and configuration effectively</p>\n</li>\n<li data-start=\"1037\" data-end=\"1081\">\n<p data-start=\"1039\" data-end=\"1081\">Handle forms, validation, and user input</p>\n</li>\n<li data-start=\"1082\" data-end=\"1138\">\n<p data-start=\"1084\" data-end=\"1138\">Implement authentication and basic security features</p>\n</li>\n<li data-start=\"1139\" data-end=\"1213\">\n<p data-start=\"1141\" data-end=\"1213\">Organize your code with bundles, modules, and a clear folder structure</p>\n</li>\n<li data-start=\"1214\" data-end=\"1270\">\n<p data-start=\"1216\" data-end=\"1270\">Write and run automated tests to ensure code quality</p>\n</li>\n</ul>\n<p data-start=\"1272\" data-end=\"1475\">This course is intended for developers who already have a basic understanding of PHP and object-oriented programming. If you are comfortable with classes, methods, and namespaces, you are ready to start.</p>\n<p data-start=\"1477\" data-end=\"1653\" data-is-last-node=\"\" data-is-only-node=\"\">Throughout the course, we will focus on <strong data-start=\"1517\" data-end=\"1539\">practical examples</strong>, <strong data-start=\"1541\" data-end=\"1555\">clean code</strong>, and <strong data-start=\"1561\" data-end=\"1584\">realistic use cases</strong>, so that you can apply what you learn directly to your own projects.</p>\n</div>\n</div>\n</div>\n</div>\n<div class=\"z-0 flex min-h-[46px] justify-start\">&nbsp;</div>\n<div class=\"mt-3 w-full empty:hidden\">\n<div class=\"text-center\">&nbsp;</div>\n</div>\n</div>\n</div>\n</article>\n<div class=\"pointer-events-none h-px w-px\" aria-hidden=\"true\" data-edge=\"true\">&nbsp;</div></div>');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_wiki`
--

CREATE TABLE `c_wiki` (
  `iid` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `c_id` int(11) NOT NULL,
  `page_id` int(11) DEFAULT NULL,
  `reflink` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) DEFAULT NULL,
  `dtime` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `addlock` int(11) NOT NULL,
  `editlock` int(11) NOT NULL,
  `visibility` int(11) NOT NULL,
  `addlock_disc` int(11) NOT NULL,
  `visibility_disc` int(11) NOT NULL,
  `ratinglock_disc` int(11) NOT NULL,
  `assignment` int(11) NOT NULL,
  `comment` longtext NOT NULL,
  `progress` longtext NOT NULL,
  `score` int(11) DEFAULT NULL,
  `version` int(11) DEFAULT NULL,
  `is_editing` int(11) NOT NULL,
  `time_edit` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `hits` int(11) DEFAULT NULL,
  `linksto` longtext NOT NULL,
  `tag` longtext NOT NULL,
  `user_ip` varchar(45) NOT NULL,
  `session_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_wiki_category`
--

CREATE TABLE `c_wiki_category` (
  `id` int(11) NOT NULL,
  `c_id` int(11) NOT NULL,
  `session_id` int(11) DEFAULT NULL,
  `tree_root` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `lft` int(11) NOT NULL,
  `lvl` int(11) NOT NULL,
  `rgt` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_wiki_conf`
--

CREATE TABLE `c_wiki_conf` (
  `iid` int(11) NOT NULL,
  `c_id` int(11) NOT NULL,
  `page_id` int(11) NOT NULL,
  `task` longtext NOT NULL,
  `feedback1` longtext NOT NULL,
  `feedback2` longtext NOT NULL,
  `feedback3` longtext NOT NULL,
  `fprogress1` varchar(3) NOT NULL,
  `fprogress2` varchar(3) NOT NULL,
  `fprogress3` varchar(3) NOT NULL,
  `max_size` int(11) DEFAULT NULL,
  `max_text` int(11) DEFAULT NULL,
  `max_version` int(11) DEFAULT NULL,
  `startdate_assig` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `enddate_assig` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `delayedsubmit` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_wiki_discuss`
--

CREATE TABLE `c_wiki_discuss` (
  `iid` int(11) NOT NULL,
  `c_id` int(11) NOT NULL,
  `publication_id` int(11) NOT NULL,
  `userc_id` int(11) NOT NULL,
  `comment` longtext NOT NULL,
  `p_score` varchar(255) DEFAULT NULL,
  `dtime` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_wiki_mailcue`
--

CREATE TABLE `c_wiki_mailcue` (
  `iid` int(11) NOT NULL,
  `c_id` int(11) NOT NULL,
  `type` longtext NOT NULL,
  `group_id` int(11) DEFAULT NULL,
  `session_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `c_wiki_rel_category`
--

CREATE TABLE `c_wiki_rel_category` (
  `wiki_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `extra_field`
--

CREATE TABLE `extra_field` (
  `id` int(11) NOT NULL,
  `item_type` int(11) NOT NULL,
  `value_type` int(11) NOT NULL,
  `variable` varchar(255) NOT NULL,
  `description` longtext DEFAULT NULL,
  `display_text` varchar(255) DEFAULT NULL,
  `helper_text` longtext DEFAULT NULL,
  `default_value` longtext DEFAULT NULL,
  `field_order` int(11) DEFAULT NULL,
  `visible_to_self` tinyint(1) NOT NULL DEFAULT 0,
  `visible_to_others` tinyint(1) NOT NULL DEFAULT 0,
  `changeable` tinyint(1) NOT NULL DEFAULT 0,
  `filter` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `auto_remove` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `extra_field`
--

INSERT INTO `extra_field` (`id`, `item_type`, `value_type`, `variable`, `description`, `display_text`, `helper_text`, `default_value`, `field_order`, `visible_to_self`, `visible_to_others`, `changeable`, `filter`, `created_at`, `auto_remove`) VALUES
(1, 1, 1, 'legal_accept', '', 'Legal agreement accepted', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(2, 1, 1, 'already_logged_in', '', 'Already logged in', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(3, 1, 1, 'update_type', '', 'Update script type', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(4, 1, 10, 'tags', '', 'Tags', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(5, 1, 1, 'dashboard', '', 'Dashboard', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(6, 1, 1, 'user_chat_status', '', 'User chat status', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(7, 1, 1, 'google_calendar_url', '', 'Google Calendar URL', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(8, 1, 1, 'captcha_blocked_until_date', '', 'Account locked until', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(9, 2, 10, 'tags', '', 'Tags', NULL, NULL, NULL, 1, 0, 1, 0, '2025-11-21 22:22:17', 0),
(10, 2, 1, 'video_url', '', 'Video URL', NULL, NULL, NULL, 1, 0, 1, 0, '2025-11-21 22:22:17', 0),
(11, 3, 16, 'image', '', 'Image', NULL, NULL, NULL, 1, 0, 1, 0, '2025-11-21 22:22:17', 0),
(12, 1, 4, 'mail_notify_invitation', '', 'Notify of invitations by email', NULL, '1', NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(13, 1, 4, 'mail_notify_message', '', 'Notify of messages by email', NULL, '1', NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(14, 1, 4, 'mail_notify_group_message', '', 'Notify of group messages by email', NULL, '1', NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(15, 1, 1, 'skype', '', 'Skype', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(16, 1, 1, 'linkedin_url', '', 'LinkedIn profile URL', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(17, 21, 6, 'send_notification_at_a_specific_date', '', 'Send notification at a specific date', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(18, 21, 6, 'date_to_send_notification', '', 'Date to send notification', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(19, 3, 13, 'send_to_users_in_session', '', 'Send to users in session', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(20, 2, 13, 'session_courses_read_only_mode', '', 'Lock course in session', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(21, 12, 13, 'is_mandatory', '', 'Is mandatory', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(22, 2, 3, 'show_in_catalogue', '', 'Show in catalogue', NULL, NULL, NULL, 1, 0, 1, 0, '2025-11-21 22:22:17', 0),
(23, 2, 5, 'multiple_language', '', 'In multiple languages', NULL, NULL, NULL, 1, 0, 1, 0, '2025-11-21 22:22:17', 0),
(24, 20, 3, 'acquisition', '', 'Acquisition', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(25, 20, 13, 'invisible', '', 'Invisible', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(26, 7, 7, 'start_date', '', 'Start date', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(27, 7, 7, 'end_date', '', 'End date', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(28, 13, 18, 'attachment', '', 'Attachment', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(29, 13, 13, 'send_to_coaches', '', 'Send to coaches', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(30, 9, 15, 'work_time', '', 'Considered working time', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(31, 1, 1, 'address', '', 'User address', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(32, 17, 5, 'advancedcourselist', '', 'Advanced courses list', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(33, 16, 13, 'ask_for_revision', '', 'Ask for revision', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(34, 1, 13, 'ask_new_password', '', 'Ask for new password', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(35, 1, 7, 'authenticationDate', '', 'Authentication date', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(36, 1, 1, 'authenticationMethod', '', 'Authentication method', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(37, 1, 6, 'birthday', '', 'Birthday', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(38, 17, 13, 'block_category', '', 'Block Category', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(39, 1, 1, 'buycourses_company', '', 'Buyer\'s company', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(40, 1, 1, 'buycourses_vat', '', 'Buyer\'s VAT/Tax ID', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(41, 1, 1, 'buycourses_address', '', 'Buyer\'s address', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(42, 1, 1, 'cas_user', '', 'CAS user', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(43, 10, 15, 'careerid', '', 'Career ID', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(44, 10, 1, 'career_urls', '', 'Career URLs', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(45, 10, 1, 'career_diagram', '', 'Career diagram', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(46, 3, 13, 'collapsed', '', 'Collapsed', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(47, 1, 1, 'created_by', '', 'Created by', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(48, 1, 1, 'credentialType', '', 'Credentials type', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(49, 4, 13, 'differentiation', '', 'Differentiation', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(50, 1, 13, 'disable_emails', '', 'Disable all emails', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(51, 2, 13, 'disable_import_calendar', '', 'Disable import calendar', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(52, 11, 7, 'downloaded_at', '', 'Downloaded at', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(53, 1, 1, 'drupal_user_id', '', 'Drupal user ID', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(54, 1, 1, 'state', '', 'State', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(55, 1, 7, 'end_pause_date', '', 'End pause date', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(56, 1, 13, 'gdpr', '', 'GDPR', NULL, NULL, NULL, 0, 0, 1, 0, '2025-11-21 22:22:17', 0),
(57, 1, 13, 'isFromNewLogin', '', 'Is from new login', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(58, 1, 13, 'longTermAuthenticationRequestTokenUsed', '', 'Long term authentication request token used', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(59, 1, 1, 'moodle_password', '', 'Moodle password', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(60, 1, 1, 'my_terms', '', 'My terms', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(61, 2, 13, 'new_tracking_system', '', 'Use alternate tracking system', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(62, 1, 1, 'level', '', 'Level', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(63, 7, 13, 'no_automatic_validation', '', 'Skip automatic validation', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(64, 1, 1, 'notification_event', '', 'Event notifications', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(65, 17, 13, 'notifications', '', 'Notifications', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(66, 6, 1, 'number_of_days_for_completion', '', 'Number of days for completion', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(67, 1, 1, 'oauth2_id', '', 'OAuth2 ID', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(68, 2, 1, 'office_address', '', 'Office address', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(69, 2, 1, 'office_phone_extension', '', 'Office phone extension', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(70, 1, 13, 'pause_formation', '', 'Pause training', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(71, 2, 13, 'popular_courses', '', 'Popular courses', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(72, 1, 1, 'quality', '', 'Quality', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(73, 2, 1, 'remedialcourselist', '', 'Remedial courses list', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(74, 1, 13, 'request_for_delete_account', '', 'Request account deletion', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(75, 1, 2, 'request_for_delete_account_justification', '', 'Justification for account deletion', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(76, 1, 13, 'request_for_legal_agreement_consent_removal', '', 'Request for legal agreement\'s consent removal', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(77, 1, 2, 'request_for_legal_agreement_consent_removal_justification', '', 'Justification for consent removal', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(78, 16, 1, 'revision_language', '', 'Revision Language', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(79, 3, 15, 'session_career', '', 'Session career link', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(80, 1, 1, 'successful_AuthenticationHandlers', '', 'Successful authentication handlers', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(81, 1, 13, 'termactivated', '', 'Terms enabled', NULL, NULL, NULL, 0, 0, 1, 0, '2025-11-21 22:22:17', 0),
(82, 1, 24, 'terms_villedustage', '', 'City of internship\'s terms', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(83, 1, 1, 'timezone', '', 'Timezone', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(84, 1, 1, 'uid', '', 'UID', NULL, NULL, NULL, 0, 0, 1, 0, '2025-11-21 22:22:17', 0),
(85, 6, 13, 'use_score_as_progress', '', 'Use score as progress', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(86, 1, 24, 'terms_ville', '', 'City\'s terms', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(87, 4, 15, 'time', '', 'Time', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(88, 1, 1, 'organisationemail', '', 'Organisation e-mail', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(89, 1, 1, 'azure_id', '', 'Azure ID (mailNickname)', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0),
(90, 1, 1, 'azure_uid', '', 'Azure UID (internal ID)', NULL, NULL, NULL, 0, 0, 0, 0, '2025-11-21 22:22:17', 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `extra_field_options`
--

CREATE TABLE `extra_field_options` (
  `id` int(11) NOT NULL,
  `field_id` int(11) DEFAULT NULL,
  `option_value` longtext DEFAULT NULL,
  `display_text` varchar(255) DEFAULT NULL,
  `priority` varchar(255) DEFAULT NULL,
  `priority_message` varchar(255) DEFAULT NULL,
  `option_order` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `extra_field_options`
--

INSERT INTO `extra_field_options` (`id`, `field_id`, `option_value`, `display_text`, `priority`, `priority_message`, `option_order`) VALUES
(1, 12, 'At once', 'At once', NULL, NULL, 1),
(2, 12, 'Daily', 'Daily', NULL, NULL, 2),
(3, 12, 'No', 'No', NULL, NULL, 3),
(4, 13, 'At once', 'At once', NULL, NULL, 1),
(5, 13, 'Daily', 'Daily', NULL, NULL, 2),
(6, 13, 'No', 'No', NULL, NULL, 3),
(7, 14, 'At once', 'At once', NULL, NULL, 1),
(8, 14, 'Daily', 'Daily', NULL, NULL, 2),
(9, 14, 'No', 'No', NULL, NULL, 3);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `extra_field_option_rel_field_option`
--

CREATE TABLE `extra_field_option_rel_field_option` (
  `id` int(11) NOT NULL,
  `field_option_id` int(11) DEFAULT NULL,
  `related_field_option_id` int(11) DEFAULT NULL,
  `field_id` int(11) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `extra_field_rel_tag`
--

CREATE TABLE `extra_field_rel_tag` (
  `id` int(11) NOT NULL,
  `field_id` int(11) DEFAULT NULL,
  `tag_id` int(11) DEFAULT NULL,
  `item_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `extra_field_saved_search`
--

CREATE TABLE `extra_field_saved_search` (
  `id` int(11) NOT NULL,
  `field_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `value` longtext DEFAULT NULL COMMENT '(DC2Type:array)',
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `extra_field_values`
--

CREATE TABLE `extra_field_values` (
  `id` int(11) NOT NULL,
  `field_id` int(11) DEFAULT NULL,
  `asset_id` binary(16) DEFAULT NULL COMMENT '(DC2Type:uuid)',
  `field_value` longtext DEFAULT NULL,
  `item_id` int(11) NOT NULL,
  `comment` longtext DEFAULT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `extra_field_values`
--

INSERT INTO `extra_field_values` (`id`, `field_id`, `asset_id`, `field_value`, `item_id`, `comment`, `created_at`, `updated_at`) VALUES
(1, 2, NULL, 'false', 4, NULL, '2025-11-21 22:32:04', '2025-11-21 22:36:29'),
(2, 1, NULL, '', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(3, 3, NULL, '', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(4, 5, NULL, '', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(5, 6, NULL, '', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(6, 7, NULL, '', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(7, 8, NULL, '', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(8, 12, NULL, '', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(9, 13, NULL, '', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(10, 14, NULL, '', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(11, 15, NULL, '', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(12, 16, NULL, '', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(13, 31, NULL, '', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(14, 34, NULL, '0', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(15, 35, NULL, '2025-11-21 23:35', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(16, 36, NULL, '', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(17, 39, NULL, '', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(18, 40, NULL, '', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(19, 41, NULL, '', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(20, 42, NULL, '', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(21, 47, NULL, '', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(22, 48, NULL, '', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(23, 50, NULL, '0', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(24, 53, NULL, '', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(25, 54, NULL, '', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(26, 55, NULL, '2025-11-21 23:35', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(27, 56, NULL, '0', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(28, 57, NULL, '0', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(29, 58, NULL, '0', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(30, 59, NULL, '', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(31, 60, NULL, '', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(32, 62, NULL, '', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(33, 64, NULL, '', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(34, 67, NULL, '', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(35, 70, NULL, '0', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(36, 72, NULL, '', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(37, 74, NULL, '0', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(38, 75, NULL, '', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(39, 76, NULL, '0', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(40, 77, NULL, '', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(41, 80, NULL, '', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(42, 81, NULL, '0', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(43, 83, NULL, '', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(44, 84, NULL, '', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(45, 88, NULL, '', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(46, 89, NULL, '', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(47, 90, NULL, '', 4, NULL, '2025-11-21 22:36:29', '2025-11-21 22:36:29'),
(48, 32, NULL, '', 1, NULL, '2025-11-22 00:39:37', '2025-11-22 00:39:37'),
(49, 38, NULL, '0', 1, NULL, '2025-11-22 00:39:37', '2025-11-22 00:39:37'),
(50, 65, NULL, '0', 1, NULL, '2025-11-22 00:39:37', '2025-11-22 00:39:37'),
(51, 49, NULL, '0', 1, NULL, '2025-11-22 00:40:34', '2025-11-22 00:40:34'),
(52, 87, NULL, '', 1, NULL, '2025-11-22 00:40:34', '2025-11-22 00:40:34');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `ext_log_entries`
--

CREATE TABLE `ext_log_entries` (
  `id` int(11) NOT NULL,
  `action` varchar(8) NOT NULL,
  `logged_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `object_id` varchar(64) DEFAULT NULL,
  `object_class` varchar(191) NOT NULL,
  `version` int(11) NOT NULL,
  `data` longtext DEFAULT NULL COMMENT '(DC2Type:array)',
  `username` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `ext_translations`
--

CREATE TABLE `ext_translations` (
  `id` int(11) NOT NULL,
  `locale` varchar(8) NOT NULL,
  `object_class` varchar(191) NOT NULL,
  `field` varchar(32) NOT NULL,
  `foreign_key` varchar(64) NOT NULL,
  `content` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `fos_group`
--

CREATE TABLE `fos_group` (
  `id` int(11) NOT NULL,
  `code` varchar(40) NOT NULL,
  `title` varchar(255) NOT NULL,
  `roles` longtext NOT NULL COMMENT '(DC2Type:array)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `fos_group`
--

INSERT INTO `fos_group` (`id`, `code`, `title`, `roles`) VALUES
(1, 'ADMIN', 'Administrators', 'a:1:{i:0;s:10:\"ROLE_ADMIN\";}'),
(2, 'STUDENT', 'Students', 'a:1:{i:0;s:12:\"ROLE_STUDENT\";}'),
(3, 'TEACHER', 'Teachers', 'a:1:{i:0;s:12:\"ROLE_TEACHER\";}'),
(4, 'RRHH', 'Human resources manager', 'a:1:{i:0;s:7:\"ROLE_HR\";}'),
(5, 'SESSION_MANAGER', 'Session', 'a:1:{i:0;s:20:\"ROLE_SESSION_MANAGER\";}'),
(6, 'QUESTION_MANAGER', 'Question manager', 'a:1:{i:0;s:21:\"ROLE_QUESTION_MANAGER\";}'),
(7, 'STUDENT_BOSS', 'Student boss', 'a:1:{i:0;s:17:\"ROLE_STUDENT_BOSS\";}'),
(8, 'INVITEE', 'Invitee', 'a:1:{i:0;s:12:\"ROLE_INVITEE\";}');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `fos_user_user_group`
--

CREATE TABLE `fos_user_user_group` (
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `gradebook_category`
--

CREATE TABLE `gradebook_category` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `c_id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `session_id` int(11) DEFAULT NULL,
  `grade_model_id` int(11) DEFAULT NULL,
  `document_id` int(11) DEFAULT NULL,
  `title` longtext NOT NULL,
  `description` longtext DEFAULT NULL,
  `weight` double NOT NULL,
  `visible` tinyint(1) NOT NULL,
  `certif_min_score` int(11) DEFAULT NULL,
  `locked` int(11) NOT NULL,
  `default_lowest_eval_exclude` tinyint(1) DEFAULT NULL,
  `generate_certificates` tinyint(1) NOT NULL,
  `certificate_validity_period` int(11) DEFAULT NULL,
  `is_requirement` tinyint(1) NOT NULL DEFAULT 0,
  `depends` longtext DEFAULT NULL,
  `minimum_to_validate` int(11) DEFAULT NULL,
  `gradebooks_to_validate_in_dependence` int(11) DEFAULT NULL,
  `allow_skills_by_subcategory` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `gradebook_category`
--

INSERT INTO `gradebook_category` (`id`, `user_id`, `c_id`, `parent_id`, `session_id`, `grade_model_id`, `document_id`, `title`, `description`, `weight`, `visible`, `certif_min_score`, `locked`, `default_lowest_eval_exclude`, `generate_certificates`, `certificate_validity_period`, `is_requirement`, `depends`, `minimum_to_validate`, `gradebooks_to_validate_in_dependence`, `allow_skills_by_subcategory`) VALUES
(1, 1, 1, NULL, NULL, NULL, 18, 'SYMFONY', '', 100, 0, 75, 0, NULL, 1, NULL, 0, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `gradebook_certificate`
--

CREATE TABLE `gradebook_certificate` (
  `id` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `cat_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `score_certificate` double NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `path_certificate` longtext DEFAULT NULL,
  `downloaded_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `publish` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `gradebook_comment`
--

CREATE TABLE `gradebook_comment` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `gradebook_id` int(11) DEFAULT NULL,
  `comment` longtext NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `gradebook_evaluation`
--

CREATE TABLE `gradebook_evaluation` (
  `id` int(11) NOT NULL,
  `c_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `title` longtext NOT NULL,
  `description` longtext DEFAULT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `weight` double NOT NULL,
  `max` double NOT NULL,
  `visible` int(11) NOT NULL,
  `type` varchar(40) NOT NULL,
  `locked` int(11) NOT NULL,
  `best_score` double DEFAULT NULL,
  `average_score` double DEFAULT NULL,
  `score_weight` double DEFAULT NULL,
  `user_score_list` longtext DEFAULT NULL COMMENT '(DC2Type:array)',
  `min_score` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `gradebook_link`
--

CREATE TABLE `gradebook_link` (
  `id` int(11) NOT NULL,
  `c_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `type` int(11) NOT NULL,
  `ref_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `weight` double NOT NULL,
  `visible` int(11) NOT NULL,
  `locked` int(11) NOT NULL,
  `best_score` double DEFAULT NULL,
  `average_score` double DEFAULT NULL,
  `score_weight` double DEFAULT NULL,
  `user_score_list` longtext DEFAULT NULL COMMENT '(DC2Type:array)',
  `min_score` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `gradebook_linkeval_log`
--

CREATE TABLE `gradebook_linkeval_log` (
  `id` int(11) NOT NULL,
  `user_id_log` int(11) DEFAULT NULL,
  `id_linkeval_log` int(11) NOT NULL,
  `title` longtext NOT NULL,
  `description` longtext DEFAULT NULL,
  `weight` smallint(6) DEFAULT NULL,
  `visible` tinyint(1) DEFAULT NULL,
  `type` varchar(20) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `gradebook_result`
--

CREATE TABLE `gradebook_result` (
  `id` int(11) NOT NULL,
  `evaluation_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `score` double DEFAULT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `gradebook_result_attempt`
--

CREATE TABLE `gradebook_result_attempt` (
  `id` int(11) NOT NULL,
  `result_id` int(11) DEFAULT NULL,
  `comment` longtext DEFAULT NULL,
  `score` double DEFAULT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `gradebook_result_log`
--

CREATE TABLE `gradebook_result_log` (
  `id` int(11) NOT NULL,
  `result_id` int(11) DEFAULT NULL,
  `evaluation_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `score` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `gradebook_score_display`
--

CREATE TABLE `gradebook_score_display` (
  `id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `score` double NOT NULL,
  `display` varchar(40) NOT NULL,
  `score_color_percent` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `gradebook_score_log`
--

CREATE TABLE `gradebook_score_log` (
  `id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `score` double NOT NULL,
  `registered_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `grade_components`
--

CREATE TABLE `grade_components` (
  `id` int(11) NOT NULL,
  `grade_model_id` int(11) DEFAULT NULL,
  `percentage` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `acronym` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `grade_model`
--

CREATE TABLE `grade_model` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext DEFAULT NULL,
  `default_lowest_eval_exclude` tinyint(1) DEFAULT NULL,
  `default_external_eval` tinyint(1) DEFAULT NULL,
  `default_external_eval_prefix` varchar(140) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `illustration`
--

CREATE TABLE `illustration` (
  `id` binary(16) NOT NULL COMMENT '(DC2Type:uuid)',
  `resource_node_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `justification_document`
--

CREATE TABLE `justification_document` (
  `id` int(11) NOT NULL,
  `code` longtext DEFAULT NULL,
  `name` longtext DEFAULT NULL,
  `validity_duration` int(11) DEFAULT NULL,
  `comment` longtext DEFAULT NULL,
  `date_manual_on` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `justification_document_rel_users`
--

CREATE TABLE `justification_document_rel_users` (
  `id` int(11) NOT NULL,
  `justification_document_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `date_validity` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `language`
--

CREATE TABLE `language` (
  `id` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `original_name` varchar(255) DEFAULT NULL,
  `english_name` varchar(255) NOT NULL,
  `isocode` varchar(8) NOT NULL,
  `available` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `language`
--

INSERT INTO `language` (`id`, `parent_id`, `original_name`, `english_name`, `isocode`, `available`) VALUES
(1, NULL, 'العربية', 'arabic', 'ar', 0),
(2, NULL, 'Asturianu', 'asturian', 'ast_ES', 0),
(3, NULL, 'Euskara', 'basque', 'eu_ES', 1),
(4, NULL, 'বাংলা', 'bengali', 'bn_BD', 0),
(5, NULL, 'Bosanski', 'bosnian', 'bs_BA', 0),
(6, NULL, 'Português do Brasil', 'brazilian', 'pt_PT', 1),
(7, NULL, 'Български', 'bulgarian', 'bg', 0),
(8, NULL, 'Català', 'catalan', 'ca_ES', 0),
(9, NULL, 'Hrvatski', 'croatian', 'hr_HR', 0),
(10, NULL, 'Česky', 'czech', 'cs_CZ', 0),
(11, NULL, 'Dansk', 'danish', 'da', 0),
(12, NULL, 'دری', 'dari', 'fa_AF', 0),
(13, NULL, 'Nederlands', 'dutch', 'nl', 1),
(14, NULL, 'English', 'english', 'en_US', 1),
(15, NULL, 'Esperanto', 'esperanto', 'eo', 0),
(16, NULL, 'Føroyskt', 'faroese', 'fo_FO', 0),
(17, NULL, 'Suomi', 'finnish', 'fi_FI', 0),
(18, NULL, 'Français', 'french', 'fr_FR', 1),
(19, NULL, 'Furlan', 'friulian', 'fur', 0),
(20, NULL, 'Galego', 'galician', 'gl', 0),
(21, NULL, 'ქართული', 'georgian', 'ka_GE', 0),
(22, NULL, 'Deutsch', 'german', 'de', 1),
(23, NULL, 'Ελληνικά', 'greek', 'el', 1),
(24, NULL, 'עברית', 'hebrew', 'he_IL', 0),
(25, NULL, 'हिन्दी', 'hindi', 'hi', 0),
(26, NULL, 'Magyar', 'hungarian', 'hu_HU', 0),
(27, NULL, 'Bahasa Indonesia', 'indonesian', 'id_ID', 0),
(28, NULL, 'Italiano', 'italian', 'it', 1),
(29, NULL, '日本語', 'japanese', 'ja', 0),
(30, NULL, '한국어', 'korean', 'ko_KR', 0),
(31, NULL, 'Latviešu', 'latvian', 'lv_LV', 0),
(32, NULL, 'Lietuvių', 'lithuanian', 'lt_LT', 0),
(33, NULL, 'Македонски', 'macedonian', 'mk_MK', 0),
(34, NULL, 'Bahasa Melayu', 'malay', 'ms_MY', 0),
(35, NULL, 'Norsk', 'norwegian', 'nn_NO', 0),
(36, NULL, 'Occitan', 'occitan', 'oc', 0),
(37, NULL, 'پښتو', 'pashto', 'ps', 0),
(38, NULL, 'فارسی', 'persian', 'fa_IR', 0),
(39, NULL, 'Polski', 'polish', 'pl_PL', 1),
(40, NULL, 'Português europeu', 'portuguese', 'pt_PT', 0),
(41, NULL, 'Runasimi', 'quechua_cusco', 'qu_PE', 0),
(42, NULL, 'Română', 'romanian', 'ro_RO', 0),
(43, NULL, 'Русский', 'russian', 'ru_RU', 1),
(44, NULL, 'Srpski', 'serbian', 'sr_RS', 0),
(45, NULL, '中文（简体', 'simpl_chinese', 'zh_CN', 0),
(46, NULL, 'Slovenčina', 'slovak', 'sk_SK', 0),
(47, NULL, 'Slovenščina', 'slovenian', 'sl_SI', 0),
(48, NULL, 'الصومالية', 'somali', 'so_SO', 0),
(49, NULL, 'Español', 'spanish', 'es', 1),
(50, NULL, 'Kiswahili', 'swahili', 'sw_KE', 0),
(51, NULL, 'Svenska', 'swedish', 'sv_SE', 0),
(52, NULL, 'Tagalog', 'tagalog', 'tl_PH', 0),
(53, NULL, 'ไทย', 'thai', 'th', 0),
(54, NULL, 'Tibetan', 'tibetan', 'bo_CN', 0),
(55, NULL, '繁體中文', 'trad_chinese', 'zh_TW', 0),
(56, NULL, 'Türkçe', 'turkish', 'tr', 0),
(57, NULL, 'Українська', 'ukrainian', 'uk_UA', 0),
(58, NULL, 'Tiếng Việt', 'vietnamese', 'vi_VN', 0),
(59, NULL, 'isiXhosa', 'xhosa', 'xh_ZA', 0),
(60, NULL, 'Yorùbá', 'yoruba', 'yo_NG', 0),
(61, NULL, 'မြန်မာဘာသာ', 'burmese', 'my_MM', 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `legal`
--

CREATE TABLE `legal` (
  `id` int(11) NOT NULL,
  `date` int(11) NOT NULL,
  `content` longtext DEFAULT NULL,
  `type` int(11) NOT NULL,
  `changes` longtext NOT NULL,
  `version` int(11) DEFAULT NULL,
  `language_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `lti_external_tool`
--

CREATE TABLE `lti_external_tool` (
  `id` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `gradebook_eval_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext DEFAULT NULL,
  `public_key` longtext DEFAULT NULL,
  `launch_url` varchar(255) NOT NULL,
  `consumer_key` varchar(255) DEFAULT NULL,
  `shared_secret` varchar(255) DEFAULT NULL,
  `custom_params` longtext DEFAULT NULL,
  `active_deep_linking` tinyint(1) NOT NULL DEFAULT 0,
  `privacy` longtext DEFAULT NULL,
  `client_id` varchar(255) DEFAULT NULL,
  `login_url` varchar(255) DEFAULT NULL,
  `redirect_url` varchar(255) DEFAULT NULL,
  `jwks_url` varchar(255) DEFAULT NULL,
  `advantage_services` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '(DC2Type:json)' CHECK (json_valid(`advantage_services`)),
  `version` varchar(255) NOT NULL DEFAULT 'lti1p3',
  `launch_presentation` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '(DC2Type:json)' CHECK (json_valid(`launch_presentation`)),
  `replacement_params` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '(DC2Type:json)' CHECK (json_valid(`replacement_params`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `lti_lineitem`
--

CREATE TABLE `lti_lineitem` (
  `id` int(11) NOT NULL,
  `tool_id` int(11) NOT NULL,
  `evaluation` int(11) NOT NULL,
  `resource_id` varchar(255) DEFAULT NULL,
  `tag` varchar(255) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `end_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `lti_platform`
--

CREATE TABLE `lti_platform` (
  `id` int(11) NOT NULL,
  `public_key` longtext NOT NULL,
  `kid` varchar(255) NOT NULL,
  `private_key` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `lti_token`
--

CREATE TABLE `lti_token` (
  `id` int(11) NOT NULL,
  `tool_id` int(11) DEFAULT NULL,
  `scope` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '(DC2Type:json)' CHECK (json_valid(`scope`)),
  `hash` varchar(255) NOT NULL,
  `created_at` int(11) NOT NULL,
  `expires_at` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `mail_template`
--

CREATE TABLE `mail_template` (
  `id` int(11) NOT NULL,
  `author_id` int(11) DEFAULT NULL,
  `url_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `template` longtext DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `default_template` tinyint(1) NOT NULL,
  `system` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `message`
--

CREATE TABLE `message` (
  `id` int(11) NOT NULL,
  `user_sender_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `msg_type` smallint(6) NOT NULL,
  `status` smallint(6) NOT NULL,
  `send_date` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `title` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `update_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `votes` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `message`
--

INSERT INTO `message` (`id`, `user_sender_id`, `group_id`, `parent_id`, `msg_type`, `status`, `send_date`, `title`, `content`, `update_date`, `votes`) VALUES
(1, 4, NULL, NULL, 1, 0, '2025-11-21 22:32:06', 'The user has been added', '    <p>User student aouinti with language English registered to the site</p>\n    <p>His profile is</p>\n\n    <div class=\"row\">\n        <div class=\"col-xs-12 col-md-12\">\n            <div class=\"form-horizontal\">\n                <div class=\"form-horizontal\"><div>E-mail: rami.aouinti.dourant@gmail.om</div><div>First name: student</div><div>Last name: aouinti</div><div>Username: rami-aouinti</div><div>Official code: RAMI-AOUINTI</div><div>Language: English</div><div>What do you want to do?: Follow courses</div></div>\n            </div>\n        </div>\n    </div>\n\n    <p>You can assign a tutor in this link <a href=\"https://education.bro-world.org/main/admin/user_information.php?user_id=4\"  >https://education.bro-world.org/main/admin/user_information.php?user_id=4</a></p>\n    <p>Sincerely</p>\n<p>John Rami<br />\n    Manager Bro World<br />\n\n                Email: rami.aouinti@gmail.com\n    </p>\n', '2025-11-21 22:32:59', 0),
(2, 4, NULL, NULL, 1, 0, '2025-11-21 22:32:06', '[Approval for new account] rami-aouinti', '<h4>Approval for new account</h4>\n<ul>\n    <li>Username: rami-aouinti</li>\n            <li>First name: student</li>\n        <li>Last name: aouinti</li>\n        <li>E-mail: rami.aouinti.dourant@gmail.om</li>\n    <li>Status: 5</li>\n</ul>\n<p>Manage user: <a href=\"&lt;a href=&quot;https://education.bro-world.org/main/admin/user_edit.php?user_id=4&quot;  &gt;https://education.bro-world.org/main/admin/user_edit.php?user_id=4&lt;/a&gt;\">&lt;a href=&quot;https://education.bro-world.org/main/admin/user_edit.php?user_id=4&quot;  &gt;https://education.bro-world.org/main/admin/user_edit.php?user_id=4&lt;/a&gt;</a></p>\n', '2025-11-21 22:33:17', 0),
(3, 1, NULL, NULL, 1, 0, '2025-11-21 22:38:31', 'You have been enrolled in a new course', 'Hello student aouinti,<br><br>You have been enrolled in a new session: <strong>aouinti student () Symofny</strong>.<br>You can access your courses from <a href=\"https://education.bro-world.org/sessions\">here</a>.<br><br>Your current active sessions are:<br><ul><li>aouinti student () Symofny</li></ul><br>Best regards,<br>Chamilo', '2025-11-21 22:38:59', 0),
(4, 4, NULL, NULL, 1, 0, '2025-11-22 00:41:23', 'A learner attempted an exercise', 'A learner attempted an exercise<br /><br />Attempt details : <br /><br />\n                    <table>\n                        <tr>\n                            <td>Course name</td>\n                            <td><a href=\"/course/1/home?sid=0\"  >Symofny</a></td>\n                        </tr>\n                        \n                        <tr>\n                            <td>Test</td>\n                            <td>&nbsp;sym</td>\n                        </tr>\n                        <tr>\n                            <td>Learner name</td>\n                            <td>&nbsp;student aouinti</td>\n                        </tr>\n                        <tr>\n                            <td>Learner e-mail</td>\n                            <td>&nbsp;rami.aouinti.dourant@gmail.om</td>\n                        </tr>\n                        \n                    </table><br /><a href=\"https://education.bro-world.org/main/exercise/exercise_show.php?cid=1&sid=0&gid=0&gradebook=0&origin=qualify&id=1&action=qualify\">Click this link to check the answer and/or give feedback</a>', '2025-11-22 00:44:29', 0),
(5, 1, 1, NULL, 5, 0, '2025-11-22 01:12:00', 'test', '<!DOCTYPE html>\r\n<html>\r\n<head>\r\n</head>\r\n<body>\r\n<div class=\"tiny-content\"><p>sddsds</p></div>\r\n</body>\r\n</html>', '2025-11-22 01:12:00', 0),
(6, 1, 1, NULL, 5, 0, '2025-11-22 01:12:07', 'test', '<!DOCTYPE html>\r\n<html>\r\n<head>\r\n</head>\r\n<body>\r\n<div class=\"tiny-content\"><p>sddsds</p></div>\r\n</body>\r\n</html>', '2025-11-22 01:12:07', 0),
(7, 1, 1, NULL, 5, 0, '2025-11-22 01:12:20', 'test', '<!DOCTYPE html>\r\n<html>\r\n<head>\r\n</head>\r\n<body>\r\n<div class=\"tiny-content\"><p>sddsds</p></div>\r\n</body>\r\n</html>', '2025-11-22 01:12:20', 0),
(8, 1, 1, NULL, 5, 0, '2025-11-22 01:12:20', 'test', '<!DOCTYPE html>\r\n<html>\r\n<head>\r\n</head>\r\n<body>\r\n<div class=\"tiny-content\"><p>sddsds</p></div>\r\n</body>\r\n</html>', '2025-11-22 01:12:20', 0),
(9, 1, 1, NULL, 5, 0, '2025-11-22 01:12:21', 'test', '<!DOCTYPE html>\r\n<html>\r\n<head>\r\n</head>\r\n<body>\r\n<div class=\"tiny-content\"><p>sddsds</p></div>\r\n</body>\r\n</html>', '2025-11-22 01:12:21', 0),
(10, 1, 1, NULL, 5, 0, '2025-11-22 01:12:29', 'test', '<!DOCTYPE html>\r\n<html>\r\n<head>\r\n</head>\r\n<body>\r\n<div class=\"tiny-content\"><p>sddsds</p></div>\r\n</body>\r\n</html>', '2025-11-22 01:12:29', 0),
(11, 1, 1, NULL, 5, 0, '2025-11-22 01:12:43', 'testrerer', '<!DOCTYPE html>\r\n<html>\r\n<head>\r\n</head>\r\n<body>\r\n<div class=\"tiny-content\">\r\n<p>sddsdsfddfdfdfffdfdffffffffffffff</p>\r\n</div>\r\n</body>\r\n</html>', '2025-11-22 01:12:43', 0),
(12, 1, 1, NULL, 5, 0, '2025-11-22 01:12:44', 'testrerer', '<!DOCTYPE html>\r\n<html>\r\n<head>\r\n</head>\r\n<body>\r\n<div class=\"tiny-content\">\r\n<p>sddsdsfddfdfdfffdfdffffffffffffff</p>\r\n</div>\r\n</body>\r\n</html>', '2025-11-22 01:12:44', 0),
(13, 1, 1, NULL, 5, 0, '2025-11-22 01:12:45', 'testrerer', '<!DOCTYPE html>\r\n<html>\r\n<head>\r\n</head>\r\n<body>\r\n<div class=\"tiny-content\">\r\n<p>sddsdsfddfdfdfffdfdffffffffffffff</p>\r\n</div>\r\n</body>\r\n</html>', '2025-11-22 01:12:45', 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `message_attachment`
--

CREATE TABLE `message_attachment` (
  `id` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `message_id` int(11) NOT NULL,
  `path` varchar(255) NOT NULL,
  `comment` longtext DEFAULT NULL,
  `size` int(11) NOT NULL,
  `filename` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `message_attachment`
--

INSERT INTO `message_attachment` (`id`, `resource_node_id`, `message_id`, `path`, `comment`, `size`, `filename`) VALUES
(1, 83, 7, '1ed47a74-c9be-43c7-9220-4b76928464b0.jpg', '', 67302, '1ed47a74-c9be-43c7-9220-4b76928464b0.jpg'),
(2, 84, 8, '1ed47a74-c9be-43c7-9220-4b76928464b0.jpg', '', 67302, '1ed47a74-c9be-43c7-9220-4b76928464b0.jpg'),
(3, 85, 9, '1ed47a74-c9be-43c7-9220-4b76928464b0.jpg', '', 67302, '1ed47a74-c9be-43c7-9220-4b76928464b0.jpg'),
(4, 86, 10, '1ed47a74-c9be-43c7-9220-4b76928464b0.jpg', '', 67302, '1ed47a74-c9be-43c7-9220-4b76928464b0.jpg'),
(5, 87, 11, '1ed47a74-c9be-43c7-9220-4b76928464b0.jpg', '', 67302, '1ed47a74-c9be-43c7-9220-4b76928464b0.jpg'),
(6, 88, 12, '1ed47a74-c9be-43c7-9220-4b76928464b0.jpg', '', 67302, '1ed47a74-c9be-43c7-9220-4b76928464b0.jpg'),
(7, 89, 13, '1ed47a74-c9be-43c7-9220-4b76928464b0.jpg', '', 67302, '1ed47a74-c9be-43c7-9220-4b76928464b0.jpg');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `message_rel_user`
--

CREATE TABLE `message_rel_user` (
  `id` int(11) NOT NULL,
  `message_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `msg_read` tinyint(1) NOT NULL,
  `receiver_type` smallint(6) NOT NULL,
  `starred` tinyint(1) NOT NULL,
  `deleted_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `message_rel_user`
--

INSERT INTO `message_rel_user` (`id`, `message_id`, `user_id`, `msg_read`, `receiver_type`, `starred`, `deleted_at`) VALUES
(1, 1, 1, 1, 1, 0, NULL),
(2, 1, 4, 0, 8, 0, NULL),
(3, 2, 1, 1, 1, 0, NULL),
(4, 2, 4, 0, 8, 0, NULL),
(5, 3, 4, 1, 1, 0, NULL),
(6, 3, 1, 0, 8, 0, NULL),
(7, 4, 1, 1, 1, 0, NULL),
(8, 4, 4, 0, 8, 0, NULL),
(9, 5, 1, 0, 1, 0, NULL),
(10, 5, 1, 0, 8, 0, NULL),
(11, 6, 1, 0, 1, 0, NULL),
(12, 6, 1, 0, 8, 0, NULL),
(13, 7, 1, 0, 1, 0, NULL),
(14, 7, 1, 0, 8, 0, NULL),
(15, 8, 1, 0, 1, 0, NULL),
(16, 8, 1, 0, 8, 0, NULL),
(17, 9, 1, 0, 1, 0, NULL),
(18, 9, 1, 0, 8, 0, NULL),
(19, 10, 1, 0, 1, 0, NULL),
(20, 10, 1, 0, 8, 0, NULL),
(21, 11, 1, 0, 1, 0, NULL),
(22, 11, 1, 0, 8, 0, NULL),
(23, 12, 1, 0, 1, 0, NULL),
(24, 12, 1, 0, 8, 0, NULL),
(25, 13, 1, 0, 1, 0, NULL),
(26, 13, 1, 0, 8, 0, NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `message_rel_user_rel_tags`
--

CREATE TABLE `message_rel_user_rel_tags` (
  `message_rel_user_id` int(11) NOT NULL,
  `message_tag_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `message_tag`
--

CREATE TABLE `message_tag` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `tag` varchar(255) NOT NULL,
  `color` varchar(255) NOT NULL,
  `position` int(11) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `notification`
--

CREATE TABLE `notification` (
  `id` int(11) NOT NULL,
  `dest_user_id` int(11) NOT NULL,
  `dest_mail` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `send_freq` smallint(6) DEFAULT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `sent_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `notification`
--

INSERT INTO `notification` (`id`, `dest_user_id`, `dest_mail`, `title`, `content`, `send_freq`, `created_at`, `sent_at`) VALUES
(1, 1, 'rami.aouinti@gmail.com', 'The user has been added', 'You have a new message from student aouinti<br /><hr><br />    <p>User student aouinti with language English registered to the site</p>\n    <p>His profile is</p>\n\n    <div class=\"row\">\n        <div class=\"col-xs-12 col-md-12\">\n            <div class=\"form-horizontal\">\n                <div class=\"form-horizontal\"><div>E-mail: rami.aouinti.dourant@gmail.om</div><div>First name: student</div><div>Last name: aouinti</div><div>Username: rami-aouinti</div><div>Official code: RAMI-AOUINTI</div><div>Language: English</div><div>What do you want to do?: Follow courses</div></div>\n            </div>\n        </div>\n    </div>\n\n    <p>You can assign a tutor in this link <a href=\"https://education.bro-world.org/main/admin/user_information.php?user_id=4\"  >https://education.bro-world.org/main/admin/user_information.php?user_id=4</a></p>\n    <p>Sincerely</p>\n<p>John Rami<br />\n    Manager Bro World<br />\n\n                Email: rami.aouinti@gmail.com\n    </p>\n<br /><br /><a href=\"https://education.bro-world.org/resources/messages/show?id=/api/messages/1\"  >See message</a><br /><hr><i>You have received this notification because you are subscribed or involved in it to change your notification preferences please click here: <a href=\"https://education.bro-world.org/main/auth/profile.php\"  >https://education.bro-world.org/main/auth/profile.php</a></i>', 1, '2025-11-21 22:32:06', '2025-11-21 22:32:06'),
(2, 1, 'rami.aouinti@gmail.com', '[Approval for new account] rami-aouinti', 'You have a new message from student aouinti<br /><hr><br /><h4>Approval for new account</h4>\n<ul>\n    <li>Username: rami-aouinti</li>\n            <li>First name: student</li>\n        <li>Last name: aouinti</li>\n        <li>E-mail: rami.aouinti.dourant@gmail.om</li>\n    <li>Status: 5</li>\n</ul>\n<p>Manage user: <a href=\"&lt;a href=&quot;https://education.bro-world.org/main/admin/user_edit.php?user_id=4&quot;  &gt;https://education.bro-world.org/main/admin/user_edit.php?user_id=4&lt;/a&gt;\">&lt;a href=&quot;https://education.bro-world.org/main/admin/user_edit.php?user_id=4&quot;  &gt;https://education.bro-world.org/main/admin/user_edit.php?user_id=4&lt;/a&gt;</a></p>\n<br /><br /><a href=\"https://education.bro-world.org/resources/messages/show?id=/api/messages/2\"  >See message</a><br /><hr><i>You have received this notification because you are subscribed or involved in it to change your notification preferences please click here: <a href=\"https://education.bro-world.org/main/auth/profile.php\"  >https://education.bro-world.org/main/auth/profile.php</a></i>', 1, '2025-11-21 22:32:06', '2025-11-21 22:32:06'),
(3, 1, 'rami.aouinti@gmail.com', 'A learner attempted an exercise', 'You have a new message from student aouinti<br /><hr><br />A learner attempted an exercise<br /><br />Attempt details : <br /><br />\n                    <table>\n                        <tr>\n                            <td>Course name</td>\n                            <td><a href=\"https://education.bro-world.org/course/1/home?sid=0\"  >Symofny</a></td>\n                        </tr>\n                        \n                        <tr>\n                            <td>Test</td>\n                            <td>&nbsp;sym</td>\n                        </tr>\n                        <tr>\n                            <td>Learner name</td>\n                            <td>&nbsp;student aouinti</td>\n                        </tr>\n                        <tr>\n                            <td>Learner e-mail</td>\n                            <td>&nbsp;rami.aouinti.dourant@gmail.om</td>\n                        </tr>\n                        \n                    </table><br /><a href=\"https://education.bro-world.org/main/exercise/exercise_show.php?cid=1&sid=0&gid=0&gradebook=0&origin=qualify&id=1&action=qualify\">Click this link to check the answer and/or give feedback</a><br /><br /><a href=\"https://education.bro-world.org/resources/messages/show?id=/api/messages/4\"  >See message</a><br /><hr><i>You have received this notification because you are subscribed or involved in it to change your notification preferences please click here: <a href=\"https://education.bro-world.org/main/auth/profile.php\"  >https://education.bro-world.org/main/auth/profile.php</a></i>', 1, '2025-11-22 00:41:23', '2025-11-22 00:41:23');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `notification_event`
--

CREATE TABLE `notification_event` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` longtext DEFAULT NULL,
  `link` longtext DEFAULT NULL,
  `persistent` int(11) DEFAULT NULL,
  `day_diff` int(11) DEFAULT NULL,
  `event_type` varchar(255) NOT NULL,
  `event_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `notification_event_rel_user`
--

CREATE TABLE `notification_event_rel_user` (
  `id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `page`
--

CREATE TABLE `page` (
  `id` int(11) NOT NULL,
  `access_url_id` int(11) DEFAULT NULL,
  `creator_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `slug` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `position` int(11) NOT NULL,
  `locale` varchar(10) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `page`
--

INSERT INTO `page` (`id`, `access_url_id`, `creator_id`, `category_id`, `title`, `content`, `slug`, `enabled`, `position`, `locale`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 'Welcome', 'Welcome to Chamilo', 'welcome', 1, 0, 'en_US', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(2, 1, 1, 4, 'Welcome', '<img src=\"/img/document/images/mr_chamilo/svg/teaching.svg\" />', 'welcome-1', 1, 0, 'en_US', '2025-11-21 22:22:17', '2025-11-21 22:22:17');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `page_category`
--

CREATE TABLE `page_category` (
  `id` int(11) NOT NULL,
  `creator_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `page_category`
--

INSERT INTO `page_category` (`id`, `creator_id`, `title`, `type`, `created_at`, `updated_at`) VALUES
(1, 1, 'home', 'grid', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(2, 1, 'index', 'grid', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(3, 1, 'faq', 'grid', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(4, 1, 'demo', 'grid', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(5, 1, 'footer_public', 'grid', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(6, 1, 'footer_private', 'grid', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(7, 1, 'block-admin-users', 'grid', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(8, 1, 'block-admin-courses', 'grid', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(9, 1, 'block-admin-sessions', 'grid', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(10, 1, 'block-admin-gradebook', 'grid', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(11, 1, 'block-admin-skills', 'grid', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(12, 1, 'block-admin-privacy', 'grid', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(13, 1, 'block-admin-settings', 'grid', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(14, 1, 'block-admin-platform', 'grid', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(15, 1, 'block-admin-chamilo', 'grid', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(16, 1, 'public', 'grid', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(17, 1, 'introduction', 'grid', '2025-11-21 22:22:17', '2025-11-21 22:22:17');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `page_layout`
--

CREATE TABLE `page_layout` (
  `id` int(11) NOT NULL,
  `page_layout_template_id` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `url` longtext NOT NULL,
  `roles` longtext DEFAULT NULL,
  `layout` longtext NOT NULL,
  `created_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `page_layout_template`
--

CREATE TABLE `page_layout_template` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `layout` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `permission`
--

CREATE TABLE `permission` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `permission`
--

INSERT INTO `permission` (`id`, `title`, `slug`, `description`) VALUES
(1, 'View analytics', 'analytics:view', 'View analytics data'),
(2, 'View assigned analytics', 'analytics:viewassigned', 'View results of users assigned to me'),
(3, 'View all analytics', 'analytics:viewall', 'View results of all users'),
(4, 'Create assignment', 'assignment:create', 'Create assignments'),
(5, 'Delete assignment', 'assignment:delete', 'Delete assignments'),
(6, 'Edit assignment', 'assignment:edit', 'Edit assignments'),
(7, 'Grade assignment', 'assignment:grade', 'Grade assignments'),
(8, 'Submit assignment', 'assignment:submit', 'Submit assignments'),
(9, 'View assignment', 'assignment:view', 'View assignments'),
(10, 'Backup', 'backup:backup', 'Backup'),
(11, 'Copy backup', 'backup:copy', 'Copy course content to another course'),
(12, 'Restore backup', 'backup:restore', 'Restore backup'),
(13, 'Configure badge criteria', 'badge:configurecriteria', 'Configure badge criteria'),
(14, 'Create badge', 'badge:create', 'Create badges'),
(15, 'Delete badge', 'badge:delete', 'Delete badges'),
(16, 'Edit badge', 'badge:edit', 'Edit badges'),
(17, 'View badge', 'badge:view', 'View badges'),
(18, 'Create calendar event', 'calendar:create', 'Create calendar events'),
(19, 'Delete calendar event', 'calendar:delete', 'Delete calendar events'),
(20, 'Edit calendar event', 'calendar:edit', 'Edit calendar events'),
(21, 'View courses catalogue', 'catalogue:view', 'View courses catalogue'),
(22, 'Create certificate template', 'certificate:create', 'Create certificate templates'),
(23, 'Delete certificate template', 'certificate:delete', 'Delete certificate templates'),
(24, 'Edit certificate template', 'certificate:edit', 'Edit certificate templates'),
(25, 'Generate certificate', 'certificate:generate', 'Generate certificates'),
(26, 'Generate all certificates', 'certificate:generateall', 'Generate all certificates in a gradebook'),
(27, 'View all certificates', 'certificate:viewall', 'View all instances of one certificate issued to all users'),
(28, 'Assign course to class', 'class:assigncourse', 'Assign a class to a course'),
(29, 'Assign cession to class', 'class:assignsession', 'Assign a class to a session'),
(30, 'Assign user to class', 'class:assignuser', 'Assign a user to a class'),
(31, 'Create class', 'class:create', 'Create global classes of users'),
(32, 'Delete class', 'class:delete', 'Delete global classes'),
(33, 'Edit class', 'class:edit', 'Edit global classes'),
(34, 'View class', 'class:view', 'View global classes details'),
(35, 'Create CMS page', 'cms:create', 'Create CMS pages'),
(36, 'Delete CMS page', 'cms:delete', 'Delete CMS pages'),
(37, 'Edit CMS page', 'cms:edit', 'Edit CMS pages'),
(38, 'Create course space', 'course:create', 'Create courses'),
(39, 'Delete course space', 'course:delete', 'Delete courses'),
(40, 'Download course content', 'course:downloadcoursecontent', 'Download all course content'),
(41, 'Edit own course properties', 'course:edit', 'Edit own course\'s properties'),
(42, 'Edit all course properties', 'course:editall', 'Edit all course\'s properties'),
(43, 'Manage plugins', 'plugin:manage', 'Enable/disable/configure plugins'),
(44, 'Create quiz', 'quiz:create', 'Create quizzes'),
(45, 'Delete quiz', 'quiz:delete', 'Delete quizzes'),
(46, 'Edit quiz', 'quiz:edit', 'Edit quizzes'),
(47, 'Grade quiz', 'quiz:grade', 'Grade quizzes'),
(48, 'View live quiz results', 'quiz:viewliveresults', 'View live quiz results'),
(49, 'Manage question bank', 'quiz:managequestionbank', 'Manage question bank'),
(50, 'Create role', 'role:create', 'Create roles'),
(51, 'Manage role permissions', 'role:managepermissions', 'Assign or remove permissions from roles'),
(52, 'Create session', 'session:create', 'Create sessions'),
(53, 'Delete session', 'session:delete', 'Delete sessions'),
(54, 'Edit own session properties', 'session:edit', 'Edit properties of user\'s own sessions'),
(55, 'Edit all session properties', 'session:editall', 'Edit properties of all sessions'),
(56, 'Assign course to session', 'session:assigncourse', 'Assign a course to a session'),
(57, 'Edit site settings', 'site:editsettings', 'Manage settings of the platform'),
(58, 'Access site maintenance', 'site:maintenanceaccess', 'Access site maintenance'),
(59, 'Manage course competency', 'skill:coursecompetencymanage', 'Assign skills through course grade books'),
(60, 'Review user competency', 'skill:usercompetencyreview', 'Add comments on other user\'s acquired skills'),
(61, 'Assign skill', 'skill:assign', 'Assign a skill to a user'),
(62, 'Create skill', 'skill:create', 'Create skills'),
(63, 'Delete skill', 'skill:delete', 'Delete skills'),
(64, 'Edit skill', 'skill:edit', 'Edit skills'),
(65, 'View skill', 'skill:view', 'View all skills acquired by users in manager\'s context'),
(66, 'View all skills', 'skill:viewall', 'View all skills acquired by users of the platform'),
(67, 'Create survey', 'survey:create', 'Create surveys (global or inside own course)'),
(68, 'Delete survey', 'survey:delete', 'Delete surveys'),
(69, 'Edit survey', 'survey:edit', 'Edit surveys'),
(70, 'Submit survey', 'survey:submit', 'Submit surveys'),
(71, 'View survey results', 'survey:viewresults', 'View survey results'),
(72, 'Comment on ticket', 'ticket:comment', 'Comment on tickets'),
(73, 'Manage tickets', 'ticket:manage', 'Manage the tickets system'),
(74, 'Report ticket', 'ticket:report', 'Create tickets (most users should be able to report issues)'),
(75, 'See ticket issues', 'ticket:seeissues', 'See issue details for issues where user\'s involved'),
(76, 'View all ticket issues', 'ticket:viewallissues', 'View all issues'),
(77, 'Edit tool visibility', 'tool:editvisibility', 'Allow setting the visibility of a tool in a course'),
(78, 'Manage URL', 'url:manage', 'Manage Multi-URL configuration'),
(79, 'Assign classes to URL', 'url:assignclass', 'Assign classes to URL'),
(80, 'Assign courses to URL', 'url:assigncourse', 'Assign courses to URL'),
(81, 'Assign users to URL', 'url:assignuser', 'Assign users to URL'),
(82, 'Assign user to course', 'user:assigncourse', 'Assign a user to a course'),
(83, 'Assign user to session', 'user:assignsession', 'Assign a user to a session'),
(84, 'Create user', 'user:create', 'Create users'),
(85, 'Delete user', 'user:delete', 'Delete users'),
(86, 'Edit user', 'user:edit', 'Edit users'),
(87, 'Edit user Role', 'user:editrole', 'Edit user roles'),
(88, 'Login as user', 'user:loginas', 'Login as another user'),
(89, 'Edit Course Settings', 'course:editsettings', 'Edit settings of a course');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `permission_rel_role`
--

CREATE TABLE `permission_rel_role` (
  `id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  `role_id` int(10) UNSIGNED NOT NULL,
  `changeable` tinyint(1) NOT NULL,
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `permission_rel_role`
--

INSERT INTO `permission_rel_role` (`id`, `permission_id`, `role_id`, `changeable`, `updated_at`) VALUES
(1, 1, 2, 1, '2025-11-21 22:22:18'),
(2, 1, 3, 1, '2025-11-21 22:22:18'),
(3, 1, 4, 1, '2025-11-21 22:22:18'),
(4, 1, 5, 1, '2025-11-21 22:22:18'),
(5, 1, 6, 1, '2025-11-21 22:22:18'),
(6, 1, 7, 1, '2025-11-21 22:22:18'),
(7, 1, 8, 1, '2025-11-21 22:22:18'),
(8, 1, 9, 1, '2025-11-21 22:22:18'),
(9, 1, 10, 1, '2025-11-21 22:22:18'),
(10, 2, 4, 1, '2025-11-21 22:22:18'),
(11, 2, 5, 1, '2025-11-21 22:22:18'),
(12, 2, 6, 1, '2025-11-21 22:22:18'),
(13, 2, 7, 1, '2025-11-21 22:22:18'),
(14, 2, 9, 1, '2025-11-21 22:22:18'),
(15, 2, 10, 1, '2025-11-21 22:22:18'),
(16, 3, 5, 1, '2025-11-21 22:22:18'),
(17, 3, 6, 1, '2025-11-21 22:22:18'),
(18, 3, 9, 1, '2025-11-21 22:22:18'),
(19, 3, 10, 1, '2025-11-21 22:22:18'),
(20, 4, 4, 1, '2025-11-21 22:22:18'),
(21, 5, 4, 1, '2025-11-21 22:22:18'),
(22, 5, 5, 1, '2025-11-21 22:22:18'),
(23, 5, 6, 1, '2025-11-21 22:22:18'),
(24, 6, 4, 1, '2025-11-21 22:22:18'),
(25, 6, 5, 1, '2025-11-21 22:22:18'),
(26, 6, 6, 1, '2025-11-21 22:22:18'),
(27, 7, 4, 1, '2025-11-21 22:22:18'),
(28, 8, 3, 1, '2025-11-21 22:22:18'),
(29, 9, 2, 1, '2025-11-21 22:22:18'),
(30, 9, 3, 1, '2025-11-21 22:22:18'),
(31, 9, 4, 1, '2025-11-21 22:22:18'),
(32, 9, 5, 1, '2025-11-21 22:22:18'),
(33, 9, 6, 1, '2025-11-21 22:22:18'),
(34, 9, 7, 1, '2025-11-21 22:22:18'),
(35, 9, 9, 1, '2025-11-21 22:22:18'),
(36, 9, 10, 1, '2025-11-21 22:22:18'),
(37, 10, 4, 1, '2025-11-21 22:22:18'),
(38, 10, 5, 1, '2025-11-21 22:22:18'),
(39, 10, 6, 1, '2025-11-21 22:22:18'),
(40, 10, 9, 1, '2025-11-21 22:22:18'),
(41, 11, 4, 1, '2025-11-21 22:22:18'),
(42, 11, 5, 1, '2025-11-21 22:22:18'),
(43, 11, 6, 1, '2025-11-21 22:22:18'),
(44, 11, 9, 1, '2025-11-21 22:22:18'),
(45, 12, 4, 1, '2025-11-21 22:22:18'),
(46, 12, 5, 1, '2025-11-21 22:22:18'),
(47, 12, 6, 1, '2025-11-21 22:22:18'),
(48, 12, 9, 1, '2025-11-21 22:22:18'),
(49, 13, 5, 1, '2025-11-21 22:22:18'),
(50, 13, 6, 1, '2025-11-21 22:22:18'),
(51, 13, 9, 1, '2025-11-21 22:22:18'),
(52, 14, 5, 1, '2025-11-21 22:22:18'),
(53, 14, 6, 1, '2025-11-21 22:22:18'),
(54, 14, 9, 1, '2025-11-21 22:22:18'),
(55, 15, 5, 1, '2025-11-21 22:22:18'),
(56, 15, 6, 1, '2025-11-21 22:22:18'),
(57, 15, 9, 1, '2025-11-21 22:22:18'),
(58, 16, 5, 1, '2025-11-21 22:22:18'),
(59, 16, 6, 1, '2025-11-21 22:22:18'),
(60, 16, 9, 1, '2025-11-21 22:22:18'),
(61, 17, 2, 1, '2025-11-21 22:22:18'),
(62, 17, 3, 1, '2025-11-21 22:22:18'),
(63, 17, 4, 1, '2025-11-21 22:22:18'),
(64, 17, 5, 1, '2025-11-21 22:22:18'),
(65, 17, 6, 1, '2025-11-21 22:22:18'),
(66, 17, 9, 1, '2025-11-21 22:22:18'),
(67, 17, 10, 1, '2025-11-21 22:22:18'),
(68, 18, 5, 1, '2025-11-21 22:22:18'),
(69, 18, 6, 1, '2025-11-21 22:22:18'),
(70, 19, 5, 1, '2025-11-21 22:22:18'),
(71, 19, 6, 1, '2025-11-21 22:22:18'),
(72, 20, 5, 1, '2025-11-21 22:22:18'),
(73, 20, 6, 1, '2025-11-21 22:22:18'),
(74, 21, 2, 1, '2025-11-21 22:22:18'),
(75, 21, 3, 1, '2025-11-21 22:22:18'),
(76, 21, 4, 1, '2025-11-21 22:22:18'),
(77, 21, 5, 1, '2025-11-21 22:22:18'),
(78, 21, 6, 1, '2025-11-21 22:22:18'),
(79, 21, 7, 1, '2025-11-21 22:22:18'),
(80, 21, 8, 1, '2025-11-21 22:22:18'),
(81, 21, 9, 1, '2025-11-21 22:22:18'),
(82, 21, 10, 1, '2025-11-21 22:22:18'),
(83, 22, 4, 1, '2025-11-21 22:22:18'),
(84, 22, 9, 1, '2025-11-21 22:22:18'),
(85, 23, 4, 1, '2025-11-21 22:22:18'),
(86, 23, 9, 1, '2025-11-21 22:22:18'),
(87, 24, 4, 1, '2025-11-21 22:22:18'),
(88, 24, 9, 1, '2025-11-21 22:22:18'),
(89, 25, 3, 1, '2025-11-21 22:22:18'),
(90, 25, 4, 1, '2025-11-21 22:22:18'),
(91, 25, 9, 1, '2025-11-21 22:22:18'),
(92, 26, 4, 1, '2025-11-21 22:22:18'),
(93, 26, 7, 1, '2025-11-21 22:22:18'),
(94, 26, 9, 1, '2025-11-21 22:22:18'),
(95, 27, 4, 1, '2025-11-21 22:22:18'),
(96, 27, 7, 1, '2025-11-21 22:22:18'),
(97, 27, 9, 1, '2025-11-21 22:22:18'),
(98, 27, 10, 1, '2025-11-21 22:22:18'),
(99, 28, 4, 1, '2025-11-21 22:22:18'),
(100, 28, 5, 1, '2025-11-21 22:22:18'),
(101, 28, 6, 1, '2025-11-21 22:22:18'),
(102, 29, 5, 1, '2025-11-21 22:22:18'),
(103, 29, 6, 1, '2025-11-21 22:22:18'),
(104, 29, 9, 1, '2025-11-21 22:22:18'),
(105, 30, 5, 1, '2025-11-21 22:22:18'),
(106, 30, 6, 1, '2025-11-21 22:22:18'),
(107, 30, 9, 1, '2025-11-21 22:22:18'),
(108, 31, 5, 1, '2025-11-21 22:22:18'),
(109, 31, 6, 1, '2025-11-21 22:22:18'),
(110, 31, 9, 1, '2025-11-21 22:22:18'),
(111, 32, 5, 1, '2025-11-21 22:22:18'),
(112, 32, 6, 1, '2025-11-21 22:22:18'),
(113, 32, 9, 1, '2025-11-21 22:22:18'),
(114, 33, 5, 1, '2025-11-21 22:22:18'),
(115, 33, 6, 1, '2025-11-21 22:22:18'),
(116, 33, 9, 1, '2025-11-21 22:22:18'),
(117, 34, 3, 1, '2025-11-21 22:22:18'),
(118, 34, 4, 1, '2025-11-21 22:22:18'),
(119, 34, 5, 1, '2025-11-21 22:22:18'),
(120, 34, 6, 1, '2025-11-21 22:22:18'),
(121, 34, 9, 1, '2025-11-21 22:22:18'),
(122, 35, 5, 1, '2025-11-21 22:22:18'),
(123, 35, 6, 1, '2025-11-21 22:22:18'),
(124, 36, 5, 1, '2025-11-21 22:22:18'),
(125, 36, 6, 1, '2025-11-21 22:22:18'),
(126, 37, 5, 1, '2025-11-21 22:22:18'),
(127, 37, 6, 1, '2025-11-21 22:22:18'),
(128, 38, 4, 1, '2025-11-21 22:22:18'),
(129, 38, 5, 1, '2025-11-21 22:22:18'),
(130, 38, 6, 1, '2025-11-21 22:22:18'),
(131, 38, 9, 1, '2025-11-21 22:22:18'),
(132, 39, 4, 1, '2025-11-21 22:22:18'),
(133, 39, 5, 1, '2025-11-21 22:22:18'),
(134, 39, 6, 1, '2025-11-21 22:22:18'),
(135, 40, 4, 1, '2025-11-21 22:22:18'),
(136, 40, 5, 1, '2025-11-21 22:22:18'),
(137, 40, 6, 1, '2025-11-21 22:22:18'),
(138, 40, 9, 1, '2025-11-21 22:22:18'),
(139, 41, 4, 1, '2025-11-21 22:22:18'),
(140, 41, 9, 1, '2025-11-21 22:22:18'),
(141, 42, 5, 1, '2025-11-21 22:22:18'),
(142, 42, 6, 1, '2025-11-21 22:22:18'),
(143, 43, 5, 1, '2025-11-21 22:22:18'),
(144, 43, 6, 1, '2025-11-21 22:22:18'),
(145, 44, 4, 1, '2025-11-21 22:22:18'),
(146, 44, 8, 1, '2025-11-21 22:22:18'),
(147, 45, 4, 1, '2025-11-21 22:22:18'),
(148, 45, 8, 1, '2025-11-21 22:22:18'),
(149, 46, 4, 1, '2025-11-21 22:22:18'),
(150, 46, 8, 1, '2025-11-21 22:22:18'),
(151, 47, 4, 1, '2025-11-21 22:22:18'),
(152, 48, 4, 1, '2025-11-21 22:22:18'),
(153, 48, 9, 1, '2025-11-21 22:22:18'),
(154, 49, 5, 1, '2025-11-21 22:22:18'),
(155, 49, 6, 1, '2025-11-21 22:22:18'),
(156, 49, 8, 1, '2025-11-21 22:22:18'),
(157, 50, 5, 1, '2025-11-21 22:22:18'),
(158, 50, 6, 1, '2025-11-21 22:22:18'),
(159, 51, 5, 1, '2025-11-21 22:22:18'),
(160, 51, 6, 1, '2025-11-21 22:22:18'),
(161, 52, 5, 1, '2025-11-21 22:22:18'),
(162, 52, 6, 1, '2025-11-21 22:22:18'),
(163, 52, 9, 1, '2025-11-21 22:22:18'),
(164, 53, 5, 1, '2025-11-21 22:22:18'),
(165, 53, 6, 1, '2025-11-21 22:22:18'),
(166, 53, 9, 1, '2025-11-21 22:22:18'),
(167, 54, 5, 1, '2025-11-21 22:22:18'),
(168, 54, 6, 1, '2025-11-21 22:22:18'),
(169, 54, 9, 1, '2025-11-21 22:22:18'),
(170, 55, 5, 1, '2025-11-21 22:22:18'),
(171, 55, 6, 1, '2025-11-21 22:22:18'),
(172, 55, 9, 1, '2025-11-21 22:22:18'),
(173, 56, 5, 1, '2025-11-21 22:22:18'),
(174, 56, 6, 1, '2025-11-21 22:22:18'),
(175, 56, 9, 1, '2025-11-21 22:22:18'),
(176, 57, 5, 1, '2025-11-21 22:22:18'),
(177, 57, 6, 1, '2025-11-21 22:22:18'),
(178, 58, 5, 1, '2025-11-21 22:22:18'),
(179, 58, 6, 1, '2025-11-21 22:22:18'),
(180, 59, 4, 1, '2025-11-21 22:22:18'),
(181, 59, 5, 1, '2025-11-21 22:22:18'),
(182, 59, 6, 1, '2025-11-21 22:22:18'),
(183, 59, 7, 1, '2025-11-21 22:22:18'),
(184, 60, 3, 1, '2025-11-21 22:22:18'),
(185, 60, 4, 1, '2025-11-21 22:22:18'),
(186, 60, 5, 1, '2025-11-21 22:22:18'),
(187, 60, 6, 1, '2025-11-21 22:22:18'),
(188, 61, 5, 1, '2025-11-21 22:22:18'),
(189, 61, 6, 1, '2025-11-21 22:22:18'),
(190, 62, 6, 1, '2025-11-21 22:22:18'),
(191, 63, 6, 1, '2025-11-21 22:22:18'),
(192, 64, 6, 1, '2025-11-21 22:22:18'),
(193, 65, 5, 1, '2025-11-21 22:22:18'),
(194, 65, 6, 1, '2025-11-21 22:22:18'),
(195, 65, 9, 1, '2025-11-21 22:22:18'),
(196, 65, 10, 1, '2025-11-21 22:22:18'),
(197, 66, 5, 1, '2025-11-21 22:22:18'),
(198, 66, 6, 1, '2025-11-21 22:22:18'),
(199, 66, 9, 1, '2025-11-21 22:22:18'),
(200, 66, 10, 1, '2025-11-21 22:22:18'),
(201, 67, 4, 1, '2025-11-21 22:22:18'),
(202, 68, 4, 1, '2025-11-21 22:22:18'),
(203, 69, 4, 1, '2025-11-21 22:22:18'),
(204, 70, 2, 1, '2025-11-21 22:22:18'),
(205, 70, 3, 1, '2025-11-21 22:22:18'),
(206, 70, 4, 1, '2025-11-21 22:22:18'),
(207, 70, 5, 1, '2025-11-21 22:22:18'),
(208, 70, 6, 1, '2025-11-21 22:22:18'),
(209, 70, 9, 1, '2025-11-21 22:22:18'),
(210, 70, 10, 1, '2025-11-21 22:22:18'),
(211, 71, 4, 1, '2025-11-21 22:22:18'),
(212, 71, 7, 1, '2025-11-21 22:22:18'),
(213, 71, 9, 1, '2025-11-21 22:22:18'),
(214, 71, 10, 1, '2025-11-21 22:22:18'),
(215, 72, 3, 1, '2025-11-21 22:22:18'),
(216, 72, 4, 1, '2025-11-21 22:22:18'),
(217, 72, 5, 1, '2025-11-21 22:22:18'),
(218, 72, 6, 1, '2025-11-21 22:22:18'),
(219, 72, 7, 1, '2025-11-21 22:22:18'),
(220, 72, 8, 1, '2025-11-21 22:22:18'),
(221, 72, 9, 1, '2025-11-21 22:22:18'),
(222, 72, 10, 1, '2025-11-21 22:22:18'),
(223, 73, 5, 1, '2025-11-21 22:22:18'),
(224, 73, 6, 1, '2025-11-21 22:22:18'),
(225, 74, 3, 1, '2025-11-21 22:22:18'),
(226, 74, 4, 1, '2025-11-21 22:22:18'),
(227, 74, 5, 1, '2025-11-21 22:22:18'),
(228, 74, 6, 1, '2025-11-21 22:22:18'),
(229, 74, 7, 1, '2025-11-21 22:22:18'),
(230, 74, 8, 1, '2025-11-21 22:22:18'),
(231, 74, 9, 1, '2025-11-21 22:22:18'),
(232, 74, 10, 1, '2025-11-21 22:22:18'),
(233, 75, 3, 1, '2025-11-21 22:22:18'),
(234, 75, 4, 1, '2025-11-21 22:22:18'),
(235, 75, 5, 1, '2025-11-21 22:22:18'),
(236, 75, 6, 1, '2025-11-21 22:22:18'),
(237, 75, 9, 1, '2025-11-21 22:22:18'),
(238, 75, 10, 1, '2025-11-21 22:22:18'),
(239, 76, 5, 1, '2025-11-21 22:22:18'),
(240, 76, 6, 1, '2025-11-21 22:22:18'),
(241, 76, 9, 1, '2025-11-21 22:22:18'),
(242, 76, 10, 1, '2025-11-21 22:22:18'),
(243, 77, 4, 1, '2025-11-21 22:22:18'),
(244, 77, 5, 1, '2025-11-21 22:22:18'),
(245, 77, 6, 1, '2025-11-21 22:22:18'),
(246, 77, 9, 1, '2025-11-21 22:22:18'),
(247, 78, 6, 1, '2025-11-21 22:22:18'),
(248, 79, 6, 1, '2025-11-21 22:22:18'),
(249, 80, 6, 1, '2025-11-21 22:22:18'),
(250, 81, 6, 1, '2025-11-21 22:22:18'),
(251, 82, 4, 1, '2025-11-21 22:22:18'),
(252, 82, 5, 1, '2025-11-21 22:22:18'),
(253, 82, 6, 1, '2025-11-21 22:22:18'),
(254, 83, 5, 1, '2025-11-21 22:22:18'),
(255, 83, 6, 1, '2025-11-21 22:22:18'),
(256, 83, 9, 1, '2025-11-21 22:22:18'),
(257, 84, 5, 1, '2025-11-21 22:22:18'),
(258, 84, 6, 1, '2025-11-21 22:22:18'),
(259, 85, 5, 1, '2025-11-21 22:22:18'),
(260, 85, 6, 1, '2025-11-21 22:22:18'),
(261, 86, 5, 1, '2025-11-21 22:22:18'),
(262, 86, 6, 1, '2025-11-21 22:22:18'),
(263, 87, 5, 1, '2025-11-21 22:22:18'),
(264, 87, 6, 1, '2025-11-21 22:22:18'),
(265, 88, 5, 1, '2025-11-21 22:22:18'),
(266, 88, 6, 1, '2025-11-21 22:22:18'),
(267, 89, 4, 1, '2025-11-21 22:22:18'),
(268, 89, 5, 1, '2025-11-21 22:22:18'),
(269, 89, 6, 1, '2025-11-21 22:22:18');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `personal_file`
--

CREATE TABLE `personal_file` (
  `id` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `comment` longtext DEFAULT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `personal_file`
--

INSERT INTO `personal_file` (`id`, `resource_node_id`, `title`, `comment`, `created_at`, `updated_at`) VALUES
(1, 68, 'test', NULL, '2025-11-21 22:49:27', '2025-11-21 22:49:27'),
(2, 69, 'test', NULL, '2025-11-21 22:50:37', '2025-11-21 22:50:37');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `plugin`
--

CREATE TABLE `plugin` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `installed` tinyint(1) NOT NULL,
  `installed_version` varchar(20) NOT NULL,
  `source` varchar(20) NOT NULL DEFAULT 'third_party'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `portfolio`
--

CREATE TABLE `portfolio` (
  `id` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `duplicated_from` int(11) DEFAULT NULL,
  `title` longtext NOT NULL,
  `content` longtext NOT NULL,
  `visibility` smallint(6) NOT NULL DEFAULT 1,
  `origin` int(11) DEFAULT NULL,
  `origin_type` int(11) DEFAULT NULL,
  `score` double DEFAULT NULL,
  `is_highlighted` tinyint(1) NOT NULL DEFAULT 0,
  `is_template` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `portfolio_category`
--

CREATE TABLE `portfolio_category` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `title` longtext NOT NULL,
  `description` longtext DEFAULT NULL,
  `is_visible` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `portfolio_comment`
--

CREATE TABLE `portfolio_comment` (
  `id` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `item_id` int(11) NOT NULL,
  `visibility` smallint(6) NOT NULL DEFAULT 1,
  `content` longtext NOT NULL,
  `date` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `is_important` tinyint(1) NOT NULL DEFAULT 0,
  `score` double DEFAULT NULL,
  `is_template` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `portfolio_rel_tag`
--

CREATE TABLE `portfolio_rel_tag` (
  `id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  `c_id` int(11) NOT NULL,
  `session_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `promotion`
--

CREATE TABLE `promotion` (
  `id` int(11) NOT NULL,
  `career_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `push_subscription`
--

CREATE TABLE `push_subscription` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `endpoint` longtext NOT NULL,
  `public_key` longtext NOT NULL,
  `auth_token` longtext NOT NULL,
  `content_encoding` varchar(20) DEFAULT 'aesgcm',
  `user_agent` longtext DEFAULT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `reset_password_request`
--

CREATE TABLE `reset_password_request` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `selector` varchar(20) NOT NULL,
  `hashed_token` varchar(100) NOT NULL,
  `requested_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `expires_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `resource_comment`
--

CREATE TABLE `resource_comment` (
  `id` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `author_id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `content` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `root` int(11) DEFAULT NULL,
  `lvl` int(11) NOT NULL,
  `lft` int(11) NOT NULL,
  `rgt` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `resource_file`
--

CREATE TABLE `resource_file` (
  `id` int(11) NOT NULL,
  `access_url_id` int(11) DEFAULT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `mime_type` longtext DEFAULT NULL,
  `original_name` longtext DEFAULT NULL,
  `dimensions` longtext DEFAULT NULL COMMENT '(DC2Type:simple_array)',
  `size` int(11) NOT NULL,
  `crop` varchar(255) DEFAULT NULL,
  `metadata` longtext DEFAULT NULL COMMENT '(DC2Type:array)',
  `description` longtext DEFAULT NULL,
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `resource_file`
--

INSERT INTO `resource_file` (`id`, `access_url_id`, `resource_node_id`, `title`, `mime_type`, `original_name`, `dimensions`, `size`, `crop`, `metadata`, `description`, `updated_at`, `created_at`) VALUES
(1, NULL, 40, 'collaborative-6920e79a85e13626489467.svg', 'image/svg+xml', 'collaborative.svg', NULL, 102423, NULL, 'a:0:{}', '', '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(2, NULL, 41, 'teaching-6920e79a8c449806775818.svg', 'image/svg+xml', 'teaching.svg', NULL, 55100, NULL, 'a:0:{}', '', '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(3, NULL, 42, 'doubts-6920e79a91c9a232469020.png', 'image/png', 'doubts.png', '219,322', 22125, NULL, 'a:0:{}', '', '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(4, NULL, 43, 'collaborative-6920e79a973fa221297271.png', 'image/png', 'collaborative.png', '302,317', 36614, NULL, 'a:0:{}', '', '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(5, NULL, 44, 'listeningcomprehension-6920e79a9cf77146944103.mp3', 'audio/mpeg', 'ListeningComprehension.mp3', NULL, 147854, NULL, 'a:0:{}', '', '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(6, NULL, 58, 'messages-2025-11-21-sid-1-log-6920ea4b1356c879529669.txt', 'text/plain', 'messages-2025-11-21_sid-1-log.html', NULL, 1090, NULL, 'a:0:{}', '', '2025-11-21 22:43:24', '2025-11-21 22:40:11'),
(7, NULL, 59, 'messages-2025-11-21-sid-1-log-6920ea4b170ef620131397.txt', 'text/plain', 'messages-2025-11-21_sid-1-log.html', NULL, 1090, NULL, 'a:0:{}', NULL, '2025-11-21 22:43:24', '2025-11-21 22:40:11'),
(8, NULL, 62, 'messages-2025-11-21-uid-1-1-log-6920eaa9c4c51037882649.txt', 'text/plain', 'messages-2025-11-21_uid-1-1-log.html', NULL, 352, NULL, 'a:0:{}', '', '2025-11-21 22:41:45', '2025-11-21 22:41:45'),
(9, NULL, 63, 'messages-2025-11-21-uid-1-1-log-6920eaa9c7c2a528688413.txt', 'text/plain', 'messages-2025-11-21_uid-1-1-log.html', NULL, 352, NULL, 'a:0:{}', NULL, '2025-11-21 22:41:45', '2025-11-21 22:41:45'),
(10, NULL, 66, 'messages-2025-11-21-log-6920ead14643d431317393.txt', 'text/plain', 'messages-2025-11-21-log.html', NULL, 354, NULL, 'a:0:{}', '', '2025-11-21 22:42:25', '2025-11-21 22:42:25'),
(11, NULL, 67, 'messages-2025-11-21-log-6920ead1492af568021252.txt', 'text/plain', 'messages-2025-11-21-log.html', NULL, 354, NULL, 'a:0:{}', NULL, '2025-11-21 22:42:25', '2025-11-21 22:42:25'),
(12, NULL, 72, 'messages-2025-11-22-uid-1-4-log-6921028a434cd242276661.txt', 'text/plain', 'messages-2025-11-22_uid-1-4-log.html', NULL, 1087, NULL, 'a:0:{}', '', '2025-11-22 00:24:27', '2025-11-22 00:23:38'),
(13, NULL, 73, 'messages-2025-11-22-uid-1-4-log-6921028a479de834758053.txt', 'text/plain', 'messages-2025-11-22_uid-1-4-log.html', NULL, 1087, NULL, 'a:0:{}', NULL, '2025-11-22 00:24:27', '2025-11-22 00:23:38'),
(14, NULL, 76, 'messages-2025-11-22-log-692102da9ef0b171053929.txt', 'text/plain', 'messages-2025-11-22-log.html', NULL, 720, NULL, 'a:0:{}', '', '2025-11-22 00:25:10', '2025-11-22 00:24:58'),
(15, NULL, 77, 'messages-2025-11-22-log-692102daa238c991366172.txt', 'text/plain', 'messages-2025-11-22-log.html', NULL, 720, NULL, 'a:0:{}', NULL, '2025-11-22 00:25:10', '2025-11-22 00:24:58'),
(16, NULL, 81, 'default-certificate-692109bcdf996726983345.html', 'text/html', 'Default certificate', NULL, 7382, NULL, 'a:0:{}', '', '2025-11-22 00:54:20', '2025-11-22 00:54:20'),
(17, NULL, 83, '1ed47a74-c9be-43c7-9220-4b76928464b0-69210df423574153766403.jpg', 'image/jpeg', '1ed47a74-c9be-43c7-9220-4b76928464b0.jpg', '1120,1494', 67302, NULL, 'a:0:{}', '', '2025-11-22 01:12:20', '2025-11-22 01:12:20'),
(18, NULL, 84, '1ed47a74-c9be-43c7-9220-4b76928464b0-69210df4c9d67565755884.jpg', 'image/jpeg', '1ed47a74-c9be-43c7-9220-4b76928464b0.jpg', '1120,1494', 67302, NULL, 'a:0:{}', '', '2025-11-22 01:12:20', '2025-11-22 01:12:20'),
(19, NULL, 85, '1ed47a74-c9be-43c7-9220-4b76928464b0-69210df51806a263369717.jpg', 'image/jpeg', '1ed47a74-c9be-43c7-9220-4b76928464b0.jpg', '1120,1494', 67302, NULL, 'a:0:{}', '', '2025-11-22 01:12:21', '2025-11-22 01:12:21'),
(20, NULL, 86, '1ed47a74-c9be-43c7-9220-4b76928464b0-69210dfd1e630169841999.jpg', 'image/jpeg', '1ed47a74-c9be-43c7-9220-4b76928464b0.jpg', '1120,1494', 67302, NULL, 'a:0:{}', '', '2025-11-22 01:12:29', '2025-11-22 01:12:29'),
(21, NULL, 87, '1ed47a74-c9be-43c7-9220-4b76928464b0-69210e0c013d9763432824.jpg', 'image/jpeg', '1ed47a74-c9be-43c7-9220-4b76928464b0.jpg', '1120,1494', 67302, NULL, 'a:0:{}', '', '2025-11-22 01:12:44', '2025-11-22 01:12:44'),
(22, NULL, 88, '1ed47a74-c9be-43c7-9220-4b76928464b0-69210e0ce2536614662534.jpg', 'image/jpeg', '1ed47a74-c9be-43c7-9220-4b76928464b0.jpg', '1120,1494', 67302, NULL, 'a:0:{}', '', '2025-11-22 01:12:44', '2025-11-22 01:12:44'),
(23, NULL, 89, '1ed47a74-c9be-43c7-9220-4b76928464b0-69210e0d38f6e726101622.jpg', 'image/jpeg', '1ed47a74-c9be-43c7-9220-4b76928464b0.jpg', '1120,1494', 67302, NULL, 'a:0:{}', '', '2025-11-22 01:12:45', '2025-11-22 01:12:45');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `resource_format`
--

CREATE TABLE `resource_format` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `resource_format`
--

INSERT INTO `resource_format` (`id`, `title`, `created_at`, `updated_at`) VALUES
(1, 'html', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(2, 'txt', '2025-11-21 22:22:17', '2025-11-21 22:22:17');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `resource_link`
--

CREATE TABLE `resource_link` (
  `id` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `c_id` int(11) DEFAULT NULL,
  `session_id` int(11) DEFAULT NULL,
  `usergroup_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `visibility` int(11) NOT NULL,
  `start_visibility_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `end_visibility_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `display_order` int(11) NOT NULL,
  `resource_type_group` int(11) NOT NULL,
  `deleted_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `resource_link`
--

INSERT INTO `resource_link` (`id`, `resource_node_id`, `c_id`, `session_id`, `usergroup_id`, `group_id`, `user_id`, `visibility`, `start_visibility_at`, `end_visibility_at`, `display_order`, `resource_type_group`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 6, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 0, 15, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(2, 7, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 1, 15, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(3, 8, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 2, 15, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(4, 9, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 3, 15, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(5, 10, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 4, 15, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(6, 11, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 5, 15, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(7, 12, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 6, 15, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(8, 13, 1, NULL, NULL, NULL, NULL, 0, NULL, NULL, 7, 15, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(9, 14, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 8, 15, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(10, 15, 1, NULL, NULL, NULL, NULL, 0, NULL, NULL, 9, 15, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(11, 16, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 10, 15, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(12, 17, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 11, 15, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(13, 18, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 12, 15, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(14, 19, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 13, 15, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(15, 20, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 14, 15, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(16, 21, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 15, 15, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(17, 22, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 16, 15, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(18, 23, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 17, 15, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(19, 24, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 18, 15, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(20, 25, 1, NULL, NULL, NULL, NULL, 0, NULL, NULL, 19, 15, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(21, 26, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 20, 15, NULL, '2025-11-21 22:28:42', '2025-11-21 22:29:11'),
(22, 27, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 21, 15, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(23, 28, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 22, 15, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(24, 29, 1, NULL, NULL, NULL, NULL, 0, NULL, NULL, 23, 15, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(25, 30, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 24, 15, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(26, 31, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 25, 15, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(27, 32, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 26, 15, NULL, '2025-11-21 22:28:42', '2025-11-21 22:29:08'),
(28, 33, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 0, 36, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(29, 34, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 0, 17, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(30, 35, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 1, 17, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(31, 36, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 2, 17, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(32, 37, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 3, 17, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(33, 38, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 4, 17, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(34, 39, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 5, 17, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(35, 40, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 6, 17, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(36, 41, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 7, 17, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(37, 42, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 8, 17, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(38, 43, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 9, 17, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(39, 44, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 10, 17, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(40, 45, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 0, 1, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(41, 46, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 27, 15, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(42, 47, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 28, 15, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(43, 49, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 0, 25, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(44, 50, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 0, 23, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(45, 51, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 0, 27, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(46, 52, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 0, 26, NULL, '2025-11-21 22:28:42', '2025-11-21 22:28:42'),
(47, 53, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 0, 48, NULL, '2025-11-21 22:30:52', '2025-11-21 22:30:52'),
(48, 55, 1, 1, NULL, NULL, NULL, 0, NULL, NULL, 0, 17, NULL, '2025-11-21 22:39:57', '2025-11-21 22:39:57'),
(49, 57, 1, 1, NULL, NULL, NULL, 2, NULL, NULL, 0, 12, NULL, '2025-11-21 22:40:11', '2025-11-21 22:40:11'),
(50, 58, 1, 1, NULL, NULL, NULL, 2, NULL, NULL, 1, 12, NULL, '2025-11-21 22:40:11', '2025-11-21 22:40:11'),
(51, 59, 1, 1, NULL, NULL, NULL, 2, NULL, NULL, 1, 17, NULL, '2025-11-21 22:40:11', '2025-11-21 22:40:11'),
(52, 61, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 0, 12, NULL, '2025-11-21 22:41:45', '2025-11-21 22:41:45'),
(53, 62, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 1, 12, NULL, '2025-11-21 22:41:45', '2025-11-21 22:41:45'),
(54, 63, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 11, 17, NULL, '2025-11-21 22:41:45', '2025-11-21 22:41:45'),
(55, 65, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 2, 12, NULL, '2025-11-21 22:42:25', '2025-11-21 22:42:25'),
(56, 66, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 3, 12, NULL, '2025-11-21 22:42:25', '2025-11-21 22:42:25'),
(57, 67, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 12, 17, NULL, '2025-11-21 22:42:25', '2025-11-21 22:42:25'),
(58, 71, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 4, 12, NULL, '2025-11-22 00:23:38', '2025-11-22 00:23:38'),
(59, 72, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 5, 12, NULL, '2025-11-22 00:23:38', '2025-11-22 00:23:38'),
(60, 73, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 13, 17, NULL, '2025-11-22 00:23:38', '2025-11-22 00:23:38'),
(61, 75, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 6, 12, NULL, '2025-11-22 00:24:58', '2025-11-22 00:24:58'),
(62, 76, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 7, 12, NULL, '2025-11-22 00:24:58', '2025-11-22 00:24:58'),
(63, 77, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 14, 17, NULL, '2025-11-22 00:24:58', '2025-11-22 00:24:58'),
(64, 78, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 0, 19, NULL, '2025-11-22 00:39:37', '2025-11-22 00:39:37'),
(65, 79, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 0, 20, NULL, '2025-11-22 00:40:34', '2025-11-22 00:40:34'),
(66, 81, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 15, 17, NULL, '2025-11-22 00:54:20', '2025-11-22 00:54:20'),
(67, 83, NULL, NULL, NULL, NULL, 1, 2, NULL, NULL, 0, 50, NULL, '2025-11-22 01:12:20', '2025-11-22 01:12:20'),
(68, 84, NULL, NULL, NULL, NULL, 1, 2, NULL, NULL, 1, 50, NULL, '2025-11-22 01:12:20', '2025-11-22 01:12:20'),
(69, 85, NULL, NULL, NULL, NULL, 1, 2, NULL, NULL, 2, 50, NULL, '2025-11-22 01:12:21', '2025-11-22 01:12:21'),
(70, 86, NULL, NULL, NULL, NULL, 1, 2, NULL, NULL, 3, 50, NULL, '2025-11-22 01:12:29', '2025-11-22 01:12:29'),
(71, 87, NULL, NULL, NULL, NULL, 1, 2, NULL, NULL, 4, 50, NULL, '2025-11-22 01:12:44', '2025-11-22 01:12:44'),
(72, 88, NULL, NULL, NULL, NULL, 1, 2, NULL, NULL, 5, 50, NULL, '2025-11-22 01:12:44', '2025-11-22 01:12:44'),
(73, 89, NULL, NULL, NULL, NULL, 1, 2, NULL, NULL, 6, 50, NULL, '2025-11-22 01:12:45', '2025-11-22 01:12:45');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `resource_node`
--

CREATE TABLE `resource_node` (
  `id` int(11) NOT NULL,
  `resource_type_id` int(11) NOT NULL,
  `resource_format_id` int(11) DEFAULT NULL,
  `creator_id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `level` int(11) DEFAULT NULL,
  `path` longtext DEFAULT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `public` tinyint(1) NOT NULL,
  `uuid` binary(16) NOT NULL COMMENT '(DC2Type:uuid)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `resource_node`
--

INSERT INTO `resource_node` (`id`, `resource_type_id`, `resource_format_id`, `creator_id`, `parent_id`, `title`, `slug`, `level`, `path`, `created_at`, `updated_at`, `public`, `uuid`) VALUES
(1, 30, NULL, 1, NULL, 'admin', 'admin', 1, 'admin-1/', '2025-11-21 22:22:16', '2025-11-21 22:22:16', 0, 0x73be0c5c25a2454083abd34fb21a321d),
(2, 30, NULL, 1, NULL, 'anon', 'anon', 1, 'anon-2/', '2025-11-21 22:22:16', '2025-11-21 22:22:16', 0, 0x90514f61b2d5460b9bf5e3836a85b675),
(3, 30, NULL, 1, NULL, 'fallback_user', 'fallback-user', 1, 'fallback_user-3/', '2025-11-21 22:22:16', '2025-11-21 22:22:16', 0, 0x3e563ea0081d477092cbfc8cfdacf7b9),
(4, 28, NULL, 1, NULL, 'localhost', 'localhost', 1, 'localhost-4/', '2025-11-21 22:22:16', '2025-11-21 22:22:16', 0, 0x1eaaf65d0aa9479f8fb0b873698512df),
(5, 29, 2, 1, 4, 'SYMFONY', 'symfony', 2, 'localhost-4/SYMFONY-5/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0x276370ef2b1946b084706166fe8778ad),
(6, 15, 2, 1, 5, 'agenda', 'agenda', 3, 'localhost-4/SYMFONY-5/agenda-6/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0x5fc0da06e53143d18023121f61f1d37d),
(7, 15, 2, 1, 5, 'announcement', 'announcement', 3, 'localhost-4/SYMFONY-5/announcement-7/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0x3b48528937324c3eb664348af7358241),
(8, 15, 2, 1, 5, 'student_publication', 'student-publication', 3, 'localhost-4/SYMFONY-5/student_publication-8/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0x1b1e3f0a4540434d988b0db8d2cb5d32),
(9, 15, 2, 1, 5, 'attendance', 'attendance', 3, 'localhost-4/SYMFONY-5/attendance-9/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0xc5cf98d1229e41988e0587ec94c2d99e),
(10, 15, 2, 1, 5, 'blog', 'blog', 3, 'localhost-4/SYMFONY-5/blog-10/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0x39fe7fb2d369496facf7d145568c0042),
(11, 15, 2, 1, 5, 'chat', 'chat', 3, 'localhost-4/SYMFONY-5/chat-11/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0x8519f0e8081f459cab470065660056ad),
(12, 15, 2, 1, 5, 'course_description', 'course-description', 3, 'localhost-4/SYMFONY-5/course_description-12/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0x6b1f83dc9bf246dfafece9a6c3dc5cd9),
(13, 15, 2, 1, 5, 'course_homepage', 'course-homepage', 3, 'localhost-4/SYMFONY-5/course_homepage-13/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0xcb21dce87a1c45cba2703a708aed0ff3),
(14, 15, 2, 1, 5, 'course_progress', 'course-progress', 3, 'localhost-4/SYMFONY-5/course_progress-14/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0xd3741ad0d3744bdfb0cd6ff875b7c3f0),
(15, 15, 2, 1, 5, 'course_tool', 'course-tool', 3, 'localhost-4/SYMFONY-5/course_tool-15/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0xf69628cb2c9f45ba900beca7d1f2cda7),
(16, 15, 2, 1, 5, 'document', 'document', 3, 'localhost-4/SYMFONY-5/document-16/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0xa880d81de73047b199dc4e2ee4734959),
(17, 15, 2, 1, 5, 'dropbox', 'dropbox', 3, 'localhost-4/SYMFONY-5/dropbox-17/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0x830e4ebc7a6443c2b343971cdaf8756b),
(18, 15, 2, 1, 5, 'quiz', 'quiz', 3, 'localhost-4/SYMFONY-5/quiz-18/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0xcda7312777cc4329a669e516802117ce),
(19, 15, 2, 1, 5, 'forum', 'forum', 3, 'localhost-4/SYMFONY-5/forum-19/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0xb7101484ab7a411bba1f5409f7c55bd8),
(20, 15, 2, 1, 5, 'glossary', 'glossary', 3, 'localhost-4/SYMFONY-5/glossary-20/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0xdb5fe101a66146a49ca4695f53560780),
(21, 15, 2, 1, 5, 'gradebook', 'gradebook', 3, 'localhost-4/SYMFONY-5/gradebook-21/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0xb5f8756c165143609a2c4703d7d296db),
(22, 15, 2, 1, 5, 'group', 'group', 3, 'localhost-4/SYMFONY-5/group-22/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0xa93ee452c80b407e819f8325047debd1),
(23, 15, 2, 1, 5, 'learnpath', 'learnpath', 3, 'localhost-4/SYMFONY-5/learnpath-23/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0x37a937db03c0469da6ec0dbaa053b2d7),
(24, 15, 2, 1, 5, 'link', 'link', 3, 'localhost-4/SYMFONY-5/link-24/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0xeefebff3e805452caab5052ced8a6436),
(25, 15, 2, 1, 5, 'course_maintenance', 'course-maintenance', 3, 'localhost-4/SYMFONY-5/course_maintenance-25/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0x2be2d48c1da74d0a95f47ac8b24bb206),
(26, 15, 2, 1, 5, 'member', 'member', 3, 'localhost-4/SYMFONY-5/member-26/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0x9aa54235b28843b4a1a6c3ae0fe8a6f1),
(27, 15, 2, 1, 5, 'notebook', 'notebook', 3, 'localhost-4/SYMFONY-5/notebook-27/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0x289e905d2ef64667b44479707e521ae7),
(28, 15, 2, 1, 5, 'portfolio', 'portfolio', 3, 'localhost-4/SYMFONY-5/portfolio-28/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0x6ca9742d02b44451ab4a7c26f51fd5c2),
(29, 15, 2, 1, 5, 'course_setting', 'course-setting', 3, 'localhost-4/SYMFONY-5/course_setting-29/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0xa7d29c48c1f34407ae55cc1c33e2f120),
(30, 15, 2, 1, 5, 'survey', 'survey', 3, 'localhost-4/SYMFONY-5/survey-30/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0xce039dd55bf84250aaaf0e7110d1193f),
(31, 15, 2, 1, 5, 'tracking', 'tracking', 3, 'localhost-4/SYMFONY-5/tracking-31/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0x846ac08e164b423086ca3aba37abc70d),
(32, 15, 2, 1, 5, 'wiki', 'wiki', 3, 'localhost-4/SYMFONY-5/wiki-32/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0x005b3d698e03458aa996cce4747e4dce),
(33, 36, 1, 1, 5, 'Default groups', 'default-groups', 3, 'localhost-4/SYMFONY-5/Default groups-33/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0xa35b12c257034ce3b82717be5b41e710),
(34, 17, 2, 1, 5, 'Audio', 'audio', 3, 'localhost-4/SYMFONY-5/Audio-34/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0x8f29bf2ca03640119d4e2bd3333d8160),
(35, 17, 2, 1, 5, 'Images', 'images', 3, 'localhost-4/SYMFONY-5/Images-35/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0x4dcd5f21ecd64a5a8db6d067cf4e90bc),
(36, 17, 2, 1, 5, 'Gallery', 'gallery', 3, 'localhost-4/SYMFONY-5/Gallery-36/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0x7b6d73fbb6c04870a9cb18e1d154a266),
(37, 17, 2, 1, 5, 'Video', 'video', 3, 'localhost-4/SYMFONY-5/Video-37/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0x5bce1326e2ed46d1b44ec8abb5d790ac),
(38, 17, 2, 1, 35, 'mr_chamilo', 'mr-chamilo', 4, 'localhost-4/SYMFONY-5/Images-35/mr_chamilo-38/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0x14b15393486a41d8a71dd0a8fa0d1428),
(39, 17, 2, 1, 38, 'svg', 'svg', 5, 'localhost-4/SYMFONY-5/Images-35/mr_chamilo-38/svg-39/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0x372aa0ab6bd741cb86013188da8c741c),
(40, 17, 2, 1, 39, 'collaborative.svg', 'collaborative-svg', 6, 'localhost-4/SYMFONY-5/Images-35/mr_chamilo-38/svg-39/collaborative.svg-40/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0x0aad1e428251437bbdb08a80e2cc439c),
(41, 17, 2, 1, 39, 'teaching.svg', 'teaching-svg', 6, 'localhost-4/SYMFONY-5/Images-35/mr_chamilo-38/svg-39/teaching.svg-41/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0x5d6debcb7d624fa186322dfe91dbbbfd),
(42, 17, 2, 1, 38, 'doubts.png', 'doubts-png', 5, 'localhost-4/SYMFONY-5/Images-35/mr_chamilo-38/doubts.png-42/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0xfa4000cd195d4d0fbe0f2ab2e98d83f2),
(43, 17, 2, 1, 38, 'collaborative.png', 'collaborative-png', 5, 'localhost-4/SYMFONY-5/Images-35/mr_chamilo-38/collaborative.png-43/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0x1f1b2547ad194d1783fa0fe4856b5b4e),
(44, 17, 2, 1, 34, 'ListeningComprehension.mp3', 'listeningcomprehension-mp3', 4, 'localhost-4/SYMFONY-5/Audio-34/ListeningComprehension.mp3-44/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0xa40fdcc0610a4964ba1f64848c8c1a26),
(45, 1, 2, 1, 5, 'Course creation', 'course-creation', 3, 'localhost-4/SYMFONY-5/Course creation-45/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0x2e5a5283e3434d4d8330ec5a69684e9d),
(46, 15, 2, 1, 5, 'Quick and powerful search engine', 'quick-and-powerful-search-engine', 3, 'localhost-4/SYMFONY-5/Quick and powerful search engine-46/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0x35ed41f2882e4fe9b4ffb5f08cb34bc8),
(47, 15, 2, 1, 5, 'Free online encyclopedia', 'free-online-encyclopedia', 3, 'localhost-4/SYMFONY-5/Free online encyclopedia-47/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0xd754fbe85c9342a9bfce257e11306922),
(48, 3, 1, 1, 5, 'This is an announcement example', 'this-is-an-announcement-example', 3, 'localhost-4/SYMFONY-5/This is an announcement example-48/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0x59767ea61c0f40f0b269bfd9c5448fb8),
(49, 25, 1, 1, 5, 'Example Forum Category', 'example-forum-category', 3, 'localhost-4/SYMFONY-5/Example Forum Category-49/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0x6d234645915148fca6595089117bda7d),
(50, 23, 1, 1, 49, 'Example Forum', 'example-forum', 4, 'localhost-4/SYMFONY-5/Example Forum Category-49/Example Forum-50/', '2025-11-21 22:28:42', '2025-11-22 01:02:16', 0, 0x2891ffe82986495991e6114ff958d032),
(51, 27, 1, 1, 50, 'Example Thread', 'example-thread', 5, 'localhost-4/SYMFONY-5/Example Forum Category-49/Example Forum-50/Example Thread-51/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0x258e37cdd0d4479f933480a984806dac),
(52, 26, 1, 1, 51, 'Example Thread', 'example-thread-1', 6, 'localhost-4/SYMFONY-5/Example Forum Category-49/Example Forum-50/Example Thread-51/Example Thread-52/', '2025-11-21 22:28:42', '2025-11-21 22:28:42', 0, 0x4532e8f0ab2745b194fd1cc88d375dcd),
(53, 48, 1, 1, 5, 'course_homepage', 'course-homepage-1', 3, 'localhost-4/SYMFONY-5/course_homepage-53/', '2025-11-21 22:30:52', '2025-11-21 22:30:52', 0, 0xb02d417e6b024c5b93a10e68b90ea4f6),
(54, 30, NULL, 1, NULL, 'rami-aouinti', 'rami-aouinti', 1, 'rami-aouinti-54/', '2025-11-21 22:32:04', '2025-11-21 22:32:06', 0, 0x04a19d50e9594c138840ed97660e657a),
(55, 17, 2, 4, 5, 'chat_conversations', 'chat-conversations', 3, 'localhost-4/SYMFONY-5/chat_conversations-55/', '2025-11-21 22:39:57', '2025-11-21 22:39:57', 0, 0x03118e7ed5e24910a5740eb9a6797b6b),
(56, 12, NULL, 4, 55, 'messages-2025-11-21_sid-1-log.html', 'messages-2025-11-21-sid-1-log-html', 4, 'localhost-4/SYMFONY-5/chat_conversations-55/messages-2025-11-21_sid-1-log.html-56/', '2025-11-21 22:40:11', '2025-11-21 22:40:11', 0, 0xc4d9377169464f33ba1903292fb55082),
(57, 12, 1, 4, 55, 'messages-2025-11-21_sid-1-log.html', 'messages-2025-11-21-sid-1-log-html-1', 4, 'localhost-4/SYMFONY-5/chat_conversations-55/messages-2025-11-21_sid-1-log.html-57/', '2025-11-21 22:40:11', '2025-11-21 22:40:11', 0, 0xc796cb850b7841068bfa5d798db9e6fd),
(58, 12, 1, 4, 55, 'messages-2025-11-21_sid-1-log.html', 'messages-2025-11-21-sid-1-log-html-2', 4, 'localhost-4/SYMFONY-5/chat_conversations-55/messages-2025-11-21_sid-1-log.html-58/', '2025-11-21 22:40:11', '2025-11-21 22:40:11', 0, 0xcf58d57347d54dce8c801c2b1adc4e8a),
(59, 17, 2, 4, 55, 'messages-2025-11-21_sid-1-log.html', 'messages-2025-11-21-sid-1-log-html-3', 4, 'localhost-4/SYMFONY-5/chat_conversations-55/messages-2025-11-21_sid-1-log.html-59/', '2025-11-21 22:40:11', '2025-11-21 22:40:11', 0, 0x2944607f6430476881c280428157c1d4),
(60, 12, NULL, 1, 55, 'messages-2025-11-21_uid-1-1-log.html', 'messages-2025-11-21-uid-1-1-log-html', 4, 'localhost-4/SYMFONY-5/chat_conversations-55/messages-2025-11-21_uid-1-1-log.html-60/', '2025-11-21 22:41:45', '2025-11-21 22:41:45', 0, 0x992806869e7046c893351cb72cc48f59),
(61, 12, 1, 1, 55, 'messages-2025-11-21_uid-1-1-log.html', 'messages-2025-11-21-uid-1-1-log-html-1', 4, 'localhost-4/SYMFONY-5/chat_conversations-55/messages-2025-11-21_uid-1-1-log.html-61/', '2025-11-21 22:41:45', '2025-11-21 22:41:45', 0, 0x3ca20d0b505d45938df753d14ac26f3b),
(62, 12, 1, 1, 55, 'messages-2025-11-21_uid-1-1-log.html', 'messages-2025-11-21-uid-1-1-log-html-2', 4, 'localhost-4/SYMFONY-5/chat_conversations-55/messages-2025-11-21_uid-1-1-log.html-62/', '2025-11-21 22:41:45', '2025-11-21 22:41:45', 0, 0x7b47b57b7fbc47838719244f59674cb5),
(63, 17, 2, 1, 55, 'messages-2025-11-21_uid-1-1-log.html', 'messages-2025-11-21-uid-1-1-log-html-3', 4, 'localhost-4/SYMFONY-5/chat_conversations-55/messages-2025-11-21_uid-1-1-log.html-63/', '2025-11-21 22:41:45', '2025-11-21 22:41:45', 0, 0x9483bedfd8b44d2093be4899d759718b),
(64, 12, NULL, 1, 55, 'messages-2025-11-21-log.html', 'messages-2025-11-21-log-html', 4, 'localhost-4/SYMFONY-5/chat_conversations-55/messages-2025-11-21-log.html-64/', '2025-11-21 22:42:25', '2025-11-21 22:42:25', 0, 0xc8b2318dc4994b71ab276f7c461a577a),
(65, 12, 1, 1, 55, 'messages-2025-11-21-log.html', 'messages-2025-11-21-log-html-1', 4, 'localhost-4/SYMFONY-5/chat_conversations-55/messages-2025-11-21-log.html-65/', '2025-11-21 22:42:25', '2025-11-21 22:42:25', 0, 0xd05470706153469d8c3aa1c1badd008d),
(66, 12, 1, 1, 55, 'messages-2025-11-21-log.html', 'messages-2025-11-21-log-html-2', 4, 'localhost-4/SYMFONY-5/chat_conversations-55/messages-2025-11-21-log.html-66/', '2025-11-21 22:42:25', '2025-11-21 22:42:25', 0, 0x2b6f9dd48d944159840c7c5abeca5e41),
(67, 17, 2, 1, 55, 'messages-2025-11-21-log.html', 'messages-2025-11-21-log-html-3', 4, 'localhost-4/SYMFONY-5/chat_conversations-55/messages-2025-11-21-log.html-67/', '2025-11-21 22:42:25', '2025-11-21 22:42:25', 0, 0x69d68189b4d3417e91628fcd6738fb6e),
(68, 17, 2, 4, 54, 'test', 'test', 2, 'rami-aouinti-54/test-68/', '2025-11-21 22:49:27', '2025-11-21 22:49:27', 0, 0x8a89246ea30445d6aa84fedcb3af2fd9),
(69, 17, 2, 1, 1, 'test', 'test-1', 2, 'admin-1/test-69/', '2025-11-21 22:50:37', '2025-11-21 22:50:37', 0, 0xfde202a7d60f4594ba946636efb53bf6),
(70, 12, NULL, 4, 55, 'messages-2025-11-22_uid-1-4-log.html', 'messages-2025-11-22-uid-1-4-log-html', 4, 'localhost-4/SYMFONY-5/chat_conversations-55/messages-2025-11-22_uid-1-4-log.html-70/', '2025-11-22 00:23:38', '2025-11-22 00:23:38', 0, 0x34ad87ac1da1427383e63490378d0307),
(71, 12, 1, 4, 55, 'messages-2025-11-22_uid-1-4-log.html', 'messages-2025-11-22-uid-1-4-log-html-1', 4, 'localhost-4/SYMFONY-5/chat_conversations-55/messages-2025-11-22_uid-1-4-log.html-71/', '2025-11-22 00:23:38', '2025-11-22 00:23:38', 0, 0xe885dd264a1c4e5bb4d3c2ff3d00f705),
(72, 12, 1, 4, 55, 'messages-2025-11-22_uid-1-4-log.html', 'messages-2025-11-22-uid-1-4-log-html-2', 4, 'localhost-4/SYMFONY-5/chat_conversations-55/messages-2025-11-22_uid-1-4-log.html-72/', '2025-11-22 00:23:38', '2025-11-22 00:23:38', 0, 0xa6b1a02b7ac14511b52ec99f70fb5b21),
(73, 17, 2, 4, 55, 'messages-2025-11-22_uid-1-4-log.html', 'messages-2025-11-22-uid-1-4-log-html-3', 4, 'localhost-4/SYMFONY-5/chat_conversations-55/messages-2025-11-22_uid-1-4-log.html-73/', '2025-11-22 00:23:38', '2025-11-22 00:23:38', 0, 0xdc849d585c2b4a18ba4d9e160e4ee8fc),
(74, 12, NULL, 1, 55, 'messages-2025-11-22-log.html', 'messages-2025-11-22-log-html', 4, 'localhost-4/SYMFONY-5/chat_conversations-55/messages-2025-11-22-log.html-74/', '2025-11-22 00:24:58', '2025-11-22 00:24:58', 0, 0xdce1fd398c964bee9ff02c1d5e622e2b),
(75, 12, 1, 1, 55, 'messages-2025-11-22-log.html', 'messages-2025-11-22-log-html-1', 4, 'localhost-4/SYMFONY-5/chat_conversations-55/messages-2025-11-22-log.html-75/', '2025-11-22 00:24:58', '2025-11-22 00:24:58', 0, 0x8fa3606c6ba24860a7b2c2eeb9394ea8),
(76, 12, 1, 1, 55, 'messages-2025-11-22-log.html', 'messages-2025-11-22-log-html-2', 4, 'localhost-4/SYMFONY-5/chat_conversations-55/messages-2025-11-22-log.html-76/', '2025-11-22 00:24:58', '2025-11-22 00:24:58', 0, 0x8683c131eec947019db199078e58a04b),
(77, 17, 2, 1, 55, 'messages-2025-11-22-log.html', 'messages-2025-11-22-log-html-3', 4, 'localhost-4/SYMFONY-5/chat_conversations-55/messages-2025-11-22-log.html-77/', '2025-11-22 00:24:58', '2025-11-22 00:24:58', 0, 0x13479d7aa4904b84800b5fd96c4ca9de),
(78, 19, 1, 1, 5, 'sym', 'sym', 3, 'localhost-4/SYMFONY-5/sym-78/', '2025-11-22 00:39:37', '2025-11-22 00:39:37', 0, 0xb65363e7e8b54eddb7787cbff44ee340),
(79, 20, 1, 1, 5, 'rrrrrrrr', 'rrrrrrrr', 3, 'localhost-4/SYMFONY-5/rrrrrrrr-79/', '2025-11-22 00:40:34', '2025-11-22 00:40:34', 0, 0x7c39a61b32d1469db4c7c7fb0e1867d8),
(80, 1, 2, 1, 1, 'dsdsds', 'dsdsds', 2, 'admin-1/dsdsds-80/', '2025-11-22 00:48:41', '2025-11-22 00:48:41', 0, 0x4194214f329944aaa8f6af89eee56584),
(81, 17, 2, 1, 5, 'Default certificate', 'default-certificate', 3, 'localhost-4/SYMFONY-5/Default certificate-81/', '2025-11-22 00:54:20', '2025-11-22 00:54:20', 0, 0xeb6d18a84bbe47c98c3bbc42e5713383),
(82, 53, 2, 1, 4, 'Social', 'social', 2, 'localhost-4/Social-82/', '2025-11-22 01:11:33', '2025-11-22 01:11:33', 0, 0xc137d42917e440cd8e44a78c175fce41),
(83, 50, 1, 1, 1, '1ed47a74-c9be-43c7-9220-4b76928464b0.jpg', '1ed47a74-c9be-43c7-9220-4b76928464b0-jpg', 2, 'admin-1/1ed47a74-c9be-43c7-9220-4b76928464b0.jpg-83/', '2025-11-22 01:12:20', '2025-11-22 01:12:20', 0, 0x350d930b82714606a9f559ed6db39d7d),
(84, 50, 1, 1, 1, '1ed47a74-c9be-43c7-9220-4b76928464b0.jpg', '1ed47a74-c9be-43c7-9220-4b76928464b0-jpg-1', 2, 'admin-1/1ed47a74-c9be-43c7-9220-4b76928464b0.jpg-84/', '2025-11-22 01:12:20', '2025-11-22 01:12:20', 0, 0xdcc24de08ca940d788814a65d8337a95),
(85, 50, 1, 1, 1, '1ed47a74-c9be-43c7-9220-4b76928464b0.jpg', '1ed47a74-c9be-43c7-9220-4b76928464b0-jpg-2', 2, 'admin-1/1ed47a74-c9be-43c7-9220-4b76928464b0.jpg-85/', '2025-11-22 01:12:21', '2025-11-22 01:12:21', 0, 0x03af5f18d4ec4b3580106fe025e4693f),
(86, 50, 1, 1, 1, '1ed47a74-c9be-43c7-9220-4b76928464b0.jpg', '1ed47a74-c9be-43c7-9220-4b76928464b0-jpg-3', 2, 'admin-1/1ed47a74-c9be-43c7-9220-4b76928464b0.jpg-86/', '2025-11-22 01:12:29', '2025-11-22 01:12:29', 0, 0x4a3844156aa2496985bda64b49e189c0),
(87, 50, 1, 1, 1, '1ed47a74-c9be-43c7-9220-4b76928464b0.jpg', '1ed47a74-c9be-43c7-9220-4b76928464b0-jpg-4', 2, 'admin-1/1ed47a74-c9be-43c7-9220-4b76928464b0.jpg-87/', '2025-11-22 01:12:43', '2025-11-22 01:12:44', 0, 0xda7ffc567df9473897620fb27e296d7a),
(88, 50, 1, 1, 1, '1ed47a74-c9be-43c7-9220-4b76928464b0.jpg', '1ed47a74-c9be-43c7-9220-4b76928464b0-jpg-5', 2, 'admin-1/1ed47a74-c9be-43c7-9220-4b76928464b0.jpg-88/', '2025-11-22 01:12:44', '2025-11-22 01:12:44', 0, 0x7008280756d9428aba6fbc0154baca58),
(89, 50, 1, 1, 1, '1ed47a74-c9be-43c7-9220-4b76928464b0.jpg', '1ed47a74-c9be-43c7-9220-4b76928464b0-jpg-6', 2, 'admin-1/1ed47a74-c9be-43c7-9220-4b76928464b0.jpg-89/', '2025-11-22 01:12:45', '2025-11-22 01:12:45', 0, 0x2cefe55a04ba48af997da09ed78d322d);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `resource_right`
--

CREATE TABLE `resource_right` (
  `id` int(11) NOT NULL,
  `resource_link_id` int(11) DEFAULT NULL,
  `role` varchar(255) NOT NULL,
  `mask` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `resource_right`
--

INSERT INTO `resource_right` (`id`, `resource_link_id`, `role`, `mask`) VALUES
(1, 8, 'ROLE_CURRENT_COURSE_TEACHER', 5),
(2, 10, 'ROLE_CURRENT_COURSE_TEACHER', 5),
(3, 20, 'ROLE_CURRENT_COURSE_TEACHER', 5),
(4, 21, 'ROLE_CURRENT_COURSE_TEACHER', 5),
(5, 24, 'ROLE_CURRENT_COURSE_TEACHER', 5);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `resource_tag`
--

CREATE TABLE `resource_tag` (
  `id` int(11) NOT NULL,
  `author_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `resource_type`
--

CREATE TABLE `resource_type` (
  `id` int(11) NOT NULL,
  `tool_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `resource_type`
--

INSERT INTO `resource_type` (`id`, `tool_id`, `title`, `created_at`, `updated_at`) VALUES
(1, 1, 'events', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(2, 1, 'event_attachments', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(3, 2, 'announcements', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(4, 2, 'announcements_attachments', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(5, 3, 'illustrations', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(6, 4, 'student_publications', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(7, 4, 'student_publications_assignments', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(8, 4, 'student_publications_comments', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(9, 4, 'student_publications_corrections', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(10, 5, 'attendances', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(11, 6, 'blog', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(12, 7, 'conversations', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(13, 8, 'course_descriptions', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(14, 10, 'thematics', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(15, 11, 'links', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(16, 11, 'introductions', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(17, 13, 'files', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(18, 14, 'dropbox', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(19, 15, 'exercises', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(20, 15, 'questions', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(21, 15, 'question_categories', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(22, 15, 'exercise_categories', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(23, 16, 'forums', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(24, 16, 'forum_attachments', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(25, 16, 'forum_categories', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(26, 16, 'forum_posts', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(27, 16, 'forum_threads', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(28, 17, 'urls', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(29, 17, 'courses', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(30, 17, 'users', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(31, 18, 'glossaries', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(32, 19, 'gradebooks', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(33, 19, 'gradebook_links', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(34, 19, 'gradebook_evaluations', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(35, 20, 'groups', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(36, 20, 'group_categories', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(37, 21, 'lps', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(38, 21, 'lp_categories', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(39, 22, 'links', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(40, 22, 'link_categories', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(41, 26, 'notebooks', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(42, 28, 'portfolio_items', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(43, 28, 'portfolio_comments', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(44, 31, 'shortcuts', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(45, 31, 'external_tools', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(46, 32, 'surveys', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(47, 32, 'survey_questions', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(48, 34, 'tool_intro', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(49, 36, 'files', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(50, 36, 'message_attachments', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(51, 36, 'ticket_message_attachments', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(52, 36, 'social_post_attachments', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(53, 37, 'usergroups', '2025-11-21 22:22:15', '2025-11-21 22:22:15'),
(54, 39, 'wikis', '2025-11-21 22:22:15', '2025-11-21 22:22:15');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `resource_user_tag`
--

CREATE TABLE `resource_user_tag` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `tag_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `role`
--

CREATE TABLE `role` (
  `id` int(10) UNSIGNED NOT NULL,
  `code` varchar(50) NOT NULL,
  `constant_value` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext DEFAULT NULL,
  `system_role` tinyint(1) NOT NULL,
  `created_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `updated_by` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `role`
--

INSERT INTO `role` (`id`, `code`, `constant_value`, `title`, `description`, `system_role`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 'ANONYMOUS', 0, 'Anonymous', 'Unauthenticated users', 1, NULL, NULL, NULL, NULL),
(2, 'INVITEE', 1, 'Invitee', 'Invited users', 1, NULL, NULL, NULL, NULL),
(3, 'STUDENT', 2, 'Student', 'Students of courses or sessions', 1, NULL, NULL, NULL, NULL),
(4, 'TEACHER', 3, 'Teacher', 'Teachers of courses or sessions', 1, NULL, NULL, NULL, NULL),
(5, 'ADMIN', 4, 'Administrator', 'Platform administrators', 1, NULL, NULL, NULL, NULL),
(6, 'GLOBAL_ADMIN', 6, 'Global Administrator', 'Global admin users', 1, NULL, NULL, NULL, NULL),
(7, 'HR', 7, 'HR Manager', 'Human resources managers', 0, NULL, NULL, NULL, NULL),
(8, 'QUESTION_MANAGER', 8, 'Question Bank Manager', 'Manages the question bank across courses', 0, NULL, NULL, NULL, NULL),
(9, 'SESSION_MANAGER', 9, 'Session Manager', 'Manages sessions and session content', 0, NULL, NULL, NULL, NULL),
(10, 'STUDENT_BOSS', 10, 'Student Boss', 'Manages groups of students', 0, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `room`
--

CREATE TABLE `room` (
  `id` int(11) NOT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext DEFAULT NULL,
  `geolocation` varchar(255) DEFAULT NULL,
  `ip` varchar(45) DEFAULT NULL,
  `ip_mask` varchar(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `scheduled_announcements`
--

CREATE TABLE `scheduled_announcements` (
  `id` int(11) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` longtext NOT NULL,
  `date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `sent` tinyint(1) NOT NULL,
  `session_id` int(11) NOT NULL,
  `c_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `search_engine_ref`
--

CREATE TABLE `search_engine_ref` (
  `id` int(11) NOT NULL,
  `c_id` int(11) DEFAULT NULL,
  `tool_id` varchar(100) NOT NULL,
  `ref_id_high_level` int(11) NOT NULL,
  `ref_id_second_level` int(11) DEFAULT NULL,
  `search_did` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `sequence`
--

CREATE TABLE `sequence` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `graph` longtext DEFAULT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `sequence_condition`
--

CREATE TABLE `sequence_condition` (
  `id` int(11) NOT NULL,
  `description` longtext NOT NULL,
  `mat_op` varchar(255) NOT NULL,
  `param` double NOT NULL,
  `act_true` int(11) NOT NULL,
  `act_false` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `sequence_condition`
--

INSERT INTO `sequence_condition` (`id`, `description`, `mat_op`, `param`, `act_true`, `act_false`) VALUES
(1, '<= 100%', '<=', 100, 2, '0'),
(2, '>= 70%', '>=', 70, 0, '');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `sequence_formula`
--

CREATE TABLE `sequence_formula` (
  `id` int(11) NOT NULL,
  `sequence_method_id` int(11) DEFAULT NULL,
  `sequence_variable_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `sequence_formula`
--

INSERT INTO `sequence_formula` (`id`, `sequence_method_id`, `sequence_variable_id`) VALUES
(1, 1, 2),
(2, 2, 2),
(3, 2, 3),
(4, 2, 1),
(5, 3, 3),
(6, 4, 4),
(7, 5, 5),
(8, 6, 6),
(9, 7, 7),
(10, 8, 8),
(11, 9, 3),
(12, 10, 2),
(13, 11, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `sequence_method`
--

CREATE TABLE `sequence_method` (
  `id` int(11) NOT NULL,
  `description` longtext NOT NULL,
  `formula` longtext NOT NULL,
  `assign` int(11) NOT NULL,
  `met_type` varchar(255) NOT NULL,
  `act_false` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `sequence_method`
--

INSERT INTO `sequence_method` (`id`, `description`, `formula`, `assign`, `met_type`, `act_false`) VALUES
(1, 'Add completed item', 'v#2 + $complete_items;', 2, 'add', ''),
(2, 'Update progress by division', 'v#2 / v#3 * 100;', 1, 'div', ''),
(3, 'Add completed item', 'v#2 + $complete_items;', 2, 'add', ''),
(4, 'Update items count', '$total_items;', 3, 'update', ''),
(5, 'Enable success', '1;', 4, 'success', ''),
(6, 'Store success date', '(empty(v#5))? api_get_utc_datetime() : v#5;', 5, 'success', ''),
(7, 'Enable availability', '1;', 6, 'pre', ''),
(8, 'Store availability start date', '(empty(v#7))? api_get_utc_datetime() : v#7;', 7, 'pre', ''),
(9, 'Store availability end date', '(empty($available_end_date))? api_get_utc_datetime($available_end_date) : \"0000-00-00 00:00:00\";', 8, 'pre', ''),
(10, 'Increase the items count', 'v#3 + $total_items;', 3, 'add', ''),
(11, 'Update completed items', '$complete_items;', 2, 'update', ''),
(12, 'Update progress', '$complete_items / $total_items * 100;', 1, 'update', '');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `sequence_resource`
--

CREATE TABLE `sequence_resource` (
  `id` int(11) NOT NULL,
  `sequence_id` int(11) DEFAULT NULL,
  `type` int(11) NOT NULL,
  `resource_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `sequence_row_entity`
--

CREATE TABLE `sequence_row_entity` (
  `id` int(11) NOT NULL,
  `sequence_type_entity_id` int(11) DEFAULT NULL,
  `c_id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `row_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `sequence_rule`
--

CREATE TABLE `sequence_rule` (
  `id` int(11) NOT NULL,
  `description` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `sequence_rule`
--

INSERT INTO `sequence_rule` (`id`, `description`) VALUES
(1, 'If user completes 70% of an entity or group of items, he will be able to access another entity or group of items');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `sequence_rule_condition`
--

CREATE TABLE `sequence_rule_condition` (
  `id` int(11) NOT NULL,
  `sequence_rule_id` int(11) DEFAULT NULL,
  `sequence_condition_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `sequence_rule_condition`
--

INSERT INTO `sequence_rule_condition` (`id`, `sequence_rule_id`, `sequence_condition_id`) VALUES
(1, 1, 1),
(2, 1, 2);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `sequence_rule_method`
--

CREATE TABLE `sequence_rule_method` (
  `id` int(11) NOT NULL,
  `sequence_rule_id` int(11) DEFAULT NULL,
  `sequence_method_id` int(11) DEFAULT NULL,
  `method_order` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `sequence_rule_method`
--

INSERT INTO `sequence_rule_method` (`id`, `sequence_rule_id`, `sequence_method_id`, `method_order`) VALUES
(1, 1, 1, 1),
(2, 1, 2, 2),
(3, 1, 3, 3),
(4, 1, 4, 4),
(5, 1, 5, 5),
(6, 1, 6, 6),
(7, 1, 7, 7),
(8, 1, 8, 8),
(9, 1, 9, 9),
(10, 1, 10, 10),
(11, 1, 11, 11),
(12, 1, 12, 12);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `sequence_type_entity`
--

CREATE TABLE `sequence_type_entity` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `ent_table` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `sequence_type_entity`
--

INSERT INTO `sequence_type_entity` (`id`, `title`, `description`, `ent_table`) VALUES
(1, 'Lp', 'Learning Path', 'c_lp'),
(2, 'Quiz', 'Quiz and Tests', 'c_quiz'),
(3, 'LpItem', 'Items of a Learning Path', 'c_lp_item');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `sequence_valid`
--

CREATE TABLE `sequence_valid` (
  `id` int(11) NOT NULL,
  `sequence_variable_id` int(11) DEFAULT NULL,
  `sequence_condition_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `sequence_valid`
--

INSERT INTO `sequence_valid` (`id`, `sequence_variable_id`, `sequence_condition_id`) VALUES
(1, 1, 1),
(2, 1, 2);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `sequence_value`
--

CREATE TABLE `sequence_value` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `sequence_row_entity_id` int(11) DEFAULT NULL,
  `advance` double NOT NULL,
  `complete_items` int(11) NOT NULL,
  `total_items` int(11) NOT NULL,
  `success` tinyint(1) NOT NULL,
  `success_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `available` tinyint(1) NOT NULL,
  `available_start_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `available_end_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `sequence_variable`
--

CREATE TABLE `sequence_variable` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `default_val` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `sequence_variable`
--

INSERT INTO `sequence_variable` (`id`, `title`, `description`, `default_val`) VALUES
(1, 'Percentile progress', 'advance', '0.0'),
(2, 'Completed items', 'complete_items', '0'),
(3, 'Items count', 'total_items', '0'),
(4, 'Completed', 'success', '0'),
(5, 'Completion date', 'success_date', '0000-00-00 00:00:00'),
(6, 'Available', 'available', '0'),
(7, 'Availability start date', 'available_start_date', '0000-00-00 00:00:00'),
(8, 'Availability end date', 'available_end_date', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `session`
--

CREATE TABLE `session` (
  `id` int(11) NOT NULL,
  `promotion_id` int(11) DEFAULT NULL,
  `session_category_id` int(11) DEFAULT NULL,
  `image_id` binary(16) DEFAULT NULL COMMENT '(DC2Type:uuid)',
  `title` varchar(150) NOT NULL,
  `description` longtext DEFAULT NULL,
  `show_description` tinyint(1) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `nbr_courses` int(11) NOT NULL,
  `nbr_users` int(11) NOT NULL,
  `nbr_classes` int(11) NOT NULL,
  `visibility` int(11) NOT NULL,
  `display_start_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `display_end_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `access_start_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `access_end_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `coach_access_start_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `coach_access_end_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `position` int(11) NOT NULL DEFAULT 0,
  `status` int(11) NOT NULL,
  `send_subscription_notification` tinyint(1) NOT NULL DEFAULT 0,
  `parent_id` int(11) DEFAULT NULL,
  `days_to_reinscription` int(11) DEFAULT NULL,
  `last_repetition` tinyint(1) NOT NULL DEFAULT 0,
  `days_to_new_repetition` int(11) DEFAULT NULL,
  `notify_boss` tinyint(1) NOT NULL DEFAULT 0,
  `validity_in_days` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `session`
--

INSERT INTO `session` (`id`, `promotion_id`, `session_category_id`, `image_id`, `title`, `description`, `show_description`, `duration`, `nbr_courses`, `nbr_users`, `nbr_classes`, `visibility`, `display_start_date`, `display_end_date`, `access_start_date`, `access_end_date`, `coach_access_start_date`, `coach_access_end_date`, `position`, `status`, `send_subscription_notification`, `parent_id`, `days_to_reinscription`, `last_repetition`, `days_to_new_repetition`, `notify_boss`, `validity_in_days`) VALUES
(1, NULL, NULL, NULL, 'aouinti student () Symofny', '', 0, 0, 1, 1, 0, 1, '2025-11-21 22:38:30', '2025-11-28 22:38:30', '2025-11-21 22:38:30', '2025-11-28 22:38:30', '2025-11-21 22:38:30', '2025-11-28 22:38:30', 0, 0, 0, NULL, NULL, 0, NULL, 0, NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `session_category`
--

CREATE TABLE `session_category` (
  `id` int(11) NOT NULL,
  `access_url_id` int(11) DEFAULT NULL,
  `title` varchar(100) NOT NULL,
  `date_start` date DEFAULT NULL,
  `date_end` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `session_rel_course`
--

CREATE TABLE `session_rel_course` (
  `id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `c_id` int(11) NOT NULL,
  `position` int(11) NOT NULL,
  `nbr_users` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `session_rel_course`
--

INSERT INTO `session_rel_course` (`id`, `session_id`, `c_id`, `position`, `nbr_users`) VALUES
(1, 1, 1, 0, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `session_rel_course_rel_user`
--

CREATE TABLE `session_rel_course_rel_user` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `c_id` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `visibility` int(11) NOT NULL,
  `legal_agreement` int(11) NOT NULL,
  `progress` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `session_rel_course_rel_user`
--

INSERT INTO `session_rel_course_rel_user` (`id`, `user_id`, `session_id`, `c_id`, `status`, `visibility`, `legal_agreement`, `progress`) VALUES
(1, 4, 1, 1, 0, 1, 0, 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `session_rel_user`
--

CREATE TABLE `session_rel_user` (
  `id` int(11) NOT NULL,
  `session_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `relation_type` int(11) NOT NULL,
  `duration` int(11) NOT NULL,
  `moved_to` int(11) DEFAULT NULL,
  `moved_status` int(11) DEFAULT NULL,
  `moved_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `registered_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `collapsed` tinyint(1) DEFAULT NULL,
  `new_subscription_session_id` int(11) DEFAULT NULL,
  `access_start_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `access_end_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `session_rel_user`
--

INSERT INTO `session_rel_user` (`id`, `session_id`, `user_id`, `relation_type`, `duration`, `moved_to`, `moved_status`, `moved_at`, `registered_at`, `collapsed`, `new_subscription_session_id`, `access_start_date`, `access_end_date`) VALUES
(1, 1, 4, 0, 0, NULL, NULL, NULL, '2025-11-21 22:38:30', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `access_url` int(11) DEFAULT NULL,
  `value_template_id` int(10) UNSIGNED DEFAULT NULL,
  `variable` varchar(190) NOT NULL,
  `subkey` varchar(190) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `selected_value` longtext DEFAULT NULL,
  `title` longtext NOT NULL,
  `comment` longtext DEFAULT NULL,
  `scope` varchar(50) DEFAULT NULL,
  `subkeytext` varchar(255) DEFAULT NULL,
  `access_url_changeable` int(11) NOT NULL,
  `access_url_locked` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `settings`
--

INSERT INTO `settings` (`id`, `access_url`, `value_template_id`, `variable`, `subkey`, `type`, `category`, `selected_value`, `title`, `comment`, `scope`, `subkeytext`, `access_url_changeable`, `access_url_locked`) VALUES
(1, 1, NULL, 'administrator_email', NULL, NULL, 'admin', 'rami.aouinti@gmail.com', 'Portal Administrator: e-mail', 'The e-mail address of the Platform Administrator (appears in the footer on the left)', '', NULL, 1, 0),
(2, 1, NULL, 'administrator_name', NULL, NULL, 'admin', 'John', 'Portal Administrator: First Name', 'The First Name of the Platform Administrator (appears in the footer on the left)', '', NULL, 1, 0),
(3, 1, NULL, 'administrator_surname', NULL, NULL, 'admin', 'Rami', 'Portal Administrator: Last Name', 'The Family Name of the Platform Administrator (appears in the footer on the left)', '', NULL, 1, 0),
(4, 1, NULL, 'administrator_phone', NULL, NULL, 'admin', '', 'Portal Administrator: Phone number', 'The phone number of the Platform Administrator (appears in the footer on the left)', '', NULL, 1, 0),
(5, 1, NULL, 'redirect_admin_to_courses_list', NULL, NULL, 'admin', 'false', 'Redirect admin to courses list', 'The default behaviour is to send administrators directly to the administration panel (while teachers and students are sent to the courses list or the platform homepage). Enable to redirect the administrator also to his/her courses list.', '', NULL, 1, 0),
(6, 1, NULL, 'show_link_request_hrm_user', NULL, NULL, 'admin', 'false', 'Show link to request bond between user and HRM', '', '', NULL, 1, 0),
(7, 1, NULL, 'max_anonymous_users', NULL, NULL, 'admin', '0', 'Multiple anonymous users', 'Enable this option to allow multiple system users for anonymous users. This is useful when using this platform as a public showroom for some courses. Having multiple anonymous users will let tracking work for the duration of the experience for several users without mixing their data (which could otherwise confuse them).', '', NULL, 1, 0),
(8, 1, NULL, 'send_inscription_notification_to_general_admin_only', NULL, NULL, 'admin', 'false', 'Notify global admin only of new users', '', '', NULL, 1, 0),
(9, 1, NULL, 'chamilo_latest_news', NULL, NULL, 'admin', 'true', 'Latest news', 'Get the latest news from Chamilo, including security vulnerabilities and events, directly inside your administration panel. These pieces of news will be checked on the Chamilo news server every time you load the administration page and are only visible to administrators.', '', NULL, 1, 0),
(10, 1, NULL, 'chamilo_support', NULL, NULL, 'admin', 'true', 'Chamilo support block', 'Get pro tips and an easy way to contact official service providers for professional support, directly from the makers of Chamilo. This block appears on your administration page, is only visible by administrators, and refreshes every time you load the administration page.', '', NULL, 1, 0),
(11, 1, NULL, 'user_status_option_only_for_admin_enabled', NULL, NULL, 'admin', 'false', 'Hide role from normal users', 'Allows hiding users\' role when this option is set to true and the following array sets the corresponding role to \'true\'.', '', NULL, 1, 0),
(12, 1, 14, 'user_status_option_show_only_for_admin', NULL, NULL, 'admin', '', 'Define which roles are hidden to normal users', 'The roles set to \'true\' will only appear to administrators. Other users will not be able to see them.', '', NULL, 1, 0),
(13, 1, NULL, 'hide_global_announcements_when_not_connected', NULL, NULL, 'announcement', 'false', 'Hide global announcements for anonymous', 'Hide platform announcements from anonymous users, and only show them to authenticated users.', '', NULL, 1, 0),
(14, 1, NULL, 'announcements_hide_send_to_hrm_users', NULL, NULL, 'announcement', 'true', 'Hide option to send announcements to HR users', 'Remove the checkbox to enable sending announcements to users with HR roles (still requires to confirm in the announcements tool).', '', NULL, 1, 0),
(15, 1, NULL, 'disable_announcement_attachment', NULL, NULL, 'announcement', 'false', 'Disable attachment to announcements', 'Even though attachments in this version are dealt in an elegant way and do not multiply on disk, you might want to disable attachments altogether if you want to avoid excesses.', '', NULL, 1, 0),
(16, 1, NULL, 'allow_scheduled_announcements', NULL, NULL, 'announcement', 'false', 'Enable scheduled announcements in sessions', 'Allows the sessions managers to set announcements that will be triggered on specific dates or after/before a number of days of start/end of the session. Enabling this feature requires you to setup a cron task.', '', NULL, 1, 0),
(17, 1, NULL, 'disable_delete_all_announcements', NULL, NULL, 'announcement', 'false', 'Disable button to delete all announcements', 'Select \'Yes\' to remove the button to delete all announcements, as this can be used by mistake by teachers.', '', NULL, 1, 0),
(18, 1, NULL, 'hide_announcement_sent_to_users_info', NULL, NULL, 'announcement', 'false', 'Hide \'sent to\' in announcements', 'Select \'Yes\' to avoid showing to whom an announcement has been sent.', '', NULL, 1, 0),
(19, 1, NULL, 'allow_careers_in_global_announcements', NULL, NULL, 'announcement', 'false', 'Link global announcements with careers and promotions', '', '', NULL, 1, 0),
(20, 1, NULL, 'allow_coach_to_edit_announcements', NULL, NULL, 'announcement', 'false', 'Allow coaches to always edit announcements', 'Allow coaches to always edit announcements inside active or past sessions.', '', NULL, 1, 0),
(21, 1, NULL, 'course_announcement_scheduled_by_date', NULL, NULL, 'announcement', 'false', 'Date-based announcements', 'Allow teachers to configure announcements that will be sent at specific dates. This requires you to setup a cron task on cron/course_announcement.php running at least once daily.', '', NULL, 1, 0),
(22, 1, NULL, 'allow_personal_agenda', NULL, NULL, 'agenda', 'true', 'Personal Agenda', 'Can the learner add personal events to the Agenda?', '', NULL, 1, 0),
(23, 1, NULL, 'default_calendar_view', NULL, NULL, 'agenda', 'month', 'Default calendar display mode', 'Set this to dayGridMonth, basicWeek, agendaWeek or agendaDay to change the default view of the calendar.', '', NULL, 1, 0),
(24, 1, NULL, 'personal_calendar_show_sessions_occupation', NULL, NULL, 'agenda', 'false', 'Display sessions occupations in personal agenda', '', '', NULL, 1, 0),
(25, 1, NULL, 'personal_agenda_show_all_session_events', NULL, NULL, 'agenda', 'false', 'Display all agenda events in personal agenda', 'Do not hide events from expired sessions.', '', NULL, 1, 0),
(26, 1, NULL, 'allow_agenda_edit_for_hrm', NULL, NULL, 'agenda', 'false', 'Allow HRM role to edit or delete agenda events', 'This gives the HRM a little more power by allowing them to edit/delete agenda events in the course-session.', '', NULL, 1, 0),
(27, 1, 10, 'agenda_legend', NULL, NULL, 'agenda', '', 'Agenda colour legends', 'Add a small text as legend describing the colours used for the events.', '', NULL, 1, 0),
(28, 1, 11, 'agenda_colors', NULL, NULL, 'agenda', '', 'Agenda colours', 'Set HTML-code colours for each type of event to change the colour when displaying the event.', '', NULL, 1, 0),
(29, 1, 12, 'agenda_on_hover_info', NULL, NULL, 'agenda', '', 'Agenda hover info', 'Customize the agenda on cursor hovering. Show agenda comment and/or description.', '', NULL, 1, 0),
(30, 1, NULL, 'agenda_reminders_sender_id', NULL, NULL, 'agenda', '0', 'ID of the user who officially sends the agenda reminders', 'Sets which user appears as the sender of agenda reminder emails.', '', NULL, 1, 0),
(31, 1, 13, 'fullcalendar_settings', NULL, NULL, 'agenda', '', 'Calendar customization', 'Extra settings for the agenda, allowing you to configure the specific calendar library we use.', '', NULL, 1, 0),
(32, 1, NULL, 'allow_careers_in_global_agenda', NULL, NULL, 'agenda', 'false', 'Link global calendar events with careers and promotions', '', '', NULL, 1, 0),
(33, 1, NULL, 'allow_delete_attendance', NULL, NULL, 'attendance', 'true', 'Attendances: enable deletion', 'The default behaviour in Chamilo is to hide attendance sheets instead of deleting them, just in case the teacher would do it by mistake. Enable this option to allow teachers to *really* delete attendance sheets.', '', NULL, 1, 0),
(34, 1, NULL, 'enable_sign_attendance_sheet', NULL, NULL, 'attendance', 'false', 'Attendance signing', 'Enable taking signatures to confirm one\'s attendance.', '', NULL, 1, 0),
(35, 1, NULL, 'attendance_calendar_set_duration', NULL, NULL, 'attendance', 'false', 'Duration of attendance events', 'Option to define the duration for an event in attendance sheet.', '', NULL, 1, 0),
(36, 1, NULL, 'attendance_allow_comments', NULL, NULL, 'attendance', 'false', 'Allow comments in attendance sheets', 'Teachers and students can comment on each individual attendance (to justify).', '', NULL, 1, 0),
(37, 1, NULL, 'multilevel_grading', NULL, NULL, 'attendance', 'false', 'Enable Multi-Level Attendance Grading', 'Allows grading attendance with multiple levels instead of a simple present/absent system.', '', NULL, 1, 0),
(38, 1, NULL, 'cas_activate', NULL, NULL, 'cas', '', 'Enable CAS authentication', 'Enabling CAS authentication will allow users to authenticate with their CAS credentials.<br/>Go to <a href=\'settings.php?category=CAS\'>Plugin</a> to add a configurable \'CAS Login\' button for your Chamilo campus. Or you can force CAS authentication by setting cas[force_redirect] in app/config/auth.conf.php.', '', NULL, 1, 1),
(39, 1, NULL, 'cas_server', NULL, NULL, 'cas', '', 'Main CAS server', 'This is the main CAS server which will be used for the authentication (IP address or hostname)', '', NULL, 1, 1),
(40, 1, NULL, 'cas_server_uri', NULL, NULL, 'cas', '', 'Main CAS server URI', 'The path to the CAS service', '', NULL, 1, 1),
(41, 1, NULL, 'cas_port', NULL, NULL, 'cas', '', 'Main CAS server port', 'The port on which to connect to the main CAS server', '', NULL, 1, 1),
(42, 1, NULL, 'cas_protocol', NULL, NULL, 'cas', '', 'Main CAS server protocol', 'The protocol with which we connect to the CAS server', '', NULL, 1, 1),
(43, 1, NULL, 'cas_add_user_activate', NULL, NULL, 'cas', '', 'Enable CAS user addition', 'Enable CAS user addition. To create the user account from the LDAP directory, the extldap_config and extldap_user_correspondance tables must be filled in in app/config/auth.conf.php', '', NULL, 1, 1),
(44, 1, NULL, 'update_user_info_cas_with_ldap', NULL, NULL, 'cas', '', 'Update CAS-authenticated user account information from LDAP', 'Makes sure the user firstname, lastname and email address are the same as current values in the LDAP directory', '', NULL, 1, 1),
(45, 1, NULL, 'hide_my_certificate_link', NULL, NULL, 'certificate', 'false', 'Hide \'my certificate\' link', 'Hide the certificates page for non-admin users.', '', NULL, 1, 0),
(46, 1, NULL, 'add_certificate_pdf_footer', NULL, NULL, 'certificate', 'false', 'Add footer to PDF certificate exports', '', '', NULL, 1, 0),
(47, 1, NULL, 'session_admin_can_download_all_certificates', NULL, NULL, 'certificate', 'false', 'Allow session admins to download private certificates', 'If enabled, session administrators can download certificates even if they are not publicly published.', '', NULL, 1, 0),
(48, 1, NULL, 'allow_public_certificates', NULL, NULL, 'certificate', 'false', 'Allow public certificates', 'User certificates can be view by unregistered users.', '', NULL, 1, 0),
(49, 1, NULL, 'certificate_pdf_orientation', NULL, NULL, 'certificate', 'landscape', 'PDF orientation for certificates', 'Set ‘portrait’ or ‘landscape’ (technical terms) for PDF certificates.', '', NULL, 1, 0),
(50, 1, NULL, 'allow_general_certificate', NULL, NULL, 'certificate', 'false', 'Enable general certificate', 'A general certificate is a certificate grouping all the accomplishments by the user in the courses (s)he followed.', '', NULL, 1, 0),
(51, 1, NULL, 'hide_certificate_export_link', NULL, NULL, 'certificate', 'false', 'Certificates: hide PDF export link for all', 'Enable to completely remove the possibility to export certificates to PDF (for all users). If enabled, this includes hiding it from students.', '', NULL, 1, 0),
(52, 1, NULL, 'add_gradebook_certificates_cron_task_enabled', NULL, NULL, 'certificate', 'false', 'Certificates auto-generation on WS call', 'When enabled, and when using the WSCertificatesList webservice, this option will make sure that all certificates have been generated by users if they reached the sufficient score in all items defined in gradebooks for all courses and sessions (this might consume considerable processing resources on your server).', '', NULL, 1, 0),
(53, 1, NULL, 'certificate_filter_by_official_code', NULL, NULL, 'certificate', 'false', 'Certificates filter by official code', 'Add a filter on the students official code to the certificates list.', '', NULL, 1, 0),
(54, 1, NULL, 'hide_certificate_export_link_students', NULL, NULL, 'certificate', 'false', 'Certificates: hide export link from students', 'If enabled, students won\'t be able to export their certificates to PDF. This option is available because, depending on the precise HTML structure of the certificate template, the PDF export might be of low quality. In this case, it is best to only show the HTML certificate to students.', '', NULL, 1, 0),
(55, 1, NULL, 'show_chat_folder', NULL, NULL, 'chat', 'true', 'Show the history folder of chat conversations', 'This will show to theacher the folder that contains all sessions that have been made in the chat, the teacher can make them visible or not learners and use them as a resource', '', NULL, 1, 0),
(56, 1, NULL, 'allow_global_chat', NULL, NULL, 'chat', 'false', 'Allow global chat', 'Users can chat with each other', '', NULL, 1, 0),
(57, 1, NULL, 'hide_chat_video', NULL, NULL, 'chat', 'true', 'Hide videochat option in global chat', '', '', NULL, 1, 0),
(58, 1, NULL, 'course_chat_restrict_to_coach', NULL, NULL, 'chat', 'false', 'Restrict course chat to coaches', 'Only allow students to talk to the tutors in the course (not other students).', '', NULL, 1, 0),
(59, 1, NULL, 'course_creation_use_template', NULL, NULL, 'course', '', 'Use template course for new courses', 'Set this to use the same template course (identified by its course numeric ID in the database) for all new courses that will be created on the platform. Please note that, if not properly planned, this setting might have a massive impact on space usage. The template course will be used as if the teacher did a copy of the course with the course backup tools, so no user content is copied, only teacher material. All other course-backup rules apply. Leave empty (or set to 0) to disable.', '', NULL, 1, 0),
(60, 1, NULL, 'active_tools_on_create', NULL, NULL, 'course', 'agenda,announcement,attendance,bbb,blog,chat,course_description,course_progress,customcertificate,document,dropbox,forum,global,glossary,gradebook,group,learnpath,link,mobidico,notebook,notebookteacher,portfolio,positioning,quiz,student_publication,survey,test2pdf,tracking,user,wiki,zoom', 'Active tools on course creation', 'Select the tools that will be *active* after the creation of a course.', '', NULL, 1, 0),
(61, 1, NULL, 'display_coursecode_in_courselist', NULL, NULL, 'course', 'false', 'Display Code in Course name', 'Display Course Code in courses list', '', NULL, 1, 0),
(62, 1, NULL, 'display_teacher_in_courselist', NULL, NULL, 'course', 'true', 'Display teacher in course name', 'Display teacher in courses list', '', NULL, 1, 0),
(63, 1, NULL, 'student_view_enabled', NULL, NULL, 'course', 'true', 'Enable learner view', 'Enable the learner view, which allows a teacher or admin to see a course as a learner would see it', '', NULL, 1, 0),
(64, 1, NULL, 'show_navigation_menu', NULL, NULL, 'course', 'false', 'Display course navigation menu', 'Display a navigation menu that quickens access to the tools', '', NULL, 1, 0),
(65, 1, NULL, 'enable_tool_introduction', NULL, NULL, 'course', 'false', 'Enable tool introduction', 'Enable introductions on each tool\'s homepage', '', NULL, 1, 0),
(66, 1, NULL, 'breadcrumbs_course_homepage', NULL, NULL, 'course', 'course_title', 'Course homepage breadcrumb', 'The breadcrumb is the horizontal links navigation system usually in the top left of your page. This option selects what you want to appear in the breadcrumb on courses\' homepages', '', NULL, 1, 0),
(67, 1, NULL, 'example_material_course_creation', NULL, NULL, 'course', 'true', 'Example material on course creation', 'Create example material automatically when creating a new course', '', NULL, 1, 0),
(68, 1, NULL, 'allow_course_theme', NULL, NULL, 'course', 'true', 'Allow course themes', 'Allows course graphical themes and makes it possible to change the style sheet used by a course to any of the possible style sheets available to Chamilo. When a user enters the course, the style sheet of the course will have priority over the user\'s own style sheet and the platform\'s default style sheet.', '', NULL, 1, 0),
(69, 1, NULL, 'send_email_to_admin_when_create_course', NULL, NULL, 'course', 'false', 'E-mail alert on course creation', 'Send an email to the platform administrator each time a teacher creates a new course', '', NULL, 1, 0),
(70, 1, NULL, 'course_validation', NULL, NULL, 'course', 'false', 'Courses validation', 'When the \'Courses validation\' feature is enabled, a teacher is not able to create a course alone. He/she fills a course request. The platform administrator reviews the request and approves it or rejects it.<br />This feature relies on automated e-mail messaging; set Chamilo to access an e-mail server and to use a dedicated an e-mail account.', '', NULL, 1, 0),
(71, 1, NULL, 'course_validation_terms_and_conditions_url', NULL, NULL, 'course', '', 'Course validation - a link to the terms and conditions', 'This is the URL to the \'Terms and Conditions\' document that is valid for making a course request. If the address is set here, the user should read and agree with these terms and conditions before sending a course request.<br />If you enable Chamilo\'s \'Terms and Conditions\' module and if you want its URL to be used, then leave this setting empty.', '', NULL, 1, 0),
(72, 1, NULL, 'course_hide_tools', NULL, NULL, 'course', '', 'Hide tools from teachers', 'Check the tools you want to hide from teachers. This will prohibit access to the tool.', '', NULL, 1, 0),
(73, 1, NULL, 'scorm_cumulative_session_time', NULL, NULL, 'course', 'true', 'Cumulative session time for SCORM', 'When enabled, the session time for SCORM Learning Paths will be cumulative, otherwise, it will only be counted from the last update time. This is a global setting. It is used when creating a new Learning Path but can then be redefined for each one.', '', NULL, 1, 0),
(74, 1, NULL, 'courses_default_creation_visibility', NULL, NULL, 'course', '2', 'Default course visibility', 'Default course visibility while creating a new course', '', NULL, 1, 0),
(75, 1, NULL, 'course_images_in_courses_list', NULL, NULL, 'course', 'true', 'Courses custom icons', 'Use course images as the course icon in courses lists (instead of the default green blackboard icon).', '', NULL, 1, 0),
(76, 1, NULL, 'show_toolshortcuts', NULL, NULL, 'course', '', 'Tools shortcuts', 'Show the tool shortcuts in the banner?', '', NULL, 1, 0),
(77, 1, NULL, 'course_creation_splash_screen', NULL, NULL, 'course', 'true', 'Splash screen for courses', 'Show a splash screen when creating a new course.', '', NULL, 1, 0),
(78, 1, NULL, 'block_registered_users_access_to_open_course_contents', NULL, NULL, 'course', 'false', 'Block public courses access to authenticated users', 'Only show public courses. Do not allow registered users to access courses with \'open\' visibility unless they are subscribed to each of these courses.', '', NULL, 1, 0),
(79, 1, NULL, 'view_grid_courses', NULL, NULL, 'course', 'true', 'View courses in a grid layout', 'View courses in a layout with several courses per line. Otherwise, the layout will show one course per line.', '', NULL, 1, 0),
(80, 1, NULL, 'my_courses_show_courses_in_user_language_only', NULL, NULL, 'course', 'false', 'Only show courses in the user\'s language', 'If enabled, this option will hide all courses not set in the user\'s language.', '', NULL, 1, 0),
(81, 1, NULL, 'allow_public_course_with_no_terms_conditions', NULL, NULL, 'course', 'false', 'Access public courses with terms and conditions', 'With this option enabled, if a course has public visibility and terms and conditions, those terms are disabled while the course is public.', '', NULL, 1, 0),
(82, 1, NULL, 'allow_base_course_category', NULL, NULL, 'course', 'false', 'Use course categories from top URL', 'In multi-URL settings, allow admins and teachers to assign categories from the top URL to courses in the children URLs.', '', NULL, 1, 0),
(83, 1, NULL, 'hide_course_sidebar', NULL, NULL, 'course', 'true', 'Hide courses block in the sidebar', 'When on screens where the left menu is visible, do not display the « Courses » section.', '', NULL, 1, 0),
(84, 1, NULL, 'multiple_access_url_show_shared_course_marker', NULL, NULL, 'course', 'false', 'Show multi-URL shared course marker', 'Adds a link icon to courses that are shared between URLs, so users (in particular teachers) know they have to take special care when editing the course content.', '', NULL, 1, 0),
(85, 1, NULL, 'course_category_code_to_use_as_model', NULL, NULL, 'course', 'MY_CATEGORY', 'Restrict course templates to one course category', 'Give a category code to use as course templates. Only those courses will show in the drop-down at course creation time, and users won’t see the courses in this category from the courses catalogue.', '', NULL, 1, 0),
(86, 1, NULL, 'enable_unsubscribe_button_on_my_course_page', NULL, NULL, 'course', 'false', 'Show unsubscribe button in ‘My courses’', 'Add a button to unsubscribe from a course on the ‘My courses’ page.', '', NULL, 1, 0),
(87, 1, NULL, 'course_creation_donate_message_show', NULL, NULL, 'course', 'false', 'Show donate message on course creation page', 'Add a message box in the course creation page for teachers, asking them to donate to the project.', '', NULL, 1, 0),
(88, 1, NULL, 'course_creation_donate_link', NULL, NULL, 'course', '<some donate button html>', 'Donation link on course creation page', 'The page the donation message should link to (full URL).', '', NULL, 1, 0),
(89, 1, NULL, 'hide_course_rating', NULL, NULL, 'course', 'false', 'Hide course rating', 'The course rating feature comes by default in different places. If you don’t want it, enable this option.', '', NULL, 1, 0),
(90, 1, 20, 'course_log_hide_columns', NULL, NULL, 'course', '', 'Hide columns from course logs', 'This array gives you the possibility to configure which columns to hide in the main course stats page and in the total time report.', '', NULL, 1, 0),
(91, 1, 21, 'course_student_info', NULL, NULL, 'course', '', 'Course student info display', 'On the ‘My courses’/’My sessions’ pages, show additional information regarding the score, progress and/or certificate acquisition by the student.', '', NULL, 1, 0),
(92, 1, NULL, 'resource_sequence_show_dependency_in_course_intro', NULL, NULL, 'course', 'false', 'Show dependencies in course intro', 'When using resources sequencing with courses or sessions, show the dependencies of the course on the course’s homepage.', '', NULL, 1, 0),
(93, 1, NULL, 'course_sequence_valid_only_in_same_session', NULL, NULL, 'course', 'false', 'Validate prerequisites only within the same session', 'When enabled, a course will be considered validated only if passed within the current session. If disabled, courses passed in other sessions will also unlock dependent courses.', '', NULL, 1, 0),
(94, 1, NULL, 'course_creation_form_set_course_category_mandatory', NULL, NULL, 'course', 'false', 'Set course category mandatory', 'When creating a course, make the course category a required setting.', '', NULL, 1, 0),
(95, 1, NULL, 'course_creation_form_hide_course_code', NULL, NULL, 'course', 'false', 'Remove course code field from course creation form', 'If not provided, the course code is generated by default based on the course title, so enable this option to remove the code field from the course creation form altogether.', '', NULL, 1, 0),
(96, 1, NULL, 'course_about_teacher_name_hide', NULL, NULL, 'course', 'false', 'Hide course teacher info on course details page', 'On the course details page, hide the teacher information.', '', NULL, 1, 0),
(97, 1, 22, 'course_log_default_extra_fields', NULL, NULL, 'course', '', 'User extra fields by default in course stats page', 'Configure this array with the internal IDs of the extra fields you want to show by default in the main course stats page.', '', NULL, 1, 0),
(98, 1, 23, 'course_creation_by_teacher_extra_fields_to_show', NULL, NULL, 'course', '', 'Extra fields to show on course creation form', 'The fields defined in this array will appear as additional fields in the course creation form.', '', NULL, 1, 0),
(99, 1, 24, 'course_creation_form_set_extra_fields_mandatory', NULL, NULL, 'course', '', 'Extra fields to require on course creation form', 'The fields defined in this array will be mandatory in the course creation form.', '', NULL, 1, 0),
(100, 1, 25, 'course_configuration_tool_extra_fields_to_show_and_edit', NULL, NULL, 'course', '', 'Extra fields to show in course settings', 'The fields defined in this array will appear on the course settings page.', '', NULL, 1, 0),
(101, 1, 26, 'course_creation_user_course_extra_field_relation_to_prefill', NULL, NULL, 'course', '', 'Prefill course fields with fields from user', 'If not empty, the course creation process will look for some fields in the user profile and auto-fill them for the course. For example, a teacher specialized in digital marketing could automatically set a « digital marketing » flag on each course (s)he creates.', '', NULL, 1, 0),
(102, 1, NULL, 'show_course_duration', NULL, NULL, 'course', 'false', 'Show courses duration', 'Display the course duration next to the course title in the course catalogue and the courses list.', '', NULL, 1, 0),
(103, 1, NULL, 'profiling_filter_adding_users', NULL, NULL, 'course', 'false', 'Filter users on profile fields on subscription to course', 'Allow teachers to filter the users based on extra fields on the page to subscribe users to their course.', '', NULL, 1, 0),
(104, 1, NULL, 'cron_remind_course_finished_activate', NULL, NULL, 'crons', 'false', 'Send course finished notification', 'Whether to send an e-mail to students when their course (session) is finished. This requires cron tasks to be configured (see main/cron/ directory).', '', NULL, 1, 0),
(105, 1, NULL, 'cron_remind_course_expiration_frequency', NULL, NULL, 'crons', '', 'Frequency for the Remind Course Expiration cron', 'Number of days before the expiration of the course to consider to send reminder mail', '', NULL, 1, 0),
(106, 1, NULL, 'cron_remind_course_expiration_activate', NULL, NULL, 'crons', 'false', 'Remind Course Expiration cron', 'Enable the Remind Course Expiration cron', '', NULL, 1, 0),
(107, 1, NULL, 'enable_help_link', NULL, NULL, 'display', 'true', 'Enable help link', 'The Help link is located in the top right part of the screen', '', NULL, 1, 0),
(108, 1, NULL, 'show_administrator_data', NULL, NULL, 'display', 'true', 'Platform Administrator Information in footer', 'Show the Information of the Platform Administrator in the footer?', '', NULL, 1, 0),
(109, 1, NULL, 'show_tutor_data', NULL, NULL, 'display', 'true', 'Session\'s tutor\'s data is shown in the footer.', 'Show the session\'s tutor reference (name and e-mail if available) in the footer?', '', NULL, 1, 0),
(110, 1, NULL, 'show_teacher_data', NULL, NULL, 'display', 'true', 'Show teacher information in footer', 'Show the teacher reference (name and e-mail if available) in the footer?', '', NULL, 1, 0),
(111, 1, NULL, 'showonline', NULL, NULL, 'display', 'world', 'Who\'s Online', 'Display the number of persons that are online?', '', NULL, 1, 0),
(112, 1, NULL, 'time_limit_whosonline', NULL, NULL, 'display', '30', 'Time limit on Who Is Online', 'This time limit defines for how many minutes after his last action a user will be considered *online*', '', NULL, 1, 0),
(113, 1, NULL, 'show_email_addresses', NULL, NULL, 'display', 'false', 'Show email addresses', 'Show email addresses to users', '', NULL, 1, 0),
(114, 1, NULL, 'show_number_of_courses', NULL, NULL, 'display', 'false', 'Show courses number', 'Show the number of courses in each category in the courses categories on the homepage', '', NULL, 1, 0),
(115, 1, NULL, 'show_empty_course_categories', NULL, NULL, 'display', 'true', 'Show empty courses categories', 'Show the categories of courses on the homepage, even if they\'re empty', '', NULL, 1, 0),
(116, 1, NULL, 'show_back_link_on_top_of_tree', NULL, NULL, 'display', 'false', 'Show back links from categories/courses', 'Show a link to go back in the courses hierarchy. A link is available at the bottom of the list anyway.', '', NULL, 1, 0),
(117, 1, NULL, 'display_categories_on_homepage', NULL, NULL, 'display', 'false', 'Display categories on home page', 'This option will display or hide courses categories on the portal home page', '', NULL, 1, 0),
(118, 1, NULL, 'show_closed_courses', NULL, NULL, 'display', 'false', 'Display closed courses on login page and portal start page?', 'Display closed courses on the login page and courses start page? On the portal start page an icon will appear next to the courses to quickly subscribe to each courses. This will only appear on the portal\'s start page when the user is logged in and when the user is not subscribed to the portal yet.', '', NULL, 1, 0),
(119, 1, NULL, 'accessibility_font_resize', NULL, NULL, 'display', 'false', 'Font resize accessibility feature', 'Enable this option to show a set of font resize options on the top-right side of your campus. This will allow visually impaired to read their course contents more easily.', '', NULL, 1, 0),
(120, 1, NULL, 'show_admin_toolbar', NULL, NULL, 'display', 'do_not_show', 'Show admin toolbar', 'Shows a global toolbar on top of the page to the designated user roles. This toolbar, very similar to Wordpress and Google\'s black toolbars, can really speed up complicated actions and improve the space you have available for the learning content, but it might be confusing for some users', '', NULL, 1, 0),
(121, 1, NULL, 'show_hot_courses', NULL, NULL, 'display', 'true', 'Show hot courses', 'The hot courses list will be added in the index page', '', NULL, 1, 0),
(122, 1, NULL, 'hide_home_top_when_connected', NULL, NULL, 'display', 'false', 'Hide top content on homepage when logged in', 'On the platform homepage, this option allows you to hide the introduction block (to leave only the announcements, for example), for all users that are already logged in. The general introduction block will still appear to users not already logged in.', '', NULL, 1, 0),
(123, 1, NULL, 'hide_logout_button', NULL, NULL, 'display', 'false', 'Hide logout button', 'Hide the logout button. This is usually only interesting when using an external login/logout method, for example when using Single Sign On of some sort.', '', NULL, 1, 0),
(124, 1, NULL, 'icons_mode_svg', NULL, NULL, 'display', 'false', 'SVG icons mode', 'By enabling this option, all icons that have an SVG version will prefer the SVG format to PNG. This will give a much better icons quality but some icons might still have some rendering size issue, and some browsers might not support it.', '', NULL, 1, 0),
(125, 1, NULL, 'hide_social_media_links', NULL, NULL, 'display', 'false', 'Hide social media links', 'Some pages allow you to promote the portal or a course on social networks. Enable this setting to remove the links.', '', NULL, 1, 0),
(126, 1, NULL, 'gravatar_enabled', NULL, NULL, 'display', 'false', 'Gravatar user pictures', 'Enable this option to search into the Gravatar repository for pictures of the current user, if the user hasn\'t defined a picture locally. This is great to auto-fill pictures on your site, in particular if your users are active internet users. Gravatar pictures can be configured easily, based on the e-mail address of a user, at http://en.gravatar.com/', '', NULL, 1, 0),
(127, 1, NULL, 'gravatar_type', NULL, NULL, 'display', 'mm', 'Gravatar avatar type', 'If the Gravatar option is enabled and the user doesn\'t have a picture configured on Gravatar, this option allows you to choose the type of avatar that Gravatar will generate for each user. Check <a href=\'http://en.gravatar.com/site/implement/images#default-image\'>http://en.gravatar.com/site/implement/images#default-image</a> for avatar types examples.', '', NULL, 1, 0),
(128, 1, NULL, 'order_user_list_by_official_code', NULL, NULL, 'display', 'false', 'Order users by official code', 'Use the \'official code\' to sort most students list on the platform, instead of their lastname or firstname.', '', NULL, 1, 0),
(129, 1, NULL, 'pdf_logo_header', NULL, NULL, 'display', '', 'PDF header logo', 'Whether to use the image at var/themes/[your-theme]/images/pdf_logo_header.png as the PDF header logo for all PDF exports (instead of the normal portal logo)', '', NULL, 1, 0),
(130, 1, NULL, 'show_tabs', NULL, NULL, 'display', 'campus_homepage,my_courses,reporting,platform_administration,my_agenda,social,catalogue,session_admin,topbar_certificate,topbar_skills', 'Main menu entries', 'Check the entrie you want to see appear in the main menu', '', NULL, 1, 0),
(131, 1, 3, 'show_tabs_per_role', NULL, NULL, 'display', '{}', 'Main menu entries per role', 'Define header tabs visibility per role.', '', NULL, 1, 0),
(132, 1, NULL, 'hide_main_navigation_menu', NULL, NULL, 'display', 'false', 'Hide main navigation menu', 'When using Chamilo for a specific purpose (like one massive online exam), you might want to reduce distraction even more by removing the side menu.', '', NULL, 1, 0),
(133, 1, NULL, 'hide_complete_name_in_whoisonline', NULL, NULL, 'display', 'false', 'Hide the complete username in \'who is online\'', 'The \'who is online\' page (if enabled) will show a picture and a name for each user currently online. Enable this option to hide the names.', '', NULL, 1, 0),
(134, 1, NULL, 'table_default_row', NULL, NULL, 'display', '20', 'Default number of table rows', 'How many rows should be shown in all tables by default.', '', NULL, 1, 0),
(135, 1, 4, 'table_row_list', NULL, NULL, 'display', '[10,20,50,100]', 'Default offered pagination numbers in tables', 'Set the options you want to appear in the navigation around a table to show less or more rows on one page. e.g. [50, 100, 200, 500].', '', NULL, 1, 0),
(136, 1, NULL, 'default_document_quotum', NULL, NULL, 'document', '1000', 'Default hard disk space', 'What is the available disk space for a course? You can override the quota for specific course through: platform administration > Courses > modify', '', NULL, 1, 0),
(137, 1, NULL, 'default_group_quotum', NULL, NULL, 'document', '250', 'Group disk space available', 'What is the default hard disk spacde available for a groups documents tool?', '', NULL, 1, 0),
(138, 1, NULL, 'permanently_remove_deleted_files', NULL, NULL, 'document', 'false', 'Deleted files cannot be restored', 'Deleting a file in the documents tool permanently deletes it. The file cannot be restored', '', NULL, 1, 1),
(139, 1, NULL, 'upload_extensions_list_type', NULL, NULL, 'document', 'blacklist', 'Type of filtering on document uploads', 'Whether you want to use the blacklist or whitelist filtering. See blacklist or whitelist description below for more details.', '', NULL, 1, 1),
(140, 1, NULL, 'upload_extensions_blacklist', NULL, NULL, 'document', '', 'Blacklist - setting', 'The blacklist is used to filter the files extensions by removing (or renaming) any file which extension figures in the blacklist below. The extensions should figure without the leading dot (.) and separated by semi-column (;) like the following:  exe;com;bat;scr;php. Files without extension are accepted. Letter casing (uppercase/lowercase) doesn\'t matter.', '', NULL, 1, 1),
(141, 1, NULL, 'upload_extensions_whitelist', NULL, NULL, 'document', 'htm;html;jpg;jpeg;gif;png;swf;avi;mpg;mpeg;mov;flv;doc;docx;xls;xlsx;ppt;pptx;odt;odp;ods;pdf;webm;oga;ogg;ogv;h264', 'Whitelist - setting', 'The whitelist is used to filter the file extensions by removing (or renaming) any file whose extension does *NOT* figure in the whitelist below. It is generally considered as a safer but more restrictive approach to filtering. The extensions should figure without the leading dot (.) and separated by semi-column (;) such as the following:  htm;html;txt;doc;xls;ppt;jpg;jpeg;gif;sxw. Files without extension are accepted. Letter casing (uppercase/lowercase) doesn\'t matter.', '', NULL, 1, 1),
(142, 1, NULL, 'upload_extensions_skip', NULL, NULL, 'document', 'true', 'Filtering behaviour (skip/rename)', 'If you choose to skip, the files filtered through the blacklist or whitelist will not be uploaded to the system. If you choose to rename them, their extension will be replaced by the one defined in the extension replacement setting. Beware that renaming doesn\'t really protect you, and may cause name collision if several files of the same name but different extensions exist.', '', NULL, 1, 1),
(143, 1, NULL, 'upload_extensions_replace_by', NULL, NULL, 'document', 'dangerous', 'Replacement extension', 'Enter the extension that you want to use to replace the dangerous extensions detected by the filter. Only needed if you have selected a filter by replacement.', '', NULL, 1, 1),
(144, 1, NULL, 'permissions_for_new_directories', NULL, NULL, 'document', '0770', 'Permissions for new directories', 'The ability to define the permissions settings to assign to every newly created directory lets you improve security against attacks by hackers uploading dangerous content to your portal. The default setting (0770) should be enough to give your server a reasonable protection level. The given format uses the UNIX terminology of Owner-Group-Others with Read-Write-Execute permissions.', '', NULL, 1, 1),
(145, 1, NULL, 'permissions_for_new_files', NULL, NULL, 'document', '0660', 'Permissions for new files', 'The ability to define the permissions settings to assign to every newly-created file lets you improve security against attacks by hackers uploading dangerous content to your portal. The default setting (0550) should be enough to give your server a reasonable protection level. The given format uses the UNIX terminology of Owner-Group-Others with Read-Write-Execute permissions. If you use Oogie, take care that the user who launch LibreOffice can write files in the course folder.', '', NULL, 1, 1),
(146, 1, NULL, 'show_glossary_in_documents', NULL, NULL, 'document', 'none', 'Show glossary terms in documents', 'From here you can configure how to add links to the glossary terms from the documents', '', NULL, 1, 0),
(147, 1, NULL, 'students_download_folders', NULL, NULL, 'document', 'true', 'Allow learners to download directories', 'Allow learners to pack and download a complete directory from the document tool', '', NULL, 1, 0),
(148, 1, NULL, 'users_copy_files', NULL, NULL, 'document', 'true', 'Allow users to copy files from a course in your personal file area', 'Allows users to copy files from a course in your personal file area, visible through the Social Network or through the HTML editor when they are out of a course', '', NULL, 1, 0),
(149, 1, NULL, 'pdf_export_watermark_enable', NULL, NULL, 'document', 'false', 'Enable watermark in PDF export', 'By enabling this option, you can upload an image or a text that will be automatically added as watermark to all PDF exports of documents on the system.', '', NULL, 1, 0),
(150, 1, NULL, 'pdf_export_watermark_by_course', NULL, NULL, 'document', 'false', 'Enable watermark definition by course', 'When this option is enabled, teachers can define their own watermark for the documents in their courses.', '', NULL, 1, 0),
(151, 1, NULL, 'pdf_export_watermark_text', NULL, NULL, 'document', '', 'PDF watermark text', 'This text will be added as a watermark to the documents exports as PDF.', '', NULL, 1, 0),
(152, 1, NULL, 'students_export2pdf', NULL, NULL, 'document', 'true', 'Allow learners to export web documents to PDF format in the documents and wiki tools', 'This feature is enabled by default, but in case of server overload abuse it, or specific learning environments, might want to disable it for all courses.', '', NULL, 1, 0),
(153, 1, NULL, 'show_users_folders', NULL, NULL, 'document', 'true', 'Show users folders in the documents tool', 'This option allows you to show or hide to teachers the folders that the system generates for each user who visits the tool documents or send a file through the web editor. If you display these folders to the teachers, they may make visible or not the learners and allow each learner to have a specific place on the course where not only store documents, but where they can also create and edit web pages and to export to pdf, make drawings, make personal web templates, send files, as well as create, move and delete directories and files and make security copies from their folders. Each user of course have a complete document manager. Also, remember that any user can copy a file that is visible from any folder in the documents tool (whether or not the owner) to his/her portfolios or personal documents area of social network, which will be available for his/her can use it in other courses.', '', NULL, 1, 0),
(154, 1, NULL, 'show_default_folders', NULL, NULL, 'document', 'true', 'Show in documents tool all folders containing multimedia resources supplied by default', 'Multimedia file folders containing files supplied by default organized in categories of video, audio, image and flash animations to use in their courses. Although you make it invisible into the document tool, you can still use these resources in the platform web editor.', '', NULL, 1, 0),
(155, 1, NULL, 'show_documents_preview', NULL, NULL, 'document', 'false', 'Show document preview', 'Showing previews of the documents in the documents tool will avoid loading a new page just to show a document, but can result unstable with some older browsers or smaller width screens.', '', NULL, 1, 0),
(156, 1, NULL, 'tool_visible_by_default_at_creation', NULL, NULL, 'document', 'documents,learning_path,links,announcements,forums,quiz,gradebook', 'Tool visible at course creation', 'Select the tools that will be visible when creating the courses - not yet available', '', NULL, 1, 0),
(157, 1, NULL, 'documents_default_visibility_defined_in_course', NULL, NULL, 'document', 'false', 'Document visibility defined in course', 'The default document visibility for all courses', '', NULL, 1, 0),
(158, 1, NULL, 'send_notification_when_document_added', NULL, NULL, 'document', 'false', 'Send notification to students when document added', 'Whenever someone creates a new item in the documents tool, send a notification to users.', '', NULL, 1, 0),
(159, 1, NULL, 'thematic_pdf_orientation', NULL, NULL, 'document', 'landscape', 'PDF orientation for course progress', 'In the course progress tool, you can print a PDF of the different elements. Set ‘portrait’ or ‘landscape’ (technical terms) to change it.', '', NULL, 1, 0),
(160, 1, NULL, 'group_document_access', NULL, NULL, 'document', 'false', 'Enable sharing options for group document', '', '', NULL, 1, 0),
(161, 1, NULL, 'group_category_document_access', NULL, NULL, 'document', 'false', 'Enable sharing options for document inside group category', '', '', NULL, 1, 0),
(162, 1, NULL, 'documents_hide_download_icon', NULL, NULL, 'document', 'false', 'Hide documents download icon', 'In the documents tool, hide the download icon from users.', '', NULL, 1, 0),
(163, 1, NULL, 'enable_x_sendfile_headers', NULL, NULL, 'document', 'false', 'Enable X-sendfile headers', 'Enable this if you have X-sendfile enabled at the web server level and you want to add the required headers for browsers to pick it up.', '', NULL, 1, 0),
(164, 1, 28, 'documents_custom_cloud_link_list', NULL, NULL, 'document', '', 'Set strict hosts list for cloud links', 'The documents tool can integrate links to files in the cloud. The list of cloud services is limited to a hardcoded list, but you can define the ‘links’ array that will contain a list of your own list of services/URLs. The list defined here will replace the default list.', '', NULL, 1, 0),
(165, 1, NULL, 'access_url_specific_files', NULL, NULL, 'document', 'false', 'Enable URL-specific files', 'When this feature is enabled on a multi-URL configuration, you can go to the main URL and provide URL-specific versions of any file (in the documents tool). The original file will be replaced by the alternative whenever seeing it from a different URL. This allows you to customize each URL even further, while enjoying the advantage of re-using the same courses many times.', '', NULL, 1, 0),
(166, 1, 27, 'video_features', NULL, NULL, 'document', '', 'Video features', 'Array of extra features you can enable for the video player in Chamilo. Options include \'speed\', which allows you to change the playback speed of a video.', '', NULL, 1, 0),
(167, 1, NULL, 'dropbox_allow_overwrite', NULL, NULL, 'dropbox', 'true', 'Dropbox: Can documents be overwritten', 'Can the original document be overwritten when a user or trainer uploads a document with the name of a document that already exist? If you answer yes then you loose the versioning mechanism.', '', NULL, 1, 0),
(168, 1, NULL, 'dropbox_max_filesize', NULL, NULL, 'dropbox', '100000000', 'Dropbox: Maximum file size of a document', 'How big (in MB) can a dropbox document be?', '', NULL, 1, 0),
(169, 1, NULL, 'dropbox_allow_just_upload', NULL, NULL, 'dropbox', 'true', 'Dropbox: Upload to own dropbox space?', 'Allow trainers and users to upload documents to their dropbox without sending  the documents to themselves', '', NULL, 1, 0),
(170, 1, NULL, 'dropbox_allow_student_to_student', NULL, NULL, 'dropbox', 'true', 'Dropbox: Learner <-> Learner', 'Allow users to send documents to other users (peer 2 peer). Users might use this for less relevant documents also (mp3, tests solutions, ...). If you disable this then the users can send documents to the trainer only.', '', NULL, 1, 0),
(171, 1, NULL, 'dropbox_allow_group', NULL, NULL, 'dropbox', 'true', 'Dropbox: allow group', 'Users can send files to groups', '', NULL, 1, 0),
(172, 1, NULL, 'dropbox_allow_mailing', NULL, NULL, 'dropbox', 'false', 'Dropbox: Allow mailing', 'With the mailing functionality you can send each learner a personal document', '', NULL, 1, 0),
(173, 1, NULL, 'dropbox_hide_course_coach', NULL, NULL, 'dropbox', 'false', 'Dropbox: hide course coach', 'Hide session course coach in dropbox when a document is sent by the coach to students', '', NULL, 1, 0),
(174, 1, NULL, 'dropbox_hide_general_coach', NULL, NULL, 'dropbox', 'false', 'Hide general coach in dropbox', 'Hide general coach name in the dropbox tool when the general coach uploaded the file', '', NULL, 1, 0),
(175, 1, NULL, 'allow_email_editor', NULL, NULL, 'editor', '', 'Online e-mail editor enabled', 'If this option is activated, clicking on an e-mail address will open an online editor.', '', NULL, 1, 0),
(176, 1, NULL, 'math_asciimathML', NULL, NULL, 'editor', '', 'ASCIIMathML mathematical editor', 'Enable ASCIIMathML mathematical editor', '', NULL, 1, 0),
(177, 1, NULL, 'enabled_asciisvg', NULL, NULL, 'editor', '', 'Enable AsciiSVG', 'Enable the AsciiSVG plugin in the WYSIWYG editor to draw charts from mathematical functions.', '', NULL, 1, 0),
(178, 1, NULL, 'include_asciimathml_script', NULL, NULL, 'editor', '', 'Load the Mathjax library in all the system pages', 'Activate this setting if you want to show MathML-based mathematical formulas and ASCIIsvg-based mathematical graphics not only in the \'Documents\' tool, but elsewhere in the system.', '', NULL, 1, 0),
(179, 1, NULL, 'youtube_for_students', NULL, NULL, 'editor', '', 'Allow learners to insert videos from YouTube', 'Enable the possibility that learners can insert Youtube videos', '', NULL, 1, 0),
(180, 1, NULL, 'block_copy_paste_for_students', NULL, NULL, 'editor', '', 'Block learners copy and paste', 'Block learners the ability to copy and paste into the WYSIWYG editor', '', NULL, 1, 0),
(181, 1, NULL, 'more_buttons_maximized_mode', NULL, NULL, 'editor', 'true', 'Buttons bar extended', 'Enable button bars extended when the WYSIWYG editor is maximized', '', NULL, 1, 0),
(182, 1, NULL, 'enabled_wiris', NULL, NULL, 'editor', '', 'WIRIS mathematical editor', 'Enable WIRIS mathematical editor. Installing this plugin you get WIRIS editor and WIRIS CAS.<br/>This activation is not fully realized unless it has been previously downloaded the <a href=\'http://www.wiris.com/es/plugins3/ckeditor/download\' target=\'_blank\'>PHP plugin for CKeditor WIRIS</a> and unzipped its contents in the Chamilo\'s directory main/inc/lib/javascript/ckeditor/plugins/.<br/>This is necessary because Wiris is proprietary software and his services are <a href=\'http://www.wiris.com/store/who-pays\' target=\'_blank\'>commercial</a>. To make adjustments to the plugin, edit configuration.ini file or replace his content by the file configuration.ini.default shipped with Chamilo.', '', NULL, 1, 0),
(183, 1, NULL, 'allow_spellcheck', NULL, NULL, 'editor', '', 'Spell check', 'Enable spell check', '', NULL, 1, 0),
(184, 1, NULL, 'force_wiki_paste_as_plain_text', NULL, NULL, 'editor', '', 'Forcing pasting as plain text in the wiki', 'This will prevent many hidden tags, incorrect or non-standard, copied from other texts to stop corrupting the text of the Wiki after many issues; but will lose some features while editing.', '', NULL, 1, 0),
(185, 1, NULL, 'enabled_googlemaps', NULL, NULL, 'editor', '', 'Activate Google maps', 'Activate the button to insert Google maps. Activation is not fully realized if not previously edited the file main/inc/lib/fckeditor/myconfig.php and added a Google maps API key.', '', NULL, 1, 0);
INSERT INTO `settings` (`id`, `access_url`, `value_template_id`, `variable`, `subkey`, `type`, `category`, `selected_value`, `title`, `comment`, `scope`, `subkeytext`, `access_url_changeable`, `access_url_locked`) VALUES
(186, 1, NULL, 'enabled_imgmap', NULL, NULL, 'editor', '', 'Activate Image maps', 'Activate the button to insert Image maps. This allows you to associate URLs to areas of an image, creating hotspots.', '', NULL, 1, 0),
(187, 1, NULL, 'enabled_support_svg', NULL, NULL, 'editor', '', 'Create and edit SVG files', 'This option allows you to create and edit SVG (Scalable Vector Graphics) multilayer online, as well as export them to png format images.', '', NULL, 1, 0),
(188, 1, NULL, 'enabled_insertHtml', NULL, NULL, 'editor', '', 'Allow insertion of widgets', 'This allows you to embed on your webpages your favorite videos and applications such as vimeo or slideshare and all sorts of widgets and gadgets', '', NULL, 1, 0),
(189, 1, NULL, 'htmlpurifier_wiki', NULL, NULL, 'editor', '', 'HTMLPurifier in Wiki', 'Enable HTML purifier in the wiki tool (will increase security but reduce style features)', '', NULL, 1, 0),
(190, 1, NULL, 'enable_iframe_inclusion', NULL, NULL, 'editor', '', 'Allow iframes in HTML Editor', 'Allowing arbitrary iframes in the HTML Editor will enhance the edition capabilities of the users, but it can represent a security risk. Please make sure you can rely on your users (i.e. you know who they are) before enabling this feature.', '', NULL, 1, 0),
(191, 1, NULL, 'enabled_mathjax', NULL, NULL, 'editor', '', 'Enable MathJax', 'Enable the MathJax library to visualize mathematical formulas. This is only useful if either ASCIIMathML or ASCIISVG settings are enabled.', '', NULL, 1, 0),
(192, 1, NULL, 'translate_html', NULL, NULL, 'editor', 'false', 'Support multi-language HTML content', 'If enabled, this option allows users to use a ‘lang’ attribute in HTML elements to define the langage the content of that element is written in. Enable multiple elements with different ‘lang’ attributes and Chamilo will display the content in the langage of the user only.', '', NULL, 1, 0),
(193, 1, NULL, 'save_titles_as_html', NULL, NULL, 'editor', 'false', 'Save titles as HTML', 'Allow users to include HTML in title fields in several places. This allows for some styling of titles, notably in test questions.', '', NULL, 1, 0),
(194, 1, NULL, 'full_ckeditor_toolbar_set', NULL, NULL, 'editor', 'false', 'Full WYSIWYG editor toolbar', 'Show the full toolbar in all WYSIWYG editor boxes around the platform.', '', NULL, 1, 0),
(195, 1, NULL, 'ck_editor_block_image_copy_paste', NULL, NULL, 'editor', 'false', 'Prevent copy-pasting images in WYSIWYG editor', 'Prevent the use of images copy-paste as base64 in the editor to avoid filling the database with images.', '', NULL, 1, 0),
(196, 1, 29, 'editor_driver_list', NULL, NULL, 'editor', '', 'List of WYSIWYG files drivers', 'Array containing the names of the drivers for files access from the WYSIWYG editor.', '', NULL, 1, 0),
(197, 1, NULL, 'enable_uploadimage_editor', NULL, NULL, 'editor', 'false', 'Allow images drag&drop in WYSIWYG editor', 'Enable image upload as file when doing a copy in the content or a drag and drop.', '', NULL, 1, 0),
(198, 1, 30, 'editor_settings', NULL, NULL, 'editor', '', 'WYSIWYG editor settings', 'Generic configuration array to reconfigure the WYSIWYG editor globally.', '', NULL, 1, 0),
(199, 1, NULL, 'video_context_menu_hidden', NULL, NULL, 'editor', 'false', 'Hide the context menu on video player', '', '', NULL, 1, 0),
(200, 1, 31, 'video_player_renderers', NULL, NULL, 'editor', '', 'Video player renderers', 'Enable player renderers for YouTube, Vimeo, Facebook, DailyMotion, Twitch medias', '', NULL, 1, 0),
(201, 1, NULL, 'exercise_min_score', NULL, NULL, 'exercise', '0', 'Minimum score of exercises', 'Define a minimum score (generally 0) for all the exercises on the platform. This will define how final results are shown to users and teachers.', '', NULL, 1, 0),
(202, 1, NULL, 'exercise_max_score', NULL, NULL, 'exercise', '20', 'Maximum score of exercises', 'Define a maximum score (generally 10,20 or 100) for all the exercises on the platform. This will define how final results are shown to users and teachers.', '', NULL, 1, 0),
(203, 1, NULL, 'enable_quiz_scenario', NULL, NULL, 'exercise', 'true', 'Enable Quiz scenario', 'From here you will be able to create exercises that propose different questions depending in the user\'s answers.', '', NULL, 1, 0),
(204, 1, NULL, 'allow_coach_feedback_exercises', NULL, NULL, 'exercise', 'true', 'Allow coaches to comment in review of exercises', 'Allow coaches to edit feedback during review of exercises', '', NULL, 1, 0),
(205, 1, NULL, 'show_official_code_exercise_result_list', NULL, NULL, 'exercise', 'false', 'Display official code in exercises results', 'Whether to show the students\' official code in the exercises results reports', '', NULL, 1, 0),
(206, 1, NULL, 'email_alert_manager_on_new_quiz', NULL, NULL, 'exercise', 'true', 'Default e-mail alert setting on new quiz', 'Whether you want course managers (teachers) to be notified by e-mail when a quiz is answered by a student. This is the default value to be given to all new courses, but each teacher can still change this setting in his/her own course.', '', NULL, 1, 0),
(207, 1, NULL, 'exercise_max_ckeditors_in_page', NULL, NULL, 'exercise', '0', 'Max editors in exercise result screen', 'Because of the sheer number of questions that might appear in an exercise, the correction screen, allowing the teacher to add comments to each answer, might be very slow to load. Set this number to 5 to ask the platform to only show WYSIWYG editors up to a certain number of answers on the screen. This will speed up the correction page loading time considerably, but will remove WYSIWYG editors and leave only a plain text editor.', '', NULL, 1, 0),
(208, 1, NULL, 'configure_exercise_visibility_in_course', NULL, NULL, 'exercise', 'false', 'Enable to bypass the configuration of Exercise invisible in session at a base course level', 'To enable the configuration of the exercise invisibility in session in the base course to by pass the global configuration. If not set the global parameter is used.', '', NULL, 1, 0),
(209, 1, NULL, 'exercise_invisible_in_session', NULL, NULL, 'exercise', 'false', 'Exercise invisible in Session', 'If an exercise is visible in the base course then it appears invisible in the session. If an exercise is invisible in the base course then it does not appear in the session.', '', NULL, 1, 0),
(210, 1, NULL, 'exercise_hide_label', NULL, NULL, 'exercise', 'false', 'Hide question ribbon (right/wrong) in test results', 'In test results, a ribbon appears by default to indicate if the answer was right or wrong. Enable this option to remove the ribbon globally.', '', NULL, 1, 0),
(211, 1, NULL, 'block_quiz_mail_notification_general_coach', NULL, NULL, 'exercise', 'false', 'Block sending test notifications to general coach', 'Learners completing a test usually sends notifications to coaches, including the general session coach. Enable this option to omit the general coach from these notifications.', '', NULL, 1, 0),
(212, 1, NULL, 'allow_quiz_question_feedback', NULL, NULL, 'exercise', 'false', 'Add question feedback if incorrect answer', 'By default, Chamilo allows you to show feedback on each answer in a question. With this option, an additional field is created to provide pre-defined feedback to the whole question. This feedback will only appear if the user answered incorrectly.', '', NULL, 1, 0),
(213, 1, NULL, 'allow_quiz_show_previous_button_setting', NULL, NULL, 'exercise', 'false', 'Show \'previous\' button in test to navigate questions', 'Set this to false to disable the \'previous\' button when answering questions in a test, thus forcing users to always move ahead.', '', NULL, 1, 0),
(214, 1, NULL, 'allow_teacher_comment_audio', NULL, NULL, 'exercise', 'true', 'Audio feedback to submitted answers', 'Allow teachers to provide feedback to users through audio (alternatively to text) on each question in a test.', '', NULL, 1, 0),
(215, 1, NULL, 'quiz_prevent_copy_paste', NULL, NULL, 'exercise', 'false', 'Block copy-pasting in tests', 'Block copy/paste/save/print keys and right-clicks in exercises.', '', NULL, 1, 0),
(216, 1, NULL, 'quiz_show_description_on_results_page', NULL, NULL, 'exercise', 'false', 'Always show test description on results page', '', '', NULL, 1, 0),
(217, 1, NULL, 'quiz_generate_certificate_ending', NULL, NULL, 'exercise', 'false', 'Generate certificate on test end', 'Generate certificate when ending a quiz. The quiz needs to be linked in the gradebook tool and have a pass percentage configured.', '', NULL, 1, 0),
(218, 1, NULL, 'quiz_open_question_decimal_score', NULL, NULL, 'exercise', 'false', 'Decimal score in open question types', 'Allow the teacher to rate the open, oral expression and annotation question types with a decimal score.', '', NULL, 1, 0),
(219, 1, NULL, 'quiz_check_button_enable', NULL, NULL, 'exercise', 'false', 'Add answer-saving process check before test', 'Make sure users are all set to start the test by providing a simulation of the question-saving process before entering the test. This allows for early detection of some connection issues and reduces user experience frictions.', '', NULL, 1, 0),
(220, 1, NULL, 'allow_notification_setting_per_exercise', NULL, NULL, 'exercise', 'false', 'Test notification settings at test-level', 'Enable the configuration of test submission notifications at the test level rather than the course level. Falls back to course-level settings if not defined at test-level.', '', NULL, 1, 0),
(221, 1, NULL, 'hide_free_question_score', NULL, NULL, 'exercise', 'false', 'Hide open questions\' score', 'Hide the fact that open questions (including audio and annotations) have a score by hiding the score display in all learner-facing reports.', '', NULL, 1, 0),
(222, 1, NULL, 'hide_user_info_in_quiz_result', NULL, NULL, 'exercise', 'false', 'Hide user info on test results page', 'The default test results page shows a user datasheet (photo, name, etc) which might, in some contexts, be considered as pushing the limits of personal data treatment. Enable this option to remove user details from the test results.', '', NULL, 1, 0),
(223, 1, NULL, 'exercise_attempts_report_show_username', NULL, NULL, 'exercise', 'false', 'Show username in test results page', 'Show the username (instead or, or as well as, the user info) on the test results page.', '', NULL, 1, 0),
(224, 1, NULL, 'disable_clean_exercise_results_for_teachers', NULL, NULL, 'exercise', 'true', 'Disable \'clean results\' for teachers', 'Disable the option to delete test results from the tests list. This is often used when less-careful teachers manage courses, to avoid critical mistakes.', '', NULL, 1, 0),
(225, 1, NULL, 'show_exercise_question_certainty_ribbon_result', NULL, NULL, 'exercise', 'false', 'Show score for certainty degree questions', 'By default, Chamilo does not show a score for the certainty degree question types.', '', NULL, 1, 0),
(226, 1, NULL, 'quiz_results_answers_report', NULL, NULL, 'exercise', 'false', 'Show link to download test results', 'On the test results page, display a link to download the results as a file.', '', NULL, 1, 0),
(227, 1, NULL, 'send_score_in_exam_notification_mail_to_manager', NULL, NULL, 'exercise', 'false', 'Add score in mail notification of test submission', 'Add the learner\'s score to the e-mail notification sent to the teacher after a test was submitted.', '', NULL, 1, 0),
(228, 1, NULL, 'show_exercise_expected_choice', NULL, NULL, 'exercise', 'false', 'Show expected choice in test results', 'Show the expected choice and a status (right/wrong) for each answer on the test results page (if the test has been configured to show results).', '', NULL, 1, 0),
(229, 1, NULL, 'exercise_category_round_score_in_export', NULL, NULL, 'exercise', 'false', 'Round score in test exports', '', '', NULL, 1, 0),
(230, 1, NULL, 'exercises_disable_new_attempts', NULL, NULL, 'exercise', 'false', 'Disable new test attempts', 'Disable new test attempts globally. Usually used when there is a problem with tests in general and you want some time to analyse without blocking the whole platform.', '', NULL, 1, 0),
(231, 1, NULL, 'show_question_id', NULL, NULL, 'exercise', 'false', 'Show question IDs in tests', 'Show questions\' internal IDs to let users take note of issues on specific questions and report them more efficiently.', '', NULL, 1, 0),
(232, 1, NULL, 'show_question_pagination', NULL, NULL, 'exercise', '100', 'Show question pagination for teachers', 'For tests with many questions, use pagination if the number of questions is higher than this setting. Set to 0 to prevent using pagination.', '', NULL, 1, 0),
(233, 1, NULL, 'question_pagination_length', NULL, NULL, 'exercise', '20', 'Question pagination length for teachers', 'Number of questions to show on every page when using the question pagination for teachers option.', '', NULL, 1, 0),
(234, 1, NULL, 'limit_exercise_teacher_access', NULL, NULL, 'exercise', 'false', 'Limit teachers\' permissions over tests', 'When enabled, teachers cannot delete tests nor questions, change tests visibility, download to QTI, clean results, etc.', '', NULL, 1, 0),
(235, 1, NULL, 'block_category_questions', NULL, NULL, 'exercise', 'false', 'Lock questions of previous categories in a test', 'When using this option, an additional option will appear in the test\'s configuration. When using a test with multiple question categories and asking for a distribution by category, this will allow the user to navigate questions per category. Once a category is finished, (s)he moves to the next category and cannot return to the previous category.', '', NULL, 1, 0),
(236, 1, NULL, 'exercise_score_format', NULL, NULL, 'exercise', '0', 'Tests score format', 'Select between the following forms for the display of users\' score in various reports: 1 = SCORE_AVERAGE (5 / 10); 2 = SCORE_PERCENT (50%); 3 = SCORE_DIV_PERCENT (5 / 10 (50%)). Use the numerical ID of the form you want to use.', '', NULL, 1, 0),
(237, 1, 32, 'exercise_additional_teacher_modify_actions', NULL, NULL, 'exercise', '', 'Additional links for teachers in tests list', 'Configure callback elements to generate new action icons for teachers to the right side of the tests list, in the form of an array, e.g. [\'myplugin\' => [\'MyPlugin\', \'urlGeneratorCallback\']]', '', NULL, 1, 0),
(238, 1, NULL, 'quiz_confirm_saved_answers', NULL, NULL, 'exercise', 'false', 'Add checkbox for answers count confirmation', 'This option adds a checkbox at the end of each test asking the user to confirm the number of answers saved. This provides better auditing data for critical tests.', '', NULL, 1, 0),
(239, 1, NULL, 'allow_exercise_categories', NULL, NULL, 'exercise', 'false', 'Enable test categories', 'Test categories are not enabled by default because they add a level of complexity. Enable this feature to show all test categories related management icons appear.', '', NULL, 1, 0),
(240, 1, NULL, 'allow_quiz_results_page_config', NULL, NULL, 'exercise', 'false', 'Enable test results page configuration', 'Define an array of settings you want to apply to all tests results pages. Settings can be \'hide_question_score\', \'hide_expected_answer\', \'hide_category_table\', \'hide_correct_answered_questions\', \'hide_total_score\' and possibly more in the future. Look for ‘getPageConfigurationAttribute’ in the code to see what’s in use.', '', NULL, 1, 0),
(241, 1, 33, 'quiz_image_zoom', NULL, NULL, 'exercise', '', 'Enable test images zooming', 'Enable this feature to allow users to zoom on images used in the tests.', '', NULL, 1, 0),
(242, 1, NULL, 'quiz_answer_extra_recording', NULL, NULL, 'exercise', 'false', 'Enable extra test answers recording', 'Enable recording of all answers (even temporary) in the track_e_attempt_recording table. This feautre is experimentaland can create issues in the reporting pages when attempting to grade a test.', '', NULL, 1, 0),
(243, 1, NULL, 'allow_mandatory_question_in_category', NULL, NULL, 'exercise', 'false', 'Enable selecting mandatory questions', 'Enable the selection of mandatory questions in a test when using random categories.', '', NULL, 1, 0),
(244, 1, 34, 'add_exercise_best_attempt_in_report', NULL, NULL, 'exercise', '', 'Enable display of best score attempt', 'Provide a list of courses and tests\' IDs that will show the best score attempt for any learner in the reports. ', '', NULL, 1, 0),
(245, 1, 35, 'exercise_category_report_user_extra_fields', NULL, NULL, 'exercise', '', 'Add user extra fields in exercise category report', 'Define an array with the list of user extra fields to add to the report.', '', NULL, 1, 0),
(246, 1, 36, 'score_grade_model', NULL, NULL, 'exercise', '', 'Score grades model', 'Define an array of score ranges and colors to display reports using this model. This allows you to show colors rather than numerical grades.', '', NULL, 1, 0),
(247, 1, NULL, 'allow_time_per_question', NULL, NULL, 'exercise', 'false', 'Enable time per question in tests', 'By default, it is only possible to limit the time per test. Limiting it per question adds an extra layer of possibilities, and you can (carefully) combine both.', '', NULL, 1, 0),
(248, 1, NULL, 'my_courses_show_pending_exercise_attempts', NULL, NULL, 'exercise', 'false', 'Global pending tests list', 'Enable to display to the final user a page with the list of pending tests across all courses.', '', NULL, 1, 0),
(249, 1, NULL, 'allow_quick_question_description_popup', NULL, NULL, 'exercise', 'false', 'Quick image addition to question', 'Enable an additional icon in the test questions list to add an image as question description. This vastly accelerates question edition when the questions are in the title and the description only includes an image.', '', NULL, 1, 0),
(250, 1, NULL, 'exercise_hide_ip', NULL, NULL, 'exercise', 'false', 'Hide user IP from test reports', 'By default, we show user information and its IP address, but this might be considered personal data, so this option allows you to remove this info from all test reports.', '', NULL, 1, 0),
(251, 1, NULL, 'tracking_my_progress_show_deleted_exercises', NULL, NULL, 'exercise', 'false', 'Show deleted tests in \'My progress\'', 'Enable this option to display, on the \'My progress\' page, the results of all tests you have taken, even the ones that have been deleted.', '', NULL, 1, 0),
(252, 1, NULL, 'show_exercise_attempts_in_all_user_sessions', NULL, NULL, 'exercise', 'false', 'Show test attempts from all sessions in pending tests report', 'Show test attempts from users in all sessions where the general coach has access in pending tests report.', '', NULL, 1, 0),
(253, 1, NULL, 'show_exercise_session_attempts_in_base_course', NULL, NULL, 'exercise', 'false', 'Show test attempts from all sessions in base course', 'Show test attempts from users in all sessions to the teacher in the base course.', '', NULL, 1, 0),
(254, 1, NULL, 'quiz_check_all_answers_before_end_test', NULL, NULL, 'exercise', 'false', 'Check all answers before submitting test', 'Display a popup with the list of answered/unanswered questions before submitting the test.', '', NULL, 1, 0),
(255, 1, NULL, 'quiz_discard_orphan_in_course_export', NULL, NULL, 'exercise', 'false', 'Discard orphan questions in course export', 'When exporting a course, do not export the questions that are not part of any test.', '', NULL, 1, 0),
(256, 1, NULL, 'exercise_result_end_text_html_strict_filtering', NULL, NULL, 'exercise', 'false', 'Bypass HTML filtering in test end messages', 'Consider messages at the end of tests are always safe. Removing the filter makes it possible to use JavaScript there.', '', NULL, 1, 0),
(257, 1, NULL, 'question_exercise_html_strict_filtering', NULL, NULL, 'exercise', 'false', 'Bypass HTML filtering in test questions', 'Consider questions text in tests are always safe. Removing the filter makes it possible to use JavaScript there.', '', NULL, 1, 0),
(258, 1, NULL, 'quiz_question_delete_automatically_when_deleting_exercise', NULL, NULL, 'exercise', 'false', 'Automatically delete questions when deleting test', 'The default behaviour is to make questions orphan when the only test using them is deleted. When enabled, this option ensure that all questions that would otherwise end up orphan are deleted as well.', '', NULL, 1, 0),
(259, 1, NULL, 'quiz_hide_attempts_table_on_start_page', NULL, NULL, 'exercise', 'false', 'Hide test attempts table on test start page', 'Hide the table showing all previous attempts on the test start page.', '', NULL, 1, 0),
(260, 1, NULL, 'quiz_hide_question_number', NULL, NULL, 'exercise', 'false', 'Hide question number', 'Hide the question incremental numbering when taking a test.', '', NULL, 1, 0),
(261, 1, NULL, 'quiz_keep_alive_ping_interval', NULL, NULL, 'exercise', '0', 'Keep session active in tests', 'Keep session active by maintaining a regular ping signal to the server every x seconds, define here. We recommend once every 300 seconds.', '', NULL, 1, 0),
(262, 1, 37, 'exercise_embeddable_extra_types', NULL, NULL, 'exercise', '', 'Embeddable question types', 'By default, only single answer and multiple answer questions are considered when deciding whether a test can be embedded in a video or not. With this option, you can decide that more question types are available. Be aware that not all question types fit nicely in the space assigned to videos. Questions types are availalble in the code in question.class.php.', '', NULL, 1, 0),
(263, 1, NULL, 'default_forum_view', NULL, NULL, 'forum', 'flat', 'Default forum view', 'What should be the default option when creating a new forum. Any trainer can however choose a different view for every individual forum', '', NULL, 1, 0),
(264, 1, NULL, 'display_groups_forum_in_general_tool', NULL, NULL, 'forum', 'true', 'Display group forums in general forum', 'Display group forums in the forum tool at the course level. This option is enabled by default (in this case, group forum individual visibilities still act as an additional criteria). If disabled, group forums will only be visible through the group tool, be them public or not.', '', NULL, 1, 0),
(265, 1, NULL, 'global_forums_course_id', NULL, NULL, 'forum', '0', 'Use course as global forum', 'Set the course ID (numerical) of a course reserverd to use as a global forum. This replaces the \'Social groups\' link in the social network by a link to the forum of that course.', '', NULL, 1, 0),
(266, 1, NULL, 'hide_forum_post_revision_language', NULL, NULL, 'forum', 'false', 'Hide forum post review language', 'Hide the possibility to assign a language to a forum post review.', '', NULL, 1, 0),
(267, 1, NULL, 'allow_forum_post_revisions', NULL, NULL, 'forum', 'false', 'Forum post review', 'Enable this option to allow asking for a review or a translation to one\'s post in a forum. When extensively configured, can be used to collaborate with other users in a language-learning forum.', '', NULL, 1, 0),
(268, 1, NULL, 'forum_fold_categories', NULL, NULL, 'forum', 'false', 'Fold forum categories', 'Visual effect to enable forum categories folding/unfolding.', '', NULL, 1, 0),
(269, 1, NULL, 'allow_forum_category_language_filter', NULL, NULL, 'forum', 'false', 'Forum categories language filter', 'Add a language filter to the forum view to only see categries configured in a specific language. Requires using the \'language\' extra field on the \'forum_category\' entity.', '', NULL, 1, 0),
(270, 1, NULL, 'subscribe_users_to_forum_notifications_also_in_base_course', NULL, NULL, 'forum', 'false', 'Forum notifications from base course as well', 'Enable this option to enable notifications coming from the base course forum, even if following the course through a session.', '', NULL, 1, 0),
(271, 1, 1, 'community_managers_user_list', NULL, NULL, 'forum', '', 'Community managers list', 'Provide an array of user IDs that will be considered community managers in the special course designated as global forum. Community managers have additional privileges on the global forum.', '', NULL, 1, 0),
(272, 1, NULL, 'show_glossary_in_extra_tools', NULL, NULL, 'glossary', '', 'Show the glossary terms in extra tools', 'From here you can configure how to add the glossary terms in extra tools as learning path and exercice tool', '', NULL, 1, 0),
(273, 1, NULL, 'default_glossary_view', NULL, NULL, 'glossary', 'table', 'Default glossary view', 'Choose which view (\'table\' or \'list\') will be used by default in the glossary tool.', '', NULL, 1, 0),
(274, 1, NULL, 'allow_remove_tags_in_glossary_export', NULL, NULL, 'glossary', 'false', 'Remove HTML tags in glossary export', '', '', NULL, 1, 0),
(275, 1, NULL, 'gradebook_enable', NULL, NULL, 'gradebook', 'true', 'Assessments tool activation', 'The Assessments tool allows you to assess competences in your organization by merging classroom and online activities evaluations into Performance reports. Do you want to activate it?', '', NULL, 1, 0),
(276, 1, NULL, 'gradebook_score_display_custom', NULL, NULL, 'gradebook', 'false', 'Competence levels labelling', 'Tick the box to enable Competence levels labelling', '', NULL, 1, 0),
(277, 1, NULL, 'gradebook_score_display_colorsplit', NULL, NULL, 'gradebook', '50', 'Threshold', 'The threshold (in %) under which scores will be colored red', '', NULL, 1, 0),
(278, 1, NULL, 'gradebook_score_display_upperlimit', NULL, NULL, 'gradebook', 'false', 'Display score upper limit', 'Tick the box to show the score\'s upper limit', '', NULL, 1, 0),
(279, 1, NULL, 'gradebook_number_decimals', NULL, NULL, 'gradebook', '0', 'Number of decimals', 'Allows you to set the number of decimals allowed in a score', '', NULL, 1, 0),
(280, 1, NULL, 'teachers_can_change_score_settings', NULL, NULL, 'gradebook', 'true', 'Teachers can change the Gradebook score settings', 'When editing the Gradebook settings', '', NULL, 1, 0),
(281, 1, NULL, 'teachers_can_change_grade_model_settings', NULL, NULL, 'gradebook', 'true', 'Teachers can change the Gradebook model settings', 'When editing a Gradebook', '', NULL, 1, 0),
(282, 1, NULL, 'gradebook_enable_grade_model', NULL, NULL, 'gradebook', 'false', 'Enable Gradebook model', 'Enables the auto creation of gradebook categories inside a course depending of the gradebook models.', '', NULL, 1, 0),
(283, 1, NULL, 'gradebook_default_weight', NULL, NULL, 'gradebook', '100', 'Default weight in Gradebook', 'This weight will be use in all courses by default', '', NULL, 1, 0),
(284, 1, NULL, 'gradebook_locking_enabled', NULL, NULL, 'gradebook', 'false', 'Enable locking of assessments by teachers', 'Once enabled, this option will enable locking of any assessment by the teachers of the corresponding course. This, in turn, will prevent any modification of results by the teacher inside the resources used in the assessment: exams, learning paths, tasks, etc. The only role authorized to unlock a locked assessment is the administrator. The teacher will be informed of this possibility. The locking and unlocking of gradebooks will be registered in the system\'s report of important activities', '', NULL, 1, 0),
(285, 1, NULL, 'gradebook_default_grade_model_id', NULL, NULL, 'gradebook', '', 'Default grade model', 'This value will be selected by default when creating a course', '', NULL, 1, 0),
(286, 1, NULL, 'my_display_coloring', NULL, NULL, 'gradebook', 'false', 'Display colors for scores in the gradebook', 'Enables color coding for better score visibility in the gradebook.', '', NULL, 1, 0),
(287, 1, NULL, 'student_publication_to_take_in_gradebook', NULL, NULL, 'gradebook', 'first', 'Assignment considered for gradebook', 'In the assignments tool, students can upload more than one file. In case there is more than one for a single assignment, which one should be considered when ranking them in the gradebook? This depends on your methodology. Use \'first\' to put the accent on attention to detail (like handling in time and handling the right work first). Use \'last\' to highlight collaborative and adaptative work.', '', NULL, 1, 0),
(288, 1, NULL, 'gradebook_detailed_admin_view', NULL, NULL, 'gradebook', 'false', 'Show additional columns in gradebook', 'Show additional columns in the student view of the gradebook with the best score of all students, the relative position of the student looking at the report and the average score of the whole group of students.', '', NULL, 1, 0),
(289, 1, NULL, 'gradebook_hide_graph', NULL, NULL, 'gradebook', 'false', 'Hide gradebook charts', 'If your portal is resources-limited, reducing the generation of the dynamic gradebok charts with potentially thousands of results is a good option.', '', NULL, 1, 0),
(290, 1, NULL, 'gradebook_hide_pdf_report_button', NULL, NULL, 'gradebook', 'false', 'Hide gradebook button \'download PDF report\'', '', '', NULL, 1, 0),
(291, 1, NULL, 'hide_gradebook_percentage_user_result', NULL, NULL, 'gradebook', 'true', 'Hide percentage in best/average gradebook results', '', '', NULL, 1, 0),
(292, 1, NULL, 'gradebook_use_exercise_score_settings_in_categories', NULL, NULL, 'gradebook', 'true', 'Use test settings for grades display', '', '', NULL, 1, 0),
(293, 1, NULL, 'gradebook_use_apcu_cache', NULL, NULL, 'gradebook', 'true', 'Use APCu caching to speed up gradebok', 'Improve speed when rendering gradebook student reports using Doctrine APCU cache. APCu is an optional but recommended PHP extension.', '', NULL, 1, 0),
(294, 1, NULL, 'gradebook_report_score_style', NULL, NULL, 'gradebook', '1', 'Gradebook reports score style', 'Add gradebook score style configuration in the flat view. See api.lib.php in order to find the options: examples SCORE_DIV = 1, SCORE_PERCENT = 2, etc', '', NULL, 1, 0),
(295, 1, NULL, 'gradebook_score_display_custom_standalone', NULL, NULL, 'gradebook', 'false', 'Custom score display in gradebook\'s standalone column', '', '', NULL, 1, 0),
(296, 1, NULL, 'gradebook_use_exercise_score_settings_in_total', NULL, NULL, 'gradebook', 'false', 'Use global score display setting in gradebook', '', '', NULL, 1, 0),
(297, 1, NULL, 'gradebook_dependency', NULL, NULL, 'gradebook', 'false', 'Inter-gradebook dependencies', 'Enables a mechanism of gradebook dependencies that lets people know which other items they need to go through first in order to complete the gradebook.', '', NULL, 1, 0),
(298, 1, 38, 'gradebook_dependency_mandatory_courses', NULL, NULL, 'gradebook', '', 'Mandatory courses for gradebook dependencies', 'When using inter-gradebook dependencies, you can choose a list of mandatory courses that will be required before approving any gradebook that has dependencies.', '', NULL, 1, 0),
(299, 1, 39, 'gradebook_badge_sidebar', NULL, NULL, 'gradebook', '', 'Gradebook badges sidebar', 'Generate a block inside the side menu where a few badges can be shown as pending approval. Requires gradebooks to be listed here, by (numerical) ID.', '', NULL, 1, 0),
(300, 1, NULL, 'gradebook_multiple_evaluation_attempts', NULL, NULL, 'gradebook', 'false', 'Allow multiple evaluation attempts in gradebook', '', '', NULL, 1, 0),
(301, 1, NULL, 'allow_gradebook_stats', NULL, NULL, 'gradebook', 'false', 'Cache results in the gradebook', 'Put some of the large calculations of averages in cached fields for the links and evaluations to increase speed (considerably). The potential negative impact is that it can take some time to refresh the gradebook results tables.', '', NULL, 1, 0),
(302, 1, 40, 'gradebook_flatview_extrafields_columns', NULL, NULL, 'gradebook', '', 'User extra fields in gradebook flat view', 'Add the given columns (\'variables\' array) to the main results table in the gradebook.', '', NULL, 1, 0),
(303, 1, 41, 'gradebook_pdf_export_settings', NULL, NULL, 'gradebook', '', 'Gradebook PDF export options', 'Change the PDF export for learners based on the provided settings (\'hide_score_weight\', \'hide_feedback_textarea\', ...)', '', NULL, 1, 0),
(304, 1, NULL, 'allow_gradebook_comments', NULL, NULL, 'gradebook', 'false', 'Gradebook comments', 'Enable gradebook comments so teachers can add a comment to the overall performance of the learner in this course. The comment will appear in the PDF export for the learner.', '', NULL, 1, 0),
(305, 1, 42, 'gradebook_display_extra_stats', NULL, NULL, 'gradebook', '', 'Gradebook extra statistics', 'Add additional columns to the gradebook\'s main report (1 = ranking, 2 = best score, 3 = average).', '', NULL, 1, 0),
(306, 1, NULL, 'gradebook_hide_table', NULL, NULL, 'gradebook', 'false', 'Hide gradebook table for learners', 'Reduce gradebook load time by hiding the results table (but still giving access to certificates, skills, etc).', '', NULL, 1, 0),
(307, 1, NULL, 'gradebook_hide_link_to_item_for_student', NULL, NULL, 'gradebook', 'false', 'Hide item links for learners in gradebook', 'Avoid learners clicking on items from the gradebook by removing the links on the items.', '', NULL, 1, 0),
(308, 1, NULL, 'gradebook_enable_subcategory_skills_independant_assignement', NULL, NULL, 'gradebook', 'false', 'Enable skills by gradebook\'s subcategory', 'Skills are normally attributed for completing a whole gradebook. By enabling this option, you allow skills to be attached to sub-sections of gradebooks.', '', NULL, 1, 0),
(309, 1, NULL, 'allow_group_categories', NULL, NULL, 'group', 'false', 'Group categories', 'Allow teachers to create categories in the Groups tool?', '', NULL, 1, 0),
(310, 1, NULL, 'hide_course_group_if_no_tools_available', NULL, NULL, 'group', 'false', 'Hide course group if no tool', 'If no tool is available in a group and the user is not registered to the group itself, hide the group completely in the groups list.', '', NULL, 1, 0),
(311, 1, NULL, 'show_groups_to_users', NULL, NULL, 'group', 'false', 'Show classes to users', 'Show the classes to users. Classes are a feature that allow you to register/unregister groups of users into a session or a course directly, reducing the administrative hassle. When you pick this option, learners will be able to see in which class they are through their social network interface.', '', NULL, 1, 0),
(312, 1, NULL, 'platform_language', NULL, NULL, 'language', 'en_US', 'Default platform language', 'Main language, used by default when no user language is set.', '', NULL, 1, 0),
(313, 1, NULL, 'allow_use_sub_language', NULL, NULL, 'language', 'false', 'Allow definition and use of sub-languages', 'By enabling this option, you will be able to define variations for each of the language terms used in the platform\'s interface, in the form of a new language based on and extending an existing language. You\'ll find this option in the languages section of the administration panel.', '', NULL, 1, 0),
(314, 1, NULL, 'auto_detect_language_custom_pages', NULL, NULL, 'language', 'true', 'Enable language auto-detect in custom pages', 'If you use custom pages, enable this if you want to have a language detector there present the page in the user\'s browser language, or disable to force the language to be the default platform language.', '', NULL, 1, 0),
(315, 1, NULL, 'show_different_course_language', NULL, NULL, 'language', 'true', 'Show course languages', 'Show the language each course is in, next to the course title, on the homepage courses list', '', NULL, 1, 0),
(316, 1, NULL, 'language_priority_1', NULL, NULL, 'language', 'course_lang', 'Highest priority language', 'Primary language selected when multiple language contexts are set.', '', NULL, 1, 0),
(317, 1, NULL, 'language_priority_2', NULL, NULL, 'language', 'user_profil_lang', 'Secondary priority language', 'Secondary fallback language if first priority is unavailable or out of context.', '', NULL, 1, 0),
(318, 1, NULL, 'language_priority_3', NULL, NULL, 'language', 'user_selected_lang', 'Third priority language', 'Tertiary language fallback if higher priorities fail.', '', NULL, 1, 0),
(319, 1, NULL, 'language_priority_4', NULL, NULL, 'language', 'platform_lang', 'Fourth priority language', 'Last language fallback option by order of priority.', '', NULL, 1, 0),
(320, 1, NULL, 'show_language_selector_in_menu', NULL, NULL, 'language', 'true', 'Language switcher in main menu', 'Display a language selector in the main menu that immediately updates the language preference of the user. This can be useful in multilingual portals where learners have to switch from one language to another for their learning.', '', NULL, 1, 0),
(321, 1, NULL, 'language_flags_by_country', NULL, NULL, 'language', 'false', 'Language flags', 'Use country flags for languages. This is not enabled by default because some languages are not strictly attached to a country, which can lead to frustration for some users.', '', NULL, 1, 0),
(322, 1, NULL, 'allow_course_multiple_languages', NULL, NULL, 'language', 'false', 'Multiple-language courses', 'Enable courses managed in more than one language. This option adds a language selector within the course page to let users switch easily, and adds a \'multiple_language\' extra field to courses which allows for remote management procedures.', '', NULL, 1, 0),
(323, 1, NULL, 'template_activate_language_filter', NULL, NULL, 'language', 'false', 'Multiple-language document templates', 'Enable document templates (at the platform or course level) to be configured for specific languages.', '', NULL, 1, 0),
(324, 1, NULL, 'show_invisible_exercise_in_lp_toc', NULL, NULL, 'lp', 'false', 'Invisible tests visible in learning paths', 'Make tests marked as \'invisible\' in the tests tool appear when they are included in a learning path.', '', NULL, 1, 0),
(325, 1, NULL, 'add_all_files_in_lp_export', NULL, NULL, 'lp', 'false', 'Export all files when exporting a learning path', 'When exporting a LP, all files and folders in the same path of an html will be exported too.', '', NULL, 1, 0),
(326, 1, NULL, 'show_prerequisite_as_blocked', NULL, NULL, 'lp', 'false', 'Learning path\'s prerequisites', 'On the learning paths lists, display a visual element to show that other learning paths are currently blocked by some prerequisites rule.', '', NULL, 1, 0),
(327, 1, NULL, 'hide_lp_time', NULL, NULL, 'lp', 'false', 'Hide time from learning paths records', 'Hide learning paths time spent in reports in general.', '', NULL, 1, 0),
(328, 1, NULL, 'lp_view_accordion', NULL, NULL, 'lp', 'false', 'Foldable learning paths\' items', '', '', NULL, 1, 0),
(329, 1, NULL, 'disable_js_in_lp_view', NULL, NULL, 'lp', 'false', 'Disable JS in learning paths view', 'Disable JS files that Chamilo usually adds to HTML files in the learning path (while displaying them).', '', NULL, 1, 0),
(330, 1, NULL, 'allow_teachers_to_access_blocked_lp_by_prerequisite', NULL, NULL, 'lp', 'false', 'Teachers can access blocked learning paths', 'Teachers do not need to pass complete learning paths to have access to a prerequisites-blocked learning path.', '', NULL, 1, 0),
(331, 1, NULL, 'allow_lp_chamilo_export', NULL, NULL, 'lp', 'false', 'Export learning paths in the Chamilo backup format', 'Enable the possibility to export any of your learning paths in a Chamilo course backup format.', '', NULL, 1, 0),
(332, 1, NULL, 'hide_accessibility_label_on_lp_item', NULL, NULL, 'lp', 'true', 'Hide requirements label in learning paths', 'Hide the pre-requisites tooltip on learning path items. This is mostly an estaethic choice.', '', NULL, 1, 0),
(333, 1, NULL, 'lp_minimum_time', NULL, NULL, 'lp', 'false', 'Minimum time to complete learning path', 'Add a minimum time field to learning paths. If the user has not spent that much time on the learning path, the last item of the learning path cannot be completed.', '', NULL, 1, 0),
(334, 1, NULL, 'validate_lp_prerequisite_from_other_session', NULL, NULL, 'lp', 'false', 'Use learning path item status from other sessions', 'Allow users to complete prerequisites in a learning path if the corresponding item was already completed in another session.', '', NULL, 1, 0),
(335, 1, NULL, 'show_hidden_exercise_added_to_lp', NULL, NULL, 'lp', 'true', 'Display tests from learning paths even if invisible', 'Show hidden exercises that were added to a LP in the exercise list. If we are in a session, the test is invisible in the base course, it is included in a LP and the setting to show it is not specifically set to true, then hide it.', '', NULL, 1, 0),
(336, 1, NULL, 'lp_menu_location', NULL, NULL, 'lp', 'left', 'Learning path menu location', 'Set this to \'left\' or \'right\' to change the side of the learning path menu.', '', NULL, 1, 0),
(337, 1, NULL, 'lp_score_as_progress_enable', NULL, NULL, 'lp', 'false', 'Use learning path score as progress', 'This is useful when using SCORM content with only one large SCO. SCORM does not communicate progress, so this is a trick to use the score as progress. Enabling this option will let you configure this on a per-learning path basis.', '', NULL, 1, 0),
(338, 1, NULL, 'lp_prevents_beforeunload', NULL, NULL, 'lp', 'false', 'Prevent beforeunload JS event in learning path', 'This helps with browser compatibility by preventing tricky JS events to execute.', '', NULL, 1, 0),
(339, 1, NULL, 'disable_my_lps_page', NULL, NULL, 'lp', 'false', 'Hide \'My learning paths\' page', 'The page \'My learning path\' was added in 1.11. Use this option to hide it.', '', NULL, 1, 0),
(340, 1, NULL, 'scorm_api_username_as_student_id', NULL, NULL, 'lp', 'false', 'Use username as student_id in SCORM communication', '', '', NULL, 1, 0),
(341, 1, NULL, 'scorm_api_extrafield_to_use_as_student_id', NULL, NULL, 'lp', '', 'Use extra field as student_id in SCORM communication', 'Give the name of the extra field to be used as student_id for all SCORM communication.', '', NULL, 1, 0),
(342, 1, NULL, 'allow_import_scorm_package_in_course_builder', NULL, NULL, 'lp', 'false', 'SCORM import within course import', 'Enable to copy the directory structure of SCORM packages when restoring a course (from the course maintenance tool).', '', NULL, 1, 0),
(343, 1, NULL, 'allow_htaccess_import_from_scorm', NULL, NULL, 'lp', 'false', 'Allow .htaccess from SCORM packages', 'Normally, all .htaccess files are filtered and removed when importing content in Chamilo. This feature allows .htaccess to be imported if it is present in a SCORM package.', '', NULL, 1, 0),
(344, 1, NULL, 'allow_session_lp_category', NULL, NULL, 'lp', 'false', 'Learning paths categories can be managed in sessions', '', '', NULL, 1, 0),
(345, 1, NULL, 'ticket_lp_quiz_info_add', NULL, NULL, 'lp', 'false', 'Add learning paths and tests info to ticket reporting', '', '', NULL, 1, 0),
(346, 1, 43, 'lp_subscription_settings', NULL, NULL, 'lp', '', 'Learning paths subscription settings', 'Configure additional options for the learning paths subscription feature. Options include \'allow_add_users_to_lp\' and \'allow_add_users_to_lp_category\'.', '', NULL, 1, 0),
(347, 1, 44, 'lp_view_settings', NULL, NULL, 'lp', '', 'Learning path display settings', 'Configure additional options for the learning paths display. Options include \'show_reporting_icon\', \'hide_lp_arrow_navigation\', \'show_toolbar_by_default\', \'navigation_in_the_middle\' and \'add_extra_quit_to_home_icon\'.', '', NULL, 1, 0),
(348, 1, 45, 'download_files_after_all_lp_finished', NULL, NULL, 'lp', '', 'Download button after finishing learning paths', 'Show download files button after finishing all LP. Example: if ABC is the course code, and 1 and 100 are the doc id, choose: [\'courses\' => [\'ABC\' => [1, 100]]].', '', NULL, 1, 0),
(349, 1, NULL, 'allow_lp_subscription_to_usergroups', NULL, NULL, 'lp', 'false', 'Learning paths subscription for classes', 'Enable subscription to learning paths and learning path categories to groups/classes.', '', NULL, 1, 0),
(350, 1, NULL, 'lp_fixed_encoding', NULL, NULL, 'lp', 'false', 'Fixed encoding in learning path', 'Reduce resource usage by ignoring a check on the text encoding in imported learning paths.', '', NULL, 1, 0),
(351, 1, NULL, 'lp_prerequisite_use_last_attempt_only', NULL, NULL, 'lp', 'false', 'Use last score in learning path test prerequisites', 'When a test is used as prerequisite for an item in the learning path, use the last attempt of the test only as validation for the prerequisite (default is to use best attempt).', '', NULL, 1, 0),
(352, 1, NULL, 'show_invisible_exercise_in_lp_list', NULL, NULL, 'lp', 'false', 'Display tests in list of learning path tests even if invisible', '', '', NULL, 1, 0),
(353, 1, NULL, 'force_edit_exercise_in_lp', NULL, NULL, 'lp', 'false', 'Edition of tests included in learning paths', 'Enable editing tests even if they have been included in a learning path. The default is to prevent edition if the test is in a learning path, because that can affect consistency of tracking among many learners if test modifications are significant.', '', NULL, 1, 0),
(354, 1, NULL, 'student_follow_page_add_LP_subscription_info', NULL, NULL, 'lp', 'false', 'Unlocked information in learning paths list', 'This adds an \'unlocked\' column in the learning paths list if the learner is subscribed to the given learning path and has access to it.', '', NULL, 1, 0),
(355, 1, NULL, 'lp_show_max_progress_instead_of_average', NULL, NULL, 'lp', 'false', 'Show max progress instead of average for learning paths reporting', '', '', NULL, 1, 0),
(356, 1, NULL, 'lp_show_max_progress_or_average_enable_course_level_redefinition', NULL, NULL, 'lp', 'false', 'Select max progress vs average for learning paths at course level', 'Enable redefinition of the setting to show the best progress instead of averages in reporting of learnpaths at a course level.', '', NULL, 1, 0),
(357, 1, NULL, 'lp_allow_export_to_students', NULL, NULL, 'lp', 'false', 'Learners can export learning paths', 'Enable this to allow learners to download the learning paths as SCORM packages.', '', NULL, 1, 0),
(358, 1, NULL, 'show_invisible_lp_in_course_home', NULL, NULL, 'lp', 'false', 'Display link to learning path on course home when invisible', 'If a learning path is set to invisible but the teacher/coach decided to make it available from the course homepage, this option prevents Chamilo from hiding the link on the course homepage.', '', NULL, 1, 0),
(359, 1, NULL, 'lp_start_and_end_date_visible_in_student_view', NULL, NULL, 'lp', 'false', 'Display learning path availability to learners', 'Show learning paths to learners with their availability dates, rather than hiding them until the date comes.', '', NULL, 1, 0),
(360, 1, NULL, 'scorm_lms_update_sco_status_all_time', NULL, NULL, 'lp', 'false', 'Update SCO status autonomously', 'If the SCO is not sending a status, take over and update the status based on what can be observed in Chamilo.', '', NULL, 1, 0),
(361, 1, NULL, 'scorm_upload_from_cache', NULL, NULL, 'lp', 'false', 'Upload SCORM from cache dir', 'Allow admins to upload a SCORM package (in zip form) into the cache directory and to use it as import source on the SCORM upload page.', '', NULL, 1, 0),
(362, 1, NULL, 'lp_prerequisite_on_quiz_unblock_if_max_attempt_reached', NULL, NULL, 'lp', 'false', 'Unlock prerequisites after last test attempt', 'Allows users to continue in a learning path after using all quiz attempts of a test used as prerequisite for other items.', '', NULL, 1, 0),
(363, 1, NULL, 'student_follow_page_hide_lp_tests_average', NULL, NULL, 'lp', 'false', 'Hide percentage sign in average of tests in learning paths in learner follow-up', 'Hides the icon of percentage in \'Average of tests in Learning Paths\' indication on a student tracking', '', NULL, 1, 0),
(364, 1, NULL, 'student_follow_page_add_lp_acquisition_info', NULL, NULL, 'lp', 'false', 'Add acquisition column in learner follow-up', 'Add column to learner follow-up page to show acquisition status by a learner on a learning path.', '', NULL, 1, 0),
(365, 1, NULL, 'student_follow_page_add_lp_invisible_checkbox', NULL, NULL, 'lp', 'false', 'Add visibility information for learning paths on learner follow-up page', '', '', NULL, 1, 0),
(366, 1, NULL, 'student_follow_page_include_not_subscribed_lp_students', NULL, NULL, 'lp', 'false', 'Include learning paths not subscribed to on learner follow-up page', '', '', NULL, 1, 0),
(367, 1, NULL, 'lp_enable_flow', NULL, NULL, 'lp', 'false', 'Navigate between learning paths', 'Add the possibility to select a \'next\' learning path and show buttons inside the learning path to move from one to the next.', '', NULL, 1, 0),
(368, 1, NULL, 'lp_item_prerequisite_dates', NULL, NULL, 'lp', 'false', 'Date-based learning path items prerequisites', 'Adds the option to define prerequisites with start and end dates for learnpath items.', '', NULL, 1, 0),
(369, 1, NULL, 'allow_lp_return_link', NULL, NULL, 'lp', 'true', 'Show learning paths return link', 'Disable this option to hide the \'Return to homepage\' button in the learning paths', '', NULL, 1, 0),
(370, 1, NULL, 'hide_scorm_export_link', NULL, NULL, 'lp', 'false', 'Hide SCORM Export', 'Hide the SCORM Export icon from the Learning Paths list', '', NULL, 1, 0),
(371, 1, NULL, 'hide_scorm_copy_link', NULL, NULL, 'lp', 'false', 'Hide SCORM Copy', 'Hide the Learning Path Copy icon from the Learning Paths list', '', NULL, 1, 0),
(372, 1, NULL, 'hide_scorm_pdf_link', NULL, NULL, 'lp', 'true', 'Hide Learning Path PDF export', 'Hide the Learning Path PDF Export icon from the Learning Paths list', '', NULL, 1, 0),
(373, 1, NULL, 'lp_show_reduced_report', NULL, NULL, 'lp', 'false', 'Learning paths: show reduced report', 'Inside the learning paths tool, when a user reviews his own progress (through the stats icon), show a shorten (less detailed) version of the progress report.', '', NULL, 1, 0),
(374, 1, NULL, 'update_users_email_to_dummy_except_admins', NULL, NULL, 'mail', 'false', 'Update users e-mail to dummy value during imports', 'During special CSV cron imports of users, automatically replace e-mails with dummy e-mail username@example.com.', '', NULL, 1, 0),
(375, 1, NULL, 'mail_header_style', NULL, NULL, 'mail', '', 'Extra e-mail HTML header attributes', '', '', NULL, 1, 0),
(376, 1, NULL, 'mail_content_style', NULL, NULL, 'mail', '', 'Extra e-mail HTML body attributes', '', '', NULL, 1, 0);
INSERT INTO `settings` (`id`, `access_url`, `value_template_id`, `variable`, `subkey`, `type`, `category`, `selected_value`, `title`, `comment`, `scope`, `subkeytext`, `access_url_changeable`, `access_url_locked`) VALUES
(377, 1, NULL, 'allow_email_editor_for_anonymous', NULL, NULL, 'mail', 'true', 'E-mail editor for anonymous', 'Allow anonymous users to send e-mails from the platform. In this day and age of information security this is not a recommended option.', '', NULL, 1, 0),
(378, 1, NULL, 'messages_hide_mail_content', NULL, NULL, 'mail', 'false', 'Hide e-mail content to bring users to platform', 'Prefer short e-mail versions with a link to the messaging space on the platform to increase platform-based engagement.', '', NULL, 1, 0),
(379, 1, NULL, 'send_two_inscription_confirmation_mail', NULL, NULL, 'mail', 'false', 'Send 2 registration e-mails', 'Send two separate e-mails on registration. One for the username, another one for the password.', '', NULL, 1, 0),
(380, 1, NULL, 'show_user_email_in_notification', NULL, NULL, 'mail', 'false', 'Show sender\'s e-mail address in notifications', '', '', NULL, 1, 0),
(381, 1, NULL, 'send_notification_score_in_percentage', NULL, NULL, 'mail', 'false', 'Send score in percentage in test results notification', '', '', NULL, 1, 0),
(382, 1, 46, 'cron_notification_help_desk', NULL, NULL, 'mail', '', 'E-mail addresses to send cronjobs execution reports', 'Given as array of e-mail addresses. Does not work for all cronjobs yet.', '', NULL, 1, 0),
(383, 1, 47, 'notifications_extended_footer_message', NULL, NULL, 'mail', '', 'Extended notifications footer', 'Add a custom extra footer for notifications emails for a specific language, for example for privacy policy notices. Multiple languages and paragraphs can be added.', '', NULL, 1, 0),
(384, 1, NULL, 'mailer_from_name', NULL, NULL, 'mail', '', 'Send all e-mails as originating from this (organizational) name', 'Sets the default display name used for sending platform emails. e.g. \"Support team\".', '', NULL, 1, 0),
(385, 1, NULL, 'mailer_from_email', NULL, NULL, 'mail', 'admin@bro-world.de', 'Send all e-mails from this e-mail address', 'Sets the default email address used in the \"from\" field of emails.', '', NULL, 1, 0),
(386, 1, NULL, 'mailer_dsn', NULL, NULL, 'mail', 'smtp://admin@bro-world.de:19891989aAaAaAa@smtp.strato.de:587?encryption=tls', 'Mail DSN', 'The DSN fully includes all parameters needed to connect to the mail service. You can learn more at https://symfony.com/doc/6.4/mailer.html#using-built-in-transports. Here are a few examples of supported DSN syntaxes: https://symfony.com/doc/6.4/mailer.html#using-a-3rd-party-transport', '', NULL, 1, 0),
(387, 1, NULL, 'mailer_mails_charset', NULL, NULL, 'mail', 'UTF-8', 'Mail: character set', 'In case you need to define the charset to use when sending those e-mails. Leave empty if you\'re not sure.', '', NULL, 1, 0),
(388, 1, NULL, 'mailer_debug_enable', NULL, NULL, 'mail', 'false', 'Mail: Debug', 'Select whether you want to enable the e-mail sending debug logs. These will give you more information on what is happening when connecting to the mail service, but are not elegant and might break page design. Only use when there is not user activity.', '', NULL, 1, 0),
(389, 1, NULL, 'mailer_exclude_json', NULL, NULL, 'mail', 'false', 'Mail: Avoid using LD+JSON', 'Some e-mail clients do not understand the descriptive LD+JSON format, showing it as a loose JSON string to the final user. If this is your case, you might want to set the variable below to \'false\' to disable this header.', '', NULL, 1, 0),
(390, 1, 48, 'mailer_dkim', NULL, NULL, 'mail', '', 'Mail: DKIM headers', 'Enter a JSON array of your DKIM configuration settings (see example).', '', NULL, 1, 0),
(391, 1, 49, 'mailer_xoauth2', NULL, NULL, 'mail', '', 'Mail: XOAuth2 options', 'If you use some XOAuth2-based e-mail service, use this setting in JSON to save your specific configuration (see example) and select XOAuth2 in the mail service setting.', '', NULL, 1, 0),
(392, 1, NULL, 'allow_message_tool', NULL, NULL, 'message', 'true', 'Internal messaging tool', 'Enabling the internal messaging tool allows users to send messages to other users of the platform and to have a messaging inbox.', '', NULL, 1, 0),
(393, 1, NULL, 'allow_send_message_to_all_platform_users', NULL, NULL, 'message', 'false', 'Allow sending messages to any platform user', 'Allows you to send messages to any user of the platform, not just your friends or the people currently online.', '', NULL, 1, 0),
(394, 1, NULL, 'message_max_upload_filesize', NULL, NULL, 'message', '20971520', 'Max upload file size in messages', 'Maximum size for file uploads in the messaging tool (in Bytes)', '', NULL, 1, 0),
(395, 1, NULL, 'private_messages_about_user', NULL, NULL, 'message', 'false', 'Allow private messages between teachers about a learner', 'Allow exchange of messages from teachers/bosses about a user from the tracking page of that user.', '', NULL, 1, 0),
(396, 1, NULL, 'private_messages_about_user_visible_to_user', NULL, NULL, 'message', 'false', 'Allow learners to see messages about them between teachers', 'If exchange of messages about a user are enabled, this option will allow the corresponding user to see the messages. This is to comply with rules of transparency the organization may need to comply to.', '', NULL, 1, 0),
(397, 1, NULL, 'allow_user_message_tracking', NULL, NULL, 'message', 'false', 'Admins can see personal messages', 'Allow administrators to see personal messages between a teacher and a learner. Please make sure you include a note in your terms and conditions as this might affect privacy protection.', '', NULL, 1, 0),
(398, 1, NULL, 'filter_interactivity_messages', NULL, NULL, 'message', 'false', 'Teachers can access learners messages only within session timeframe', 'Filter messages between a teacher and a learner between the session start end dates', '', NULL, 1, 0),
(399, 1, NULL, 'institution', NULL, NULL, 'platform', 'Bro World', 'Organization name', 'The name of the organization (appears in the header on the right)', '', NULL, 1, 0),
(400, 1, NULL, 'institution_url', NULL, NULL, 'platform', 'https://bro-world-space.com/', 'Organization URL (web address)', 'The URL of the institutions (the link that appears in the header on the right)', '', NULL, 1, 0),
(401, 1, NULL, 'institution_address', NULL, NULL, 'platform', '', 'Institution address', 'Address', '', NULL, 1, 0),
(402, 1, NULL, 'site_name', NULL, NULL, 'platform', 'Bro World', 'E-learning portal name', 'The Name of your Chamilo Portal (appears in the header)', '', NULL, 1, 0),
(403, 1, NULL, 'timezone', NULL, NULL, 'platform', 'Europe/Paris', 'Default timezone', 'Select the default timezone for this portal. This will help set the timezone (if the feature is enabled) for each new user or for any user that has not set a specific timezone yet. Timezones help show all time-related information on screen in the specific timezone of each user.', '', NULL, 1, 0),
(404, 1, NULL, 'cookie_warning', NULL, NULL, 'platform', 'false', 'Cookie privacy notification', 'If enabled, this option shows a banner on top of your platform that asks users to acknowledge that the platform is using cookies necessary to provide the user experience. The banner can easily be acknowledged and hidden by the user. This allows Chamilo to comply with EU web cookies regulations.', '', NULL, 1, 0),
(405, 1, NULL, 'donotlistcampus', NULL, NULL, 'platform', 'false', 'Do not list this campus on chamilo.org', 'By default, Chamilo portals are automatically registered in a public list at chamilo.org, just using the title you gave to this portal (not the URL nor any private data). Check this box to avoid having the title of your portal appear.', '', NULL, 1, 0),
(406, 1, NULL, 'use_custom_pages', NULL, NULL, 'platform', 'false', 'Use custom pages', 'Enable this feature to configure specific login pages by role', '', NULL, 1, 0),
(407, 1, NULL, 'allow_my_files', NULL, NULL, 'platform', 'true', 'Enable \'My Files\' section', 'Allow users to upload files to a personal space on the platform.', '', NULL, 1, 0),
(408, 1, NULL, 'registered', NULL, NULL, 'platform', 'false', 'registered', NULL, '', NULL, 1, 0),
(409, 1, NULL, 'server_type', NULL, NULL, 'platform', 'prod', 'Server Type', 'Defines the environment type: \"prod\" (normal production), \"validation\" (like production but without reporting statistics), or \"test\" (debug mode with developer tools such as untranslated string indicators).', '', NULL, 1, 0),
(410, 1, NULL, 'chamilo_database_version', NULL, NULL, 'platform', '2.0.0', 'Current version of the database schema used by Chamilo', 'Displays the current DB version to match the Chamilo core version.', '', NULL, 1, 1),
(411, 1, NULL, 'unoconv_binaries', NULL, NULL, 'platform', '/usr/bin/unoconv', 'UNO converter binaries', 'Give the system path to the UNO converter library to enable some extra exporting features.', '', NULL, 1, 0),
(412, 1, NULL, 'pdf_img_dpi', NULL, NULL, 'platform', '96', 'PDF export resolution', 'This represents the resolution of generated PDF files (in dot per inch, or dpi). The default is 96. Increasing it will give you better resolution PDF files but will also increase the weight and generation time of the files.', '', NULL, 1, 0),
(413, 1, NULL, 'hosting_limit_users_per_course', NULL, NULL, 'platform', '0', 'Global limit of users per course', 'Defines a global maximum number of users (teachers included) allowed to be subscribed to any single course in the platform. Set this value to 0 to disable the limit. This helps avoid courses being overloaded in open portals.', '', NULL, 1, 0),
(414, 1, NULL, 'generate_random_login', NULL, NULL, 'platform', 'false', 'Generate random username', 'When importing users (batch processes), automatically generate a random string for username. Otherwise, the username will be generated on the basis of the firstname and lastname, or the prefix of the e-mail.', '', NULL, 1, 0),
(415, 1, NULL, 'timepicker_increment', NULL, NULL, 'platform', '5', 'Timepicker increment', 'Minimal time increment (in minutes) when selecting a date and time with the timepicker widget. For example, it might not be useful to have less than 5 or 15 minutes increments when talking about assignment submission, availability of a test, start time of a session, etc.', '', NULL, 1, 0),
(416, 1, NULL, 'user_status_show_options_enabled', NULL, NULL, 'platform', 'false', 'Selective display of roles', 'Enable to use an array to define which roles should be clearly displayed and which should be hidden.', '', NULL, 1, 0),
(417, 1, 9, 'user_status_show_option', NULL, NULL, 'platform', '', 'Roles display options', 'An array of role => true/false that defines whether that role should be shown or hidden.', '', NULL, 1, 0),
(418, 1, NULL, 'platform_logo_url', NULL, NULL, 'platform', 'https://chamilo.org', 'URL for alternative platform logo', 'Replaces the Chamilo logo by loading a (possibly remote) URL. Make sure this is allowed by your security policies.', '', NULL, 1, 0),
(419, 1, NULL, 'use_career_external_id_as_identifier_in_diagrams', NULL, NULL, 'platform', 'false', 'Use external career ID in diagrams', 'If using career diagrams, show an extra field instead of the internal career ID.', '', NULL, 1, 0),
(420, 1, NULL, 'portfolio_advanced_sharing', NULL, NULL, 'platform', 'false', 'Enable portfolio advanced sharing', 'Decide who can view the posts and comments of the portfolio.', '', NULL, 1, 0),
(421, 1, NULL, 'portfolio_show_base_course_post_in_sessions', NULL, NULL, 'platform', 'false', 'Show base course posts in session course', 'Decide who can view the posts and comments of the portfolio.', '', NULL, 1, 0),
(422, 1, NULL, 'notification_event', NULL, NULL, 'platform', 'false', 'Enable the notification tool for a more impactful communication channel with students', 'Activates popup or system notifications for important platform events.', '', NULL, 1, 0),
(423, 1, 8, 'push_notification_settings', NULL, NULL, 'platform', '', 'Push notification settings (JSON)', 'JSON configuration for Push notifications integration.', '', NULL, 1, 0),
(424, 1, NULL, 'hosting_limit_identical_email', NULL, NULL, 'platform', '0', 'Limit identical email usage', 'Maximum number of accounts allowed to share the same e-mail address. Set to 0 to disable this limit.', '', NULL, 1, 0),
(425, 1, NULL, 'session_admin_access_to_all_users_on_all_urls', NULL, NULL, 'platform', 'false', 'Allow session admins to see all users on all URLs', 'If enabled, session admins can search and list users from all access URLs, regardless of their current URL.', '', NULL, 1, 0),
(426, 1, NULL, 'use_virtual_keyboard', NULL, NULL, 'platform', 'false', 'Use virtual keyboard', 'Make a virtual keyboard appear. This is useful when setting up restrictive exams in a physical room where students have no keyboard to limit their ability to cheat.', '', NULL, 1, 0),
(427, 1, NULL, 'disable_copy_paste', NULL, NULL, 'platform', 'false', 'Disable copy-pasting', 'When enabled, this option disables as well as possible the copy-pasting mechanisms. Useful in restrictive exams setups.', '', NULL, 1, 0),
(428, 1, NULL, 'changeable_options', NULL, NULL, 'profile', 'name,officialcode,email,picture,login,password,language,phone,theme', 'Fields users are allowed to change in their profile', 'Select the fields users will be able to change on their profile page.', '', NULL, 1, 0),
(429, 1, NULL, 'extended_profile', NULL, NULL, 'profile', 'false', 'Portfolio', 'If this setting is on, a user can fill in the following (optional) fields: \'My personal open area\', \'My competences\', \'My diplomas\', \'What I am able to teach\'', '', NULL, 1, 0),
(430, 1, NULL, 'account_valid_duration', NULL, NULL, 'profile', '3660', 'Account validity', 'A user account is valid for this number of days after creation', '', NULL, 1, 1),
(431, 1, NULL, 'split_users_upload_directory', NULL, NULL, 'profile', 'true', 'Split users\' upload directory', 'On high-load portals, where a lot of users are registered and send their pictures, the upload directory (main/upload/users/) might contain too many files for the filesystem to handle (it has been reported with more than 36000 files on a Debian server). Changing this option will enable a one-level splitting of the directories in the upload directory. 9 directories will be used in the base directory and all subsequent users\' directories will be stored into one of these 9 directories. The change of this option will not affect the directories structure on disk, but will affect the behaviour of the Chamilo code, so if you change this option, you have to create the new directories and move the existing directories by yourself on te server. Be aware that when creating and moving those directories, you will have to move the directories of users 1 to 9 into subdirectories of the same name. If you are not sure about this option, it is best not to activate it.', '', NULL, 1, 1),
(432, 1, NULL, 'user_selected_theme', NULL, NULL, 'profile', 'false', 'User theme selection', 'Allow users to select their own visual theme in their profile. This will change the look of Chamilo for them, but will leave the default style of the portal intact. If a specific course or session has a specific theme assigned, it will have priority over user-defined themes.', '', NULL, 1, 0),
(433, 1, NULL, 'use_users_timezone', NULL, NULL, 'profile', 'true', 'Enable users timezones', 'Enable the possibility for users to select their own timezone. Once configured, users will be able to see assignment deadlines and other time references in their own timezone, which will reduce errors at delivery time.', '', NULL, 1, 0),
(434, 1, NULL, 'allow_users_to_change_email_with_no_password', NULL, NULL, 'profile', 'false', 'Allow users to change e-mail without password', 'When changing the account information', '', NULL, 1, 0),
(435, 1, NULL, 'login_is_email', NULL, NULL, 'profile', 'false', 'Use the email as username', 'Use the email in order to login to the system', '', NULL, 1, 1),
(436, 1, NULL, 'enable_profile_user_address_geolocalization', NULL, NULL, 'profile', '', 'Enable user\'s geolocalization', 'Enable user\'s address field and show it on a map using geolocalization features', '', NULL, 1, 0),
(437, 1, NULL, 'allow_show_skype_account', NULL, NULL, 'profile', '', 'Allow show the user Skype account', 'Add a link on the user social block allowing start a chat by Skype', '', NULL, 1, 0),
(438, 1, NULL, 'allow_show_linkedin_url', NULL, NULL, 'profile', '', 'Allow show the user LinkedIn URL', 'Add a link on the user social block, allowing visit the user\'s LinkedIn profile', '', NULL, 1, 0),
(439, 1, NULL, 'hide_username_with_complete_name', NULL, NULL, 'profile', 'false', 'Hide username when already showing complete name', 'Some internal functions will return the username when returning the user\'s complete name. With this option enabled, you ensure the username will not appear.', '', NULL, 1, 0),
(440, 1, NULL, 'hide_username_in_course_chat', NULL, NULL, 'profile', 'false', 'Hide username in course chat', 'In the course chat, hide the username. Only display people\'s names.', '', NULL, 1, 0),
(441, 1, NULL, 'show_official_code_whoisonline', NULL, NULL, 'profile', 'false', 'Official code on \'Who is online\'', 'Show official code on the \'Who is online\' page, below the username.', '', NULL, 1, 0),
(442, 1, NULL, 'my_space_users_items_per_page', NULL, NULL, 'profile', '10', 'Default number of items per page in mySpace', '', '', NULL, 1, 0),
(443, 1, NULL, 'add_user_course_information_in_mailto', NULL, NULL, 'profile', 'false', 'Pre-fill the mail with user and course info in footer contact', 'Add subject and body in the mailto: footer.', '', NULL, 1, 0),
(444, 1, NULL, 'pass_reminder_custom_link', NULL, NULL, 'profile', '', 'Custom page for password reminder', 'Set your own URL to a password reset page. Useful when using a federated account management system.', '', NULL, 1, 0),
(445, 1, NULL, 'registration_add_helptext_for_2_names', NULL, NULL, 'profile', 'false', 'Add helper to add two names in registration', 'Add help text for users to enter two names in the registration form when double lastnames are common.', '', NULL, 1, 0),
(446, 1, 51, 'send_notification_when_user_added', NULL, NULL, 'profile', '', 'Send mail to admin when user created', 'Send email notification to admin when a user is created.', '', NULL, 1, 0),
(447, 1, 52, 'show_conditions_to_user', NULL, NULL, 'profile', '', 'Show specific registration conditions', 'Show multiple conditions to user during sign up process. Provide an array with each element containing \'variable\' (internal extra field name), \'display_text\' (simple text for a checkbox), \'text_area\' (long text of conditions).', '', NULL, 1, 0),
(448, 1, NULL, 'allow_teachers_to_classes', NULL, NULL, 'profile', 'false', 'Allow teachers to manage classes', '', '', NULL, 1, 0),
(449, 1, 53, 'profile_fields_visibility', NULL, NULL, 'profile', '', 'Fields visible on profile page', 'Array of fields and whether (boolean) they are visible or not on the user\'s profile page (also works with extra fields labels).', '', NULL, 1, 0),
(450, 1, 54, 'user_import_settings', NULL, NULL, 'profile', '', 'Options for user import', 'Array of options to apply as default parameters in the CSV/XML user import.', '', NULL, 1, 0),
(451, 1, 55, 'user_search_on_extra_fields', NULL, NULL, 'profile', '', 'Search users by extra fields in users list for admins', 'Naturally include the given extra fields (array of extra fields labels) in the user searches.', '', NULL, 1, 0),
(452, 1, 56, 'allow_social_map_fields', NULL, NULL, 'profile', '', 'Users geolocation on a map', 'Enable the display of a map in the social network allowing you to locate other users. This includes several positions (current and destination) which have to be defined as addresses or coordinates in separate extra fields. The extra fields must be set as an array here.', '', NULL, 1, 0),
(453, 1, NULL, 'linkedin_organization_id', NULL, NULL, 'profile', 'false', 'LinkedIn Orgnization ID', 'When sharing a badge on LinkedIn, LinkedIn allows you to set an organization ID that will link to the LinkedIn\'s page of your organization (to link the organization attributing the badge).', '', NULL, 1, 0),
(454, 1, NULL, 'visible_options', NULL, NULL, 'profile', 'name,officialcode,email,picture,login,password,language,phone,theme', 'List of visible fields in profile', 'Controls which profile fields are visible to users and others.', '', NULL, 1, 0),
(455, 1, NULL, 'show_terms_if_profile_completed', NULL, NULL, 'profile', 'false', 'Terms and conditions only if profile complete', 'By enabling this option, terms and conditions will be available to the user only when the extra profile fields that start with \'terms_\' and set to visible are completed.', '', NULL, 1, 0),
(456, 1, NULL, 'required_profile_fields', NULL, NULL, 'registration', '', 'Required fields during registration', '', '', NULL, 1, 0),
(457, 1, NULL, 'allow_registration', NULL, NULL, 'registration', 'approval', 'Registration', 'Is registration as a new user allowed? Can users create new accounts?', '', NULL, 1, 0),
(458, 1, NULL, 'allow_registration_as_teacher', NULL, NULL, 'registration', 'true', 'Registration as teacher', 'Can one register as a teacher (with the ability to create courses)?', '', NULL, 1, 0),
(459, 1, NULL, 'allow_lostpassword', NULL, NULL, 'registration', 'true', 'Lost password', 'Are users allowed to request their lost password?', '', NULL, 1, 0),
(460, 1, NULL, 'extendedprofile_registration', NULL, NULL, 'registration', '', 'Portfolio fields at registration', 'Which of the following fields of the portfolio have to be available in the user registration process? This requires that the portfolio option be enabled (see above).', '', NULL, 1, 0),
(461, 1, NULL, 'extendedprofile_registrationrequired', NULL, NULL, 'registration', '', 'Required portfolio fields in registration', 'Which of the following fields of the portfolio are *required* in the user registration process? This requires that the portfolio option be enabled and that the field be also available in the registration form (see above).', '', NULL, 1, 0),
(462, 1, NULL, 'allow_terms_conditions', NULL, NULL, 'registration', 'false', 'Enable terms and conditions', 'This option will display the Terms and Conditions in the register form for new users. Need to be configured first in the portal administration page.', '', NULL, 1, 0),
(463, 1, NULL, 'student_autosubscribe', NULL, NULL, 'registration', '', 'Learner autosubscribe', 'Learner autosubscribe - not yet available', '', NULL, 1, 0),
(464, 1, NULL, 'teacher_autosubscribe', NULL, NULL, 'registration', '', 'Teacher autosubscribe', 'Teacher autosubscribe - not yet available', '', NULL, 1, 0),
(465, 1, NULL, 'drh_autosubscribe', NULL, NULL, 'registration', '', 'Human resources director autosubscribe', 'Human resources director autosubscribe - not yet available', '', NULL, 1, 0),
(466, 1, NULL, 'sessionadmin_autosubscribe', NULL, NULL, 'registration', '', 'Session admin autosubscribe', 'Session administrator autosubscribe - not available yet', '', NULL, 1, 0),
(467, 1, NULL, 'platform_unsubscribe_allowed', NULL, NULL, 'registration', 'false', 'Allow unsubscription from platform', 'By enabling this option, you allow any user to definitively remove his own account and all data related to it from the platform. This is quite a radical action, but it is necessary for portals opened to the public where users can auto-register. An additional entry will appear in the user profile to unsubscribe after confirmation.', '', NULL, 1, 0),
(468, 1, 58, 'required_extra_fields_in_inscription', NULL, NULL, 'registration', '', 'Required extra fields during registration', '', '', NULL, 1, 0),
(469, 1, 59, 'allow_fields_inscription', NULL, NULL, 'registration', '', 'Restrict fields shown during registration', 'If you only want to show some of the available profile field, your can complete the array here with sub-elements \'fields\' and \'extra_fields\' containing arrays with a list of the fields to show.', '', NULL, 1, 0),
(470, 1, NULL, 'send_inscription_msg_to_inbox', NULL, NULL, 'registration', 'false', 'Send the welcome message to e-mail and inbox', 'By default, the welcome message (with credentials) is sent only by e-mail. Enable this option to send it to the user\'s Chamilo inbox as well.', '', NULL, 1, 0),
(471, 1, 60, 'redirect_after_login', NULL, NULL, 'registration', '', 'Redirect after login (per profile)', 'Define redirection per profile after login using a JSON object like {\"STUDENT\":\"\", \"ADMIN\":\"admin-dashboard\"}', '', NULL, 1, 0),
(472, 1, NULL, 'hide_legal_accept_checkbox', NULL, NULL, 'registration', 'false', 'Hide legal accept checkbox in Terms and Conditions page', 'If set to true, removes the \"I have read and accept\" checkbox in the Terms and Conditions page flow.', '', NULL, 1, 0),
(473, 1, NULL, 'allow_double_validation_in_registration', NULL, NULL, 'registration', 'false', 'Double validation for registration process', 'Simply display a confirmation request on the registration page before going forward with the user creation.', '', NULL, 1, 0),
(474, 1, 57, 'extldap_config', NULL, NULL, 'registration', '', 'LDAP connection configuration', 'Array defining host and port for the LDAP server.', '', NULL, 1, 0),
(475, 1, NULL, 'user_hide_never_expire_option', NULL, NULL, 'registration', 'false', 'Hide \'never expires\' option for users', 'Remove the option \'never expires\' when creating/editing a user account.', '', NULL, 1, 0),
(476, 1, NULL, 'search_enabled', NULL, NULL, 'search', 'false', 'Full-text search feature', 'Select \'Yes\' to enable this feature. It is highly dependent on the Xapian extension for PHP, so this will not work if this extension is not installed on your server, in version 1.x at minimum.', '', NULL, 1, 0),
(477, 1, NULL, 'search_prefilter_prefix', NULL, NULL, 'search', '', 'Specific Field for prefilter', 'This option let you choose the Specific field to use on prefilter search type.', '', NULL, 1, 0),
(478, 1, NULL, 'search_show_unlinked_results', NULL, NULL, 'search', 'true', 'Full-text search: show unlinked results', 'When showing the results of a full-text search, what should be done with the results that are not accessible to the current user?', '', NULL, 1, 0),
(479, 1, NULL, 'filter_terms', NULL, NULL, 'security', '', 'Filter terms', 'Give a list of terms, one by line, to be filtered out of web pages and e-mails. These terms will be replaced by ***.', '', NULL, 1, 0),
(480, 1, NULL, 'admins_can_set_users_pass', NULL, NULL, 'security', '', 'Admins can set users passwords manually', '', '', NULL, 1, 0),
(481, 1, NULL, 'allow_strength_pass_checker', NULL, NULL, 'security', 'true', 'Password strength checker', 'Enable this option to add a visual indicator of password strength, when the user changes his/her password. This will NOT prevent bad passwords to be added, it only acts as a visual helper.', '', NULL, 1, 0),
(482, 1, NULL, 'allow_captcha', NULL, NULL, 'security', 'false', 'CAPTCHA', 'Enable a CAPTCHA on the login form, inscription form and lost password form to avoid password hammering', '', NULL, 1, 0),
(483, 1, NULL, 'user_reset_password', NULL, NULL, 'security', 'false', 'Enable password reset token', 'This option allows to generate a expiring single-use token sent by e-mail to the user to reset his/her password.', '', NULL, 1, 0),
(484, 1, NULL, 'user_reset_password_token_limit', NULL, NULL, 'security', '3600', 'Time limit for password reset token', 'The number of seconds before the generated token automatically expires and cannot be used anymore (a new token needs to be generated).', '', NULL, 1, 0),
(485, 1, NULL, 'captcha_number_mistakes_to_block_account', NULL, NULL, 'security', '', 'CAPTCHA mistakes allowance', 'The number of times a user can make a mistake on the CAPTCHA box before his account is locked out.', '', NULL, 1, 0),
(486, 1, NULL, 'captcha_time_to_block', NULL, NULL, 'security', '', 'CAPTCHA account locking time', 'If the user reaches the maximum allowance for login mistakes (when using the CAPTCHA), his/her account will be locked for this number of minutes.', '', NULL, 1, 0),
(487, 1, NULL, 'prevent_multiple_simultaneous_login', NULL, NULL, 'security', 'false', 'Prevent simultaneous login', 'Prevent users connecting with the same account more than once. This is a good option on pay-per-access portals, but might be restrictive during testing as only one browser can connect with any given account.', '', NULL, 1, 0),
(488, 1, NULL, 'check_password', NULL, NULL, 'security', 'false', 'Check password strength', '', '', NULL, 1, 0),
(489, 1, NULL, 'security_strict_transport', NULL, NULL, 'security', 'strict-transport-security: max-age=31536000; includeSubDomains', 'HTTP Strict Transport Security', 'HTTP Strict Transport Security is an excellent feature to support on your site and strengthens your implementation of TLS by getting the User Agent to enforce the use of HTTPS. Recommended value: \'strict-transport-security: max-age=63072000; includeSubDomains\'. See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security. You can include the \'preload\' suffix, but this has consequences on the top level domain (TLD), so probably not to be done lightly. See https://hstspreload.org/. Leave blank to disable.', '', NULL, 1, 0),
(490, 1, NULL, 'security_content_policy', NULL, NULL, 'security', 'default-src \'self\'; script-src \'self\' \'unsafe-eval\' \'unsafe-inline\'; style-src \'self\' \'unsafe-inline\'; child-src \'self\' *.youtube.com yt.be *.vimeo.com *.slideshare.com;', 'Content Security Policy', 'Content Security Policy is an effective measure to protect your site from XSS attacks. By whitelisting sources of approved content, you can prevent the browser from loading malicious assets. This setting is particularly complicated to set with WYSIWYG editors, but if you add all domains that you want to authorize for iframes inclusion in the child-src statement, this example should work for you. You can prevent JavaScript from executing from external sources (including inside SVG images) by using a strict list in the \'script-src\' argument. Leave blank to disable. Example setting: default-src \'self\'; script-src \'self\' \'unsafe-eval\' \'unsafe-inline\'; style-src \'self\' \'unsafe-inline\'; child-src \'self\' *.youtube.com yt.be *.vimeo.com *.slideshare.com;', '', NULL, 1, 0),
(491, 1, NULL, 'security_content_policy_report_only', NULL, NULL, 'security', 'default-src \'self\'; script-src *://*.google.com:*', 'Content Security Policy report only', 'This setting allows you to experiment by reporting but not enforcing some Content Security Policy.', '', NULL, 1, 0),
(492, 1, NULL, 'security_public_key_pins', NULL, NULL, 'security', '', 'HTTP Public Key Pinning', 'HTTP Public Key Pinning protects your site from MiTM attacks using rogue X.509 certificates. By whitelisting only the identities that the browser should trust, your users are protected in the event a certificate authority is compromised.', '', NULL, 1, 0),
(493, 1, NULL, 'security_public_key_pins_report_only', NULL, NULL, 'security', '', 'HTTP Public Key Pinning report only', 'This setting allows you to experiment by reporting but not enforcing some HTTP Public Key Pinning.', '', NULL, 1, 0),
(494, 1, NULL, 'security_x_frame_options', NULL, NULL, 'security', 'SAMEORIGIN', 'X-Frame-Options', 'X-Frame-Options tells the browser whether you want to allow your site to be framed or not. By preventing a browser from framing your site you can defend against attacks like clickjacking. If defining a URL here, it should define the URL(s) from which your content should be visible, not the URLs from which your site accepts content. For example, if your main URL (root_web above) is https://11.chamilo.org/, then this setting should be: \'ALLOW-FROM https://11.chamilo.org\'. These headers only apply to pages where Chamilo is responsible of the HTTP headers generation (i.e. \'.php\' files). It does not apply to static files. If playing with this feature, make sure you also update your web server configuration to add the right headers for static files. See CDN configuration documentation above (search for \'add_header\') for more information. Recommended (strict) value for this setting, if enabled: \'SAMEORIGIN\'.', '', NULL, 1, 0),
(495, 1, NULL, 'security_xss_protection', NULL, NULL, 'security', '1; mode=block', 'X-XSS-Protection', 'X-XSS-Protection sets the configuration for the cross-site scripting filter built into most browsers. Recommended value \'1; mode=block\'.', '', NULL, 1, 0),
(496, 1, NULL, 'security_x_content_type_options', NULL, NULL, 'security', 'nosniff', 'X-Content-Type-Options', 'X-Content-Type-Options stops a browser from trying to MIME-sniff the content type and forces it to stick with the declared content-type. The only valid value for this header is \'nosniff\'.', '', NULL, 1, 0),
(497, 1, NULL, 'security_referrer_policy', NULL, NULL, 'security', 'origin-when-cross-origin', 'Security Referrer Policy', 'Referrer Policy is a new header that allows a site to control how much information the browser includes with navigation away from a document and should be set by all sites.', '', NULL, 1, 0),
(498, 1, NULL, 'security_block_inactive_users_immediately', NULL, NULL, 'security', 'false', 'Block disabled users immediately', 'Immediately block users who have been disabled by the admin through users management. Otherwise, users who have been disabled will keep their previous privileges until they logout.', '', NULL, 1, 0),
(499, 1, 62, 'password_requirements', NULL, NULL, 'security', '', 'Minimal password syntax requirements', 'Defines the required structure for user passwords.', '', NULL, 1, 0),
(500, 1, 63, 'allow_online_users_by_status', NULL, NULL, 'security', '', 'Filter users that can be seen as online', 'Limits online user visibility to specific user roles.', '', NULL, 1, 0),
(501, 1, NULL, 'security_session_cookie_samesite_none', NULL, NULL, 'security', 'false', 'Session cookie samesite', 'Enable samesite:None parameter for session cookie. More info: https://www.chromium.org/updates/same-site and https://developers.google.com/search/blog/2020/01/get-ready-for-new-samesitenone-secure', '', NULL, 1, 0),
(502, 1, NULL, 'anonymous_autoprovisioning', NULL, NULL, 'security', 'false', 'Auto-provision more anonymous users', 'Dynamically creates new anonymous users to support high visitor traffic.', '', NULL, 1, 0),
(503, 1, NULL, 'access_to_personal_file_for_all', NULL, NULL, 'security', 'false', 'Access to personal file for all', 'Allows all users to access, view, and manage their personal files within the system.', '', NULL, 1, 0),
(504, 1, NULL, 'password_rotation_days', NULL, NULL, 'security', '0', 'Password rotation interval (days)', 'Number of days before users must rotate their password (0 = disabled).', '', NULL, 1, 0),
(505, 1, NULL, '2fa_enable', NULL, NULL, 'security', 'false', 'Enable 2FA', 'Add fields in the password update page to enable 2FA using a TOTP authenticator app. When disabled globally, users won\'t see 2FA fields and won\'t be prompted for 2FA at login, even if they had enabled it previously.', '', NULL, 1, 0),
(506, 1, 61, 'proxy_settings', NULL, NULL, 'security', '', 'Proxy settings', 'Some features of Chamilo will connect to the exterior from the server. For example to make sure an external content exists when creating a link or showing an embedded page in the learning path. If your Chamilo server uses a proxy to get out of its network, this would be the place to configure it.', '', NULL, 1, 0),
(507, 1, NULL, 'login_max_attempt_before_blocking_account', NULL, NULL, 'security', '0', 'Max login attempts before lockdown', 'Number of failed login attempts to tolerate before the user account is locked and has to be unlocked by an admin.', '', NULL, 1, 0),
(508, 1, NULL, 'force_renew_password_at_first_login', NULL, NULL, 'security', 'false', 'Force password renewal at first login', 'This is one simple measure to increase the security of your portal by asking users to immediately change their password, so the one that was transfered by e-mail is no longer valid and they then will use one that they came up with and that they are the only person to know.', '', NULL, 1, 0),
(509, 1, NULL, 'hide_breadcrumb_if_not_allowed', NULL, NULL, 'security', 'false', 'Hide breadcrumb if \'not allowed\'', 'If the user is not allowed to access a specific page, also hide the breadcrumb. This increases security by avoiding the display of unnecessary information.', '', NULL, 1, 0),
(510, 1, NULL, 'add_users_by_coach', NULL, NULL, 'session', 'false', 'Register users by Coach', 'Coach users may create users to the platform and subscribe users to a session.', '', NULL, 1, 0),
(511, 1, NULL, 'extend_rights_for_coach', NULL, NULL, 'session', 'false', 'Extend rights for coach', 'Activate this option will give the coach the same permissions as the trainer on authoring tools', '', NULL, 1, 0),
(512, 1, NULL, 'show_session_coach', NULL, NULL, 'session', 'false', 'Show session coach', 'Show the global session coach name in session title box in the courses list', '', NULL, 1, 0),
(513, 1, NULL, 'show_session_data', NULL, NULL, 'session', 'false', 'Show session data title', 'Show session data comment', '', NULL, 1, 0),
(514, 1, NULL, 'allow_coach_to_edit_course_session', NULL, NULL, 'session', 'true', 'Allow coaches to edit inside course sessions', 'Allow coaches to edit inside course sessions', '', NULL, 1, 0),
(515, 1, NULL, 'hide_courses_in_sessions', NULL, NULL, 'session', 'false', 'Hide courses list in sessions', 'When showing the session block in your courses page, hide the list of courses inside that session (only show them inside the specific session screen).', '', NULL, 1, 0),
(516, 1, NULL, 'allow_session_admins_to_manage_all_sessions', NULL, NULL, 'session', 'false', 'Allow session administrators to see all sessions', 'When this option is not enabled (default), session administrators can only see the sessions they have created. This is confusing in an open environment where session administrators might need to share support time between two sessions.', '', NULL, 1, 0),
(517, 1, NULL, 'allow_teachers_to_create_sessions', NULL, NULL, 'session', 'false', 'Allow teachers to create sessions', 'Teachers can create, edit and delete their own sessions.', '', NULL, 1, 0),
(518, 1, NULL, 'prevent_session_admins_to_manage_all_users', NULL, NULL, 'session', 'false', 'Prevent session admins to manage all users', 'By enabling this option, session admins will only be able to see, in the administration page, the users they created.', '', NULL, 1, 0),
(519, 1, NULL, 'session_course_ordering', NULL, NULL, 'session', 'false', 'Session courses manual ordering', 'Enable this option to allow the session administrators to order the courses inside a session manually. If disabled, courses are ordered alphabetically on course title.', '', NULL, 1, 0),
(520, 1, NULL, 'limit_session_admin_role', NULL, NULL, 'session', 'false', 'Limit session admins permissions', 'If enabled, the session administrators will only see the User block with the \'Add user\' option and the Sessions block with the \'Sessions list\' option.', '', NULL, 1, 0),
(521, 1, NULL, 'allow_tutors_to_assign_students_to_session', NULL, NULL, 'session', 'false', 'Tutors can assign students to sessions', 'When enabled, course coaches/tutors in sessions can subscribe new users to their session. This option is otherwise only available to administrators and session administrators.', '', NULL, 1, 0),
(522, 1, NULL, 'drh_can_access_all_session_content', NULL, NULL, 'session', 'true', 'HR directors access all session content', 'If enabled, human resources directors will get access to all content and users from the sessions (s)he follows.', '', NULL, 1, 0),
(523, 1, NULL, 'allow_session_course_copy_for_teachers', NULL, NULL, 'session', 'false', 'Allow session-to-session copy for teachers', 'Enable this option to let teachers copy their content from one course in a session to a course in another session. By default, this option is only available to platform administrators.', '', NULL, 1, 0),
(524, 1, NULL, 'my_courses_view_by_session', NULL, NULL, 'session', 'false', 'View my courses by session', 'Enable an additional \'My courses\' page where sessions appear as part of courses, rather than the opposite.', '', NULL, 1, 0),
(525, 1, NULL, 'session_days_after_coach_access', NULL, NULL, 'session', '', 'Default coach access days after session', 'Default number of days a coach can access his session after the official session end date', '', NULL, 1, 0),
(526, 1, NULL, 'session_days_before_coach_access', NULL, NULL, 'session', '', 'Default coach access days before session', 'Default number of days a coach can access his session before the official session start date', '', NULL, 1, 0),
(527, 1, NULL, 'show_session_description', NULL, NULL, 'session', 'false', 'Show session description', 'Show the session description wherever this option is implemented (sessions tracking pages, etc)', '', NULL, 1, 0),
(528, 1, NULL, 'remove_session_url', NULL, NULL, 'session', 'false', 'Hide link to session page', 'Hide link to the session page from the sessions list.', '', NULL, 1, 0),
(529, 1, NULL, 'hide_tab_list', NULL, NULL, 'session', '', 'Hide tabs on the session page', '', '', NULL, 1, 0),
(530, 1, NULL, 'session_admins_edit_courses_content', NULL, NULL, 'session', 'false', 'Session admins can edit course content', '', '', NULL, 1, 0),
(531, 1, NULL, 'allow_session_admin_login_as_teacher', NULL, NULL, 'session', 'false', 'Session admins can \'login as\' teachers', '', '', NULL, 1, 0),
(532, 1, NULL, 'allow_search_diagnostic', NULL, NULL, 'session', 'false', 'Enable sessions search diagnosis', 'Allow tutors to get a diagnosis that will allow them to search for the best sessions for learners.', '', NULL, 1, 0),
(533, 1, NULL, 'allow_redirect_to_session_after_inscription_about', NULL, NULL, 'session', 'false', 'Redirect to session after registration in session\'s \'About\' page', '', '', NULL, 1, 0),
(534, 1, NULL, 'session_list_show_count_users', NULL, NULL, 'session', 'false', 'Show number of users in sessions list', 'The admin can see the number of users in each session. This adds additional weight to the sessions list, so if you use it often, consider carefully whether you want the extra waiting time.', '', NULL, 1, 0),
(535, 1, NULL, 'session_admins_access_all_content', NULL, NULL, 'session', 'false', 'Session admins can access all course content', '', '', NULL, 1, 0),
(536, 1, NULL, 'limit_session_admin_list_users', NULL, NULL, 'session', 'false', 'Session admins are forbidden access to the users list', '', '', NULL, 1, 0),
(537, 1, NULL, 'hide_search_form_in_session_list', NULL, NULL, 'session', 'false', 'Hide search form in sessions list', '', '', NULL, 1, 0),
(538, 1, NULL, 'allow_delete_user_for_session_admin', NULL, NULL, 'session', 'false', 'Session admins can delete users', '', '', NULL, 1, 0),
(539, 1, NULL, 'allow_disable_user_for_session_admin', NULL, NULL, 'session', 'false', 'Session admins can disable users', '', '', NULL, 1, 0),
(540, 1, NULL, 'session_multiple_subscription_students_list_avoid_emptying', NULL, NULL, 'session', 'false', 'Prevent emptying the subscribed users in session subscription', 'When using the multiple learners subscription to a session, prevent the normal behaviour which is to unsubscribe users who are not in the right panel when clicking submit. Keep all users there.', '', NULL, 1, 0),
(541, 1, NULL, 'hide_reporting_session_list', NULL, NULL, 'session', 'false', 'Hide sessions list in reporting tool', 'Sessions that include the course are listed in the reporting tool inside the course itself, which can add considerable weight if the same course is used in hundreds of sessions. This option removes that list.', '', NULL, 1, 0),
(542, 1, NULL, 'allow_session_admin_read_careers', NULL, NULL, 'session', 'false', 'Session admins can view careers', '', '', NULL, 1, 0),
(543, 1, NULL, 'session_list_order', NULL, NULL, 'session', 'false', 'Sessions support manual sorting', '', '', NULL, 1, 0),
(544, 1, NULL, 'allow_user_session_collapsable', NULL, NULL, 'session', 'false', 'Allow user to collapse sessions in My sessions', '', '', NULL, 1, 0),
(545, 1, NULL, 'default_session_list_view', NULL, NULL, 'session', 'all', 'Default sessions list view', 'Select the default tab you want to see when opening the sessions list as admin.', '', NULL, 1, 0),
(546, 1, NULL, 'session_automatic_creation_user_id', NULL, NULL, 'session', '1', 'Auto-created session\'s creator ID', 'Set the user to use as creator of the automatically-created sessions (to avoid assigning every session to user \'1\' which is often the portal administrator).', '', NULL, 1, 0),
(547, 1, NULL, 'user_s_session_duration', NULL, NULL, 'session', '1095', 'Auto-created sessions duration', 'Duration (in days) of the single-user, auto-created sessions. After expiry, the user cannot register to the same course (no other session is created).', '', NULL, 1, 0),
(548, 1, 64, 'my_courses_session_order', NULL, NULL, 'session', '', 'Change the default sorting of session in My sessions', 'By default, sessions are ordered by start date. Change this by providing an array of type [\'field\' => \'end_date\', \'order\' => \'desc\'].', '', NULL, 1, 0),
(549, 1, NULL, 'session_courses_read_only_mode', NULL, NULL, 'session', 'false', 'Set course read-only in session', 'Let teachers set some courses in read-only mode when opened through sessions. In the course properties, check the \'Lock course in session\' option.', '', NULL, 1, 0),
(550, 1, 65, 'session_import_settings', NULL, NULL, 'session', '', 'Options for session import', 'Array of options to apply as default parameters in the CSV/XML session import.', '', NULL, 1, 0),
(551, 1, 66, 'tracking_columns', NULL, NULL, 'session', '', 'Customize course-session tracking columns', 'Define an array of columns for the following reports: \'course_session\', \'my_students_lp\', \'my_progress_lp\', \'my_progress_courses\'.', '', NULL, 1, 0),
(552, 1, NULL, 'my_progress_session_show_all_courses', NULL, NULL, 'session', 'false', 'My progress: show course details in session', 'Display all details of each course in session when clicking on session details.', '', NULL, 1, 0),
(553, 1, NULL, 'assignment_base_course_teacher_access_to_all_session', NULL, NULL, 'session', 'false', 'Base course teacher can see assignments from all sessions', 'Show all learner publications (from base course and from all sessions) in the work/pending.php page of the base course.', '', NULL, 1, 0),
(554, 1, NULL, 'allow_session_admin_extra_access', NULL, NULL, 'session', 'false', 'Session admin can access batch user import, update and export', '', '', NULL, 1, 0),
(555, 1, NULL, 'hide_session_graph_in_my_progress', NULL, NULL, 'session', 'false', 'Hide session chart in My progress', '', '', NULL, 1, 0),
(556, 1, NULL, 'show_users_in_active_sessions_in_tracking', NULL, NULL, 'session', 'false', 'Only display users from active sessions in tracking', '', '', NULL, 1, 0),
(557, 1, NULL, 'session_coach_access_after_duration_end', NULL, NULL, 'session', 'false', 'Sessions by duration always available to coaches', 'Otherwise, session coaches only have access to sessions by duration during the active duration.', '', NULL, 1, 0),
(558, 1, NULL, 'session_course_users_subscription_limited_to_session_users', NULL, NULL, 'session', 'false', 'Limit subscriptions to course to only users of the session', 'Restrict the list of students to subscribe in the course session. And disable registration for users in all courses from Resume Session page.', '', NULL, 1, 0),
(559, 1, NULL, 'session_classes_tab_disable', NULL, NULL, 'session', 'false', 'Disable add class in session course for non-admin', 'Disable tab to add classes in session course for non-admins.', '', NULL, 1, 0),
(560, 1, NULL, 'email_template_subscription_to_session_confirmation_username', NULL, NULL, 'session', 'false', 'Add username to e-mail notification of subscription to session', '', '', NULL, 1, 0),
(561, 1, NULL, 'email_template_subscription_to_session_confirmation_lost_password', NULL, NULL, 'session', 'false', 'Add reset password link to e-mail notification of subscription to session', '', '', NULL, 1, 0),
(562, 1, 67, 'session_creation_user_course_extra_field_relation_to_prefill', NULL, NULL, 'session', '', 'Pre-fill session fields with user fields', 'Array of relationships between user extra fields and session extra fields, so the session can be pre-filled with data matching the user\'s data.', '', NULL, 1, 0),
(563, 1, 68, 'session_creation_form_set_extra_fields_mandatory', NULL, NULL, 'session', '', 'Set mandatory extra fields in session creation form', 'Require the listed fields during session creation.', '', NULL, 1, 0),
(564, 1, NULL, 'session_model_list_field_ordered_by_id', NULL, NULL, 'session', 'false', 'Sort session templates by id in session creation form', '', '', NULL, 1, 0),
(565, 1, NULL, 'duplicate_specific_session_content_on_session_copy', NULL, NULL, 'session', 'false', 'Enable the copy of session-specific content to another session', 'Allows duplication of resources that were created in the session when duplicating the session.', '', NULL, 1, 0),
(566, 1, NULL, 'enable_auto_reinscription', NULL, NULL, 'session', 'false', 'Enable Automatic Reinscription', 'Enable or disable automatic reinscription when course validity expires. The related cron job must also be activated.', '', NULL, 1, 0),
(567, 1, NULL, 'enable_session_replication', NULL, NULL, 'session', 'false', 'Enable Session Replication', 'Enable or disable automatic session replication. The related cron job must also be activated.', '', NULL, 1, 0),
(568, 1, NULL, 'session_list_view_remaining_days', NULL, NULL, 'session', 'false', 'Show remaining days in My Sessions', 'If enabled, the session dates on the \"My Sessions\" page will be replaced by the number of remaining days.', '', NULL, 1, 0);
INSERT INTO `settings` (`id`, `access_url`, `value_template_id`, `variable`, `subkey`, `type`, `category`, `selected_value`, `title`, `comment`, `scope`, `subkeytext`, `access_url_changeable`, `access_url_locked`) VALUES
(569, 1, NULL, 'user_session_display_mode', NULL, NULL, 'session', 'card', 'My Sessions display mode', 'Choose how the \"My Sessions\" page is displayed: as a modern visual block (card) view or the classic list style.', '', NULL, 1, 0),
(570, 1, NULL, 'show_simple_session_info', NULL, NULL, 'session', 'true', 'Show simple session info', 'Add coach and dates to the session\'s subtitle in the sessions\' list.', '', NULL, 1, 0),
(571, 1, NULL, 'show_all_sessions_on_my_course_page', NULL, NULL, 'session', 'true', 'Show all sessions on \'My courses\' page', 'If enabled, this option show all sessions of the user in calendar-based view.', '', NULL, 1, 0),
(572, 1, NULL, 'courses_list_session_title_link', NULL, NULL, 'session', '1', 'Type of link for the session title', 'On the courses/sessions page, the session title can be either of the following : 0 = no link (hide session title) ; 1 = link title to a special session page ; 2 = link to the course if there is only one course ; 3 = session title makes the courses list foldable ; 4 = no link (show session title).', '', NULL, 1, 0),
(573, 1, NULL, 'allow_edit_tool_visibility_in_session', NULL, NULL, 'session', 'true', 'Allow tool visibility edition in sessions', 'When using sessions, the default behaviour is to use the tool visibility defined in the base course. This setting changes that to allow coaches in session courses to adapt tool visibilities to their needs.', '', NULL, 1, 0),
(574, 1, NULL, 'allow_career_diagram', NULL, NULL, 'session', 'false', 'Enable career diagrams', 'Career diagrams allow you to display diagrams of careers, skills and courses.', '', NULL, 1, 0),
(575, 1, NULL, 'allow_career_users', NULL, NULL, 'session', 'false', 'Enable career diagrams for users', 'If career diagrams are enabled, users can only see them (and only the diagrams that correspond to their studies) if you enable this option.', '', NULL, 1, 0),
(576, 1, NULL, 'career_diagram_legend', NULL, NULL, 'session', 'false', 'Display a legend below the career diagram', 'Add a career legend below the career diagram. A language variable called \'Career diagram legend\' must exist in your sub-language.', '', NULL, 1, 0),
(577, 1, NULL, 'career_diagram_disclaimer', NULL, NULL, 'session', 'false', 'Display a disclaimer below the career diagram', 'Add a disclaimer below the career diagram. A language variable called \'Career diagram disclaimer\' must exist in your sub-language.', '', NULL, 1, 0),
(578, 1, NULL, 'allow_skills_tool', NULL, NULL, 'skill', 'true', 'Allow Skills tool', 'Users can see their skills in the social network and in a block in the homepage.', '', NULL, 1, 0),
(579, 1, NULL, 'allow_hr_skills_management', NULL, NULL, 'skill', 'true', 'Allow HR skills management', 'Allows HR to manage skills', '', NULL, 1, 0),
(580, 1, NULL, 'show_full_skill_name_on_skill_wheel', NULL, NULL, 'skill', 'false', 'Show full skill name on skill wheel', 'On the wheel of skills, it shows the name of the skill when it has short code.', '', NULL, 1, 0),
(581, 1, NULL, 'badge_assignation_notification', NULL, NULL, 'skill', 'false', 'Send notification to learner when a skill/badge has been acquired', '', '', NULL, 1, 0),
(582, 1, NULL, 'allow_private_skills', NULL, NULL, 'skill', 'false', 'Hide skills from learners', 'If enabled, skills can only be visible for admins, teachers (related to a user via a course), and HRM users (if related to a user).', '', NULL, 1, 0),
(583, 1, NULL, 'allow_teacher_access_student_skills', NULL, NULL, 'skill', 'false', 'Allow teachers to access learners\' skills', '', '', NULL, 1, 0),
(584, 1, NULL, 'skills_teachers_can_assign_skills', NULL, NULL, 'skill', 'false', 'Allow teachers to set which skills are acquired through their courses', 'By default, only admins can decide which skills can be acquired through which course.', '', NULL, 1, 0),
(585, 1, NULL, 'hide_skill_levels', NULL, NULL, 'skill', 'false', 'Hide skill levels feature', '', '', NULL, 1, 0),
(586, 1, NULL, 'skills_hierarchical_view_in_user_tracking', NULL, NULL, 'skill', 'false', 'Show skills as a hierarchical table', '', '', NULL, 1, 0),
(587, 1, 69, 'skill_levels_names', NULL, NULL, 'skill', '', 'Skill levels names', 'Define names for levels of skills as an array of id => name.', '', NULL, 1, 0),
(588, 1, NULL, 'allow_skill_rel_items', NULL, NULL, 'skill', 'false', 'Enable linking skills to items', 'This enables a major feature that enables any item to be linked to (and as such to allow acquisition of) a skill. The feature still requires the teacher to confirm the acquisition of the skill, so the acquisition is not automatic.', '', NULL, 1, 0),
(589, 1, NULL, 'manual_assignment_subskill_autoload', NULL, NULL, 'skill', 'false', 'Assigning skills to user: sub-skills auto-loading', 'When manually assigning skills to a user, the form can be set to automatically offer you to assign a sub-skill instead of the skill you selected.', '', NULL, 1, 0),
(590, 1, NULL, 'openbadges_backpack', NULL, NULL, 'skill', 'https://www.badgecraft.eu/', 'OpenBadges backpack URL', 'The URL of the OpenBadges backpack server that will be used by default for all users wanting to export their badges. This defaults to the open and free Mozilla Foundation backpack repository: https://backpack.openbadges.org/', '', NULL, 1, 0),
(591, 1, NULL, 'allow_social_tool', NULL, NULL, 'social', 'true', 'Social network tool (Facebook-like)', 'The social network tool allows users to define relations with other users and, by doing so, to define groups of friends. Combined with the internal messaging tool, this tool allows tight communication with friends, inside the portal environment.', '', NULL, 1, 0),
(592, 1, NULL, 'allow_students_to_create_groups_in_social', NULL, NULL, 'social', 'false', 'Allow learners to create groups in social network', 'Allow learners to create groups in social network', '', NULL, 1, 0),
(593, 1, NULL, 'social_enable_messages_feedback', NULL, NULL, 'social', 'false', 'Like/Dislike for social posts', 'Allows users to add feedback (likes or dislikes) to posts in social wall.', '', NULL, 1, 0),
(594, 1, NULL, 'disable_dislike_option', NULL, NULL, 'social', 'false', 'Disable \'dislike\' for social posts', 'Remove the thumb down option for social posts feedback. Only keep thumb up (like).', '', NULL, 1, 0),
(595, 1, NULL, 'social_show_language_flag_in_profile', NULL, NULL, 'social', 'false', 'Show language flag next to avatar in social network', '', '', NULL, 1, 0),
(596, 1, NULL, 'social_make_teachers_friend_all', NULL, NULL, 'social', 'false', 'Teachers and admins see students as friends on social network', '', '', NULL, 1, 0),
(597, 1, NULL, 'hide_social_groups_block', NULL, NULL, 'social', 'false', 'Hide groups block in social network', 'Removes the groups section from the social network view.', '', NULL, 1, 0),
(598, 1, NULL, 'survey_email_sender_noreply', NULL, NULL, 'survey', 'coach', 'Survey e-mail sender (no-reply)', 'Should the survey invitations use the coach e-mail address or the no-reply address defined in the main configuration section?', '', NULL, 1, 0),
(599, 1, NULL, 'extend_rights_for_coach_on_survey', NULL, NULL, 'survey', 'true', 'Extend rights for coachs on surveys', 'Activate this option will allow the coachs to create and edit surveys', '', NULL, 1, 0),
(600, 1, NULL, 'hide_survey_reporting_button', NULL, NULL, 'survey', 'false', 'Hide survey reporting button', 'Allows admins to hide survey reporting button if surveys are used to survey teachers.', '', NULL, 1, 0),
(601, 1, NULL, 'survey_mark_question_as_required', NULL, NULL, 'survey', 'false', 'Mark all survey questions as \'required\' by default', '', '', NULL, 1, 0),
(602, 1, NULL, 'survey_anonymous_show_answered', NULL, NULL, 'survey', 'false', 'Allow teachers to see who answered in anonymous surveys', 'Allow teachers to see which learners have already answered an anonymous survey. This only appears once more than one user has answered, so it remains difficult to identify who answered what.', '', NULL, 1, 0),
(603, 1, NULL, 'survey_allow_answered_question_edit', NULL, NULL, 'survey', 'false', 'Allow teachers to edit survey questions after students answered', '', '', NULL, 1, 0),
(604, 1, NULL, 'survey_duplicate_order_by_name', NULL, NULL, 'survey', 'true', 'Order by student name when using survey duplication feature', 'The survey duplication feature is oriented towards teachers and is meant to ask teachers to give their appreciation about each student in order. This option will order the questions by learner\'s lastname.', '', NULL, 1, 0),
(605, 1, NULL, 'survey_backwards_enable', NULL, NULL, 'survey', 'false', 'Enable \'previous question\' button in surveys', '', '', NULL, 1, 0),
(606, 1, 70, 'hide_survey_edition', NULL, NULL, 'survey', '', 'Prevent survey edition', 'Prevent editing surveys for all surveys listed here (by code). Use * to prevent edition of all surveys.', '', NULL, 1, 0),
(607, 1, 71, 'survey_additional_teacher_modify_actions', NULL, NULL, 'survey', '', 'Add additional actions (as links) to survey lists for teachers', 'Add actions (usually connected to plugins) in the list of surveys. Use array syntax [\'myplugin\' => [\'MyPlugin\', \'urlGeneratorCallback\']].', '', NULL, 1, 0),
(608, 1, NULL, 'show_surveys_base_in_sessions', NULL, NULL, 'survey', 'false', 'Display surveys from base course in all session courses', '', '', NULL, 1, 0),
(609, 1, NULL, 'show_pending_survey_in_menu', NULL, NULL, 'survey', 'false', 'Show \"Pending surveys\" in menu', 'Display a menu item that lets users access their pending surveys.', '', NULL, 1, 0),
(610, 1, NULL, 'block_student_publication_edition', NULL, NULL, 'work', 'false', 'Prevent assignments edition', '', '', NULL, 1, 0),
(611, 1, NULL, 'block_student_publication_add_documents', NULL, NULL, 'work', 'false', 'Prevent adding documents to assignments', '', '', NULL, 1, 0),
(612, 1, NULL, 'block_student_publication_score_edition', NULL, NULL, 'work', 'false', 'Prevent teacher from modifying assignment scores', '', '', NULL, 1, 0),
(613, 1, NULL, 'allow_only_one_student_publication_per_user', NULL, NULL, 'work', 'false', 'Students can only upload one assignment', '', '', NULL, 1, 0),
(614, 1, NULL, 'allow_my_student_publication_page', NULL, NULL, 'work', 'false', 'Enable My assignments page', '', '', NULL, 1, 0),
(615, 1, NULL, 'assignment_prevent_duplicate_upload', NULL, NULL, 'work', 'false', 'Prevent duplicate uploads in assignments', '', '', NULL, 1, 0),
(616, 1, NULL, 'considered_working_time', NULL, NULL, 'work', 'work_time', 'Enable time effort for assignments', 'This will allow teachers to give an estimated time effort (in hh:mm:ss format) to complete the assignment. Upon submission of the assignment and approval by the teacher (the assignment is given a score), the learner will automatically be assigned the corresponding time.', '', NULL, 1, 0),
(617, 1, NULL, 'force_download_doc_before_upload_work', NULL, NULL, 'work', 'true', 'Force download of document before assignment upload', 'Force users to download the provided document in the assignment definition before they can upload their assignment.', '', NULL, 1, 0),
(618, 1, NULL, 'allow_redirect_to_main_page_after_work_upload', NULL, NULL, 'work', 'false', 'Redirect to assigment tool homepage after upload or comment', 'Redirect to assignments list after uploading an assignment or a adding a comment', '', NULL, 1, 0),
(619, 1, NULL, 'my_courses_show_pending_work', NULL, NULL, 'work', 'false', 'Display link to \'pending\' assignments from My courses page', '', '', NULL, 1, 0),
(620, 1, NULL, 'allow_compilatio_tool', NULL, NULL, 'work', 'false', 'Enable Compilatio', 'Compilatio is an anti-cheating service that compares text between two submissions and reports if there is a high probability the content (usually assignments) is not genuine.', '', NULL, 1, 0),
(621, 1, 16, 'compilatio_tool', NULL, NULL, 'work', '', 'Compilatio settings', 'Configure the Compilatio connection details here.', '', NULL, 1, 0),
(622, 1, NULL, 'ticket_allow_category_edition', NULL, NULL, 'ticket', 'false', 'Allow tickets categories edition', 'Allow category edition by administrators.', '', NULL, 1, 0),
(623, 1, NULL, 'ticket_allow_student_add', NULL, NULL, 'ticket', 'false', 'Allow users to add tickets', 'Allows all users to add tickets not only the administrators.', '', NULL, 1, 0),
(624, 1, NULL, 'ticket_send_warning_to_all_admins', NULL, NULL, 'ticket', 'false', 'Send ticket warning messages to administrators', 'Send a message if a ticket was created without a category or if a category doesn\'t have any administrator assigned.', '', NULL, 1, 0),
(625, 1, NULL, 'ticket_warn_admin_no_user_in_category', NULL, NULL, 'ticket', 'false', 'Send alert to administrators if tickets category has no one in charge', 'Send a warning message (e-mail and Chamilo message) to all administrators if there\'s not a user assigned to a category.', '', NULL, 1, 0),
(626, 1, 72, 'ticket_project_user_roles', NULL, NULL, 'ticket', '', 'Access by role to ticket projects', 'Allow ticket projects to be accesses by specific user roles. Example: [\'permissions\' => [1 => [17]] where project_id = 1, STUDENT_BOSS = 17.', '', NULL, 1, 0),
(627, 1, NULL, 'show_link_ticket_notification', NULL, NULL, 'ticket', 'false', 'Show ticket creation link', 'Show the ticket creation link to users on the right side of the portal', '', NULL, 1, 0),
(628, 1, NULL, 'show_link_bug_notification', NULL, NULL, 'ticket', 'false', 'Show link to report bug', 'Show a link in the header to report a bug inside of our support platform (http://support.chamilo.org). When clicking on the link, the user is sent to the support platform, on a wiki page that describes the bug reporting process.', '', NULL, 1, 0),
(629, 1, NULL, 'header_extra_content', NULL, NULL, 'tracking', '', 'Extra content in header', 'You can add HTML code like meta tags', '', NULL, 1, 0),
(630, 1, NULL, 'footer_extra_content', NULL, NULL, 'tracking', '', 'Extra content in footer', 'You can add HTML code like meta tags', '', NULL, 1, 0),
(631, 1, NULL, 'meta_title', NULL, NULL, 'tracking', '', 'OpenGraph meta title', 'This will show an OpenGraph Title meta (og:title) in your site\'s headers', '', NULL, 1, 0),
(632, 1, NULL, 'meta_description', NULL, NULL, 'tracking', '', 'Meta description', 'This will show an OpenGraph Description meta (og:description) in your site\'s headers', '', NULL, 1, 0),
(633, 1, NULL, 'meta_image_path', NULL, NULL, 'tracking', '', 'Meta image path', 'This Meta Image path is the path to a file inside your Chamilo directory (e.g. home/image.png) that should show in a Twitter card or a OpenGraph card when showing a link to your LMS. Twitter recommends an image of 120 x 120 pixels, which might sometimes be cropped to 120x90.', '', NULL, 1, 0),
(634, 1, NULL, 'meta_twitter_site', NULL, NULL, 'tracking', '', 'Twitter Site account', 'The Twitter site is a Twitter account (e.g. @chamilo_news) that is related to your site. It is usually a more temporary account than the Twitter creator account, or represents an entity (instead of a person). This field is required if you want the Twitter card meta fields to show.', '', NULL, 1, 0),
(635, 1, NULL, 'meta_twitter_creator', NULL, NULL, 'tracking', '', 'Twitter Creator account', 'The Twitter Creator is a Twitter account (e.g. @ywarnier) that represents the *person* that created the site. This field is optional.', '', NULL, 1, 0),
(636, 1, NULL, 'tracking_skip_generic_data', NULL, NULL, 'tracking', 'false', 'Skip generic data in learner self-tracking page', 'If the \'My progress\' page takes too long to load, you might want to remove the processing of generic statistics for the user. In this case enable this setting.', '', NULL, 1, 0),
(637, 1, NULL, 'block_my_progress_page', NULL, NULL, 'tracking', 'false', 'Prevent access to \'My progress\'', 'In specific implementations like online exams, you might want to prevent user access to the \'My progress\' page.', '', NULL, 1, 0),
(638, 1, 2, 'my_progress_course_tools_order', NULL, NULL, 'tracking', '', 'Order of tools on \'My progress\' page', 'Change the order of tools shown on the \'My progress\' page for learners. Options include \'quizzes\', \'learning_paths\' and \'skills\'.', '', NULL, 1, 0),
(639, 1, NULL, 'messaging_allow_send_push_notification', NULL, NULL, 'webservice', 'false', 'Allow Push Notifications to the Chamilo Messaging mobile app', 'Send Push Notifications by Google\'s Firebase Console', '', NULL, 1, 0),
(640, 1, NULL, 'messaging_gdc_project_number', NULL, NULL, 'webservice', '', 'Sender ID of Firebase Console for Cloud Messaging', 'You need register a project on <a href=\'https://console.firebase.google.com/\'>Google Firebase Console</a>', '', NULL, 1, 0),
(641, 1, NULL, 'messaging_gdc_api_key', NULL, NULL, 'webservice', '', 'Server key of Firebase Console for Cloud Messaging', 'Server key (legacy token) from project credentials', '', NULL, 1, 0),
(642, 1, NULL, 'allow_download_documents_by_api_key', NULL, NULL, 'webservice', 'false', 'Allow download course documents by API Key', 'Download documents verifying the REST API key for a user', '', NULL, 1, 0),
(643, 1, NULL, 'disable_webservices', NULL, NULL, 'webservice', 'false', 'Disable web services', 'If you do not use web services, enable this to avoid any unnecessary security risk.', '', NULL, 1, 0),
(644, 1, NULL, 'webservice_enable_adminonly_api', NULL, NULL, 'webservice', 'false', 'Enable admin-only web services', 'Some REST web services are marked for admins only and are disabled by default. Enable this feature to give access to these web services (to users with admin credentials, obviously).', '', NULL, 1, 0),
(645, 1, NULL, 'webservice_return_user_field', NULL, NULL, 'webservice', 'oauth2_id', 'Webservices return user field', 'Ask REST webservices (v2.php) to return another identifier for fields related to user ID. This is useful if the external system doesn\'t really deal with user IDs as they are in Chamilo, as it helps the external system match the user data return with some external data that is know to Chamilo. For example, if you use an external authentication system, you can return the extra field used to match the user with the external authentication system rather than user.id.', '', NULL, 1, 0),
(646, 1, NULL, 'enable_ai_helpers', NULL, NULL, 'ai_helpers', 'false', 'Enable the AI helper tool', 'Enables all available AI-powered features in the platform.', '', NULL, 1, 0),
(647, 1, 15, 'ai_providers', NULL, NULL, 'ai_helpers', '', 'AI providers connection data', 'Configuration data to connect with external AI services.', '', NULL, 1, 0),
(648, 1, NULL, 'learning_path_generator', NULL, NULL, 'ai_helpers', 'false', 'Learning paths generator', 'Generates personalized learning paths using AI suggestions.', '', NULL, 1, 0),
(649, 1, NULL, 'exercise_generator', NULL, NULL, 'ai_helpers', 'false', 'Exercise generator', 'Generates personalized tests with AI based on course content.', '', NULL, 1, 0),
(650, 1, NULL, 'open_answers_grader', NULL, NULL, 'ai_helpers', 'false', 'Open answers grader', 'Automatically grades open-ended answers using AI.', '', NULL, 1, 0),
(651, 1, NULL, 'tutor_chatbot', NULL, NULL, 'ai_helpers', 'false', 'Tutor chatbot energized by AI', 'Provides students with an AI-powered tutoring assistant.', '', NULL, 1, 0),
(652, 1, NULL, 'task_grader', NULL, NULL, 'ai_helpers', 'false', 'Assignments grader', 'Uses AI to evaluate and grade uploaded assignments.', '', NULL, 1, 0),
(653, 1, NULL, 'content_analyser', NULL, NULL, 'ai_helpers', 'false', 'Content analyser', 'Analyses learning materials to extract insights or improve quality.', '', NULL, 1, 0),
(654, 1, NULL, 'image_generator', NULL, NULL, 'ai_helpers', 'false', 'Image generator', 'Generates images based on prompts or content using AI.', '', NULL, 1, 0),
(655, 1, NULL, 'disclose_ai_assistance', NULL, NULL, 'ai_helpers', 'true', 'Disclose AI assistance', 'Show a tag on any content or feedback that has been generated or co-generated by any AI system, evidencing to the user that the content was built with the help of some AI system. Details about which AI system was used in which case are kept inside the database for audit, but are not directly accessible by the final user.', '', NULL, 1, 0),
(656, 1, 6, 'course_catalog_settings', NULL, NULL, 'catalog', '', 'Course Catalog Settings', 'JSON configuration for course catalog: link settings, filters, sort options, and more.', '', NULL, 1, 0),
(657, 1, 7, 'session_catalog_settings', NULL, NULL, 'catalog', '', 'Session Catalog Settings', 'JSON configuration for session catalog: filters and display options.', '', NULL, 1, 0),
(658, 1, NULL, 'show_courses_descriptions_in_catalog', NULL, NULL, 'catalog', 'false', 'Show Course Descriptions', 'Display course descriptions within the catalog listing.', '', NULL, 1, 0),
(659, 1, NULL, 'course_catalog_published', NULL, NULL, 'catalog', 'false', 'Published Courses Only', 'Limit the catalog to only courses marked as published.', '', NULL, 1, 0),
(660, 1, NULL, 'course_catalog_display_in_home', NULL, NULL, 'catalog', 'false', 'Display Catalog on Homepage', 'Show the course catalog block on the platform homepage.', '', NULL, 1, 0),
(661, 1, NULL, 'hide_public_link', NULL, NULL, 'catalog', 'false', 'Hide Public Link', 'Remove the public URL link from course cards.', '', NULL, 1, 0),
(662, 1, NULL, 'only_show_selected_courses', NULL, NULL, 'catalog', 'false', 'Only Selected Courses', 'Show only manually selected courses in the catalog.', '', NULL, 1, 0),
(663, 1, 5, 'only_show_course_from_selected_category', NULL, NULL, 'catalog', '', 'Only show matching categories in courses catalogue', 'When not empty, only the courses from the given categories will appear in the courses catalogue.', '', NULL, 1, 0),
(664, 1, NULL, 'allow_students_to_browse_courses', NULL, NULL, 'catalog', 'true', 'Allow Student Browsing', 'Permit students to browse and filter the course catalog.', '', NULL, 1, 0),
(665, 1, NULL, 'course_catalog_hide_private', NULL, NULL, 'catalog', 'true', 'Hide Private Courses', 'Exclude private courses from the catalog display.', '', NULL, 1, 0),
(666, 1, NULL, 'show_courses_sessions', NULL, NULL, 'catalog', '0', 'Show Courses & Sessions', 'Include both courses and sessions in catalog results.', '', NULL, 1, 0),
(667, 1, NULL, 'allow_session_auto_subscription', NULL, NULL, 'catalog', 'false', 'Auto Session Subscription', 'Enable automatic subscription to sessions for users.', '', NULL, 1, 0),
(668, 1, NULL, 'course_subscription_in_user_s_session', NULL, NULL, 'catalog', 'false', 'Subscription in Session View', 'Allow users to subscribe to courses directly from their session page.', '', NULL, 1, 0),
(669, 1, NULL, 'plugin_redirection_enabled', NULL, NULL, 'workflows', 'false', 'Enable redirection plugin', 'Enable only if you are using the Redirection plugin', '', NULL, 1, 0),
(670, 1, NULL, 'usergroup_do_not_unsubscribe_users_from_course_nor_session_on_user_unsubscribe', NULL, NULL, 'workflows', 'false', 'Disable user unsubscription from course/session on user unsubscription from group/class', '', '', NULL, 1, 0),
(671, 1, NULL, 'usergroup_do_not_unsubscribe_users_from_course_on_course_unsubscribe', NULL, NULL, 'workflows', 'false', 'Disable user unsubscription from course on course removal from group/class', '', '', NULL, 1, 0),
(672, 1, NULL, 'usergroup_do_not_unsubscribe_users_from_session_on_session_unsubscribe', NULL, NULL, 'workflows', 'false', 'Disable user unsubscription from session on session removal from group/class', '', '', NULL, 1, 0),
(673, 1, NULL, 'drh_allow_access_to_all_students', NULL, NULL, 'workflows', 'false', 'HRM can access all students from reporting pages', '', '', NULL, 1, 0),
(674, 1, 17, 'send_all_emails_to', NULL, NULL, 'workflows', '', 'Send all e-mails to', 'Give a list of e-mail addresses to whom *all* e-mails sent from the platform will be sent. The e-mails are sent to these addresses as a visible destination.', '', NULL, 1, 0),
(675, 1, NULL, 'go_to_course_after_login', NULL, NULL, 'workflows', 'false', 'Go directly to the course after login', 'When a user is registered in one course, go directly to the course after login', '', NULL, 1, 0),
(676, 1, NULL, 'allow_users_to_create_courses', NULL, NULL, 'workflows', 'false', 'Allow non admin to create courses', 'Allow non administrators (teachers) to create new courses on the server', '', NULL, 1, 0),
(677, 1, NULL, 'allow_user_course_subscription_by_course_admin', NULL, NULL, 'workflows', 'true', 'Allow User Course Subscription By Course Admininistrator', 'Activate this option will allow course administrator to subscribe users inside a course', '', NULL, 1, 0),
(678, 1, NULL, 'teacher_can_select_course_template', NULL, NULL, 'workflows', 'true', 'Teacher can select a course as template', 'Allow pick a course as template for the new course that teacher is creating', '', NULL, 1, 0),
(679, 1, NULL, 'disabled_edit_session_coaches_course_editing_course', NULL, NULL, 'workflows', 'false', 'Disable the ability to edit course coaches', 'When disabled, admins do not have a link to quickly assign coaches to session-courses on the course edition page.', '', NULL, 1, 0),
(680, 1, NULL, 'course_visibility_change_only_admin', NULL, NULL, 'workflows', 'false', 'Course visibility changes for admins only', 'Remove the possibility for non-admins to change the course visibility. Visibility can be an issue when there are too many teachers to control directly. Forcing visibilities allows the organization to better manage courses catalogues.', '', NULL, 1, 0),
(681, 1, NULL, 'multiple_url_hide_disabled_settings', NULL, NULL, 'workflows', 'false', 'Hide disabled settings in sub-URLs', 'Set to yes to hide settings completely in a sub-URL if the setting is disabled in the main URL (where the access_url_changeable field = 0)', '', NULL, 1, 0),
(682, 1, NULL, 'gamification_mode', NULL, NULL, 'workflows', '', 'Gamification mode', 'Activate the stars achievement in learning paths', '', NULL, 1, 0),
(683, 1, NULL, 'load_term_conditions_section', NULL, NULL, 'workflows', 'login', 'Load term conditions section', 'The legal agreement will appear during the login or when enter to a course.', '', NULL, 1, 0),
(684, 1, 18, 'update_student_expiration_x_date', NULL, NULL, 'workflows', '', 'Set expiration date on first login', 'Array defining the \'days\' and \'months\' to set the account expiration date when the user first logs in.', '', NULL, 1, 0),
(685, 1, 19, 'user_number_of_days_for_default_expiration_date_per_role', NULL, NULL, 'workflows', '', 'Default expiration days by role', 'An array of role => number which represents the number of days an account has before expiration, depending on the role.', '', NULL, 1, 0),
(686, 1, NULL, 'user_edition_extra_field_to_check', NULL, NULL, 'workflows', 'ExtrafieldLabel', 'Set an extra field as trigger for registration as ex-learner', 'Give an extra field label here. If this extra field is updated for any user, a process is triggered to check the access to this user to courses with the same given extra field.', '', NULL, 1, 0),
(687, 1, NULL, 'allow_working_time_edition', NULL, NULL, 'workflows', 'false', 'Enable edition of course work time', 'Enable this feature to let teachers manually update the time spent in the course by learners.', '', NULL, 1, 0),
(688, 1, NULL, 'disable_user_conditions_sender_id', NULL, NULL, 'workflows', '0', 'Internal ID of the user used to send disabled account notifications', 'Avoid being too personal with users by using a \'bot\' account to send e-mails to users when their account is disabled for some reason.', '', NULL, 1, 0),
(689, 1, NULL, 'redirect_index_to_url_for_logged_users', NULL, NULL, 'workflows', '', 'Redirect index.php to given URL for authenticated users', 'If you do not want to use the index page (announcements, popular courses, etc), you can define here the script (from the document root) where users will be redirected when trying to load the index.', '', NULL, 1, 0),
(690, 1, NULL, 'default_menu_entry_for_course_or_session', NULL, NULL, 'workflows', 'my_courses', 'Default menu entry for courses', 'Define the default sub-elements of the \'Courses\' entry to display if user is not registered to any course nor session.', '', NULL, 1, 0),
(691, 1, NULL, 'session_admin_user_subscription_search_extra_field_to_search', NULL, NULL, 'workflows', '', 'Extra user field used to search and name sessions', 'This setting defines the extra user field key (e.g., \"company\") that will be used to search for users and to define the name of the session when registering students from /admin-dashboard/register.', '', NULL, 1, 0),
(692, 1, NULL, 'disable_change_user_visibility_for_public_courses', NULL, NULL, 'privacy', 'true', 'Disable making tool users visible in public courses', 'Avoid anyone making the \'users\' tool visible in a public course.', '', NULL, 1, 0),
(693, 1, NULL, 'disable_gdpr', NULL, NULL, 'privacy', 'true', 'Disable GDPR features', 'If you already manage your personal data protection declaration to users elsewhere, you can safely disable this feature.', '', NULL, 1, 0),
(694, 1, NULL, 'data_protection_officer_name', NULL, NULL, 'privacy', '', 'Data protection officer name', '', '', NULL, 1, 0),
(695, 1, NULL, 'data_protection_officer_role', NULL, NULL, 'privacy', '', 'Data protection officer role', '', '', NULL, 1, 0),
(696, 1, NULL, 'data_protection_officer_email', NULL, NULL, 'privacy', '', 'Data protection officer e-mail address', '', '', NULL, 1, 0),
(697, 1, 50, 'hide_user_field_from_list', NULL, NULL, 'privacy', '', 'Hide fields from users list in course', 'By default, we show all data from users in the users tool in the course. This array allows you to specify which fields you do not want to display. Only affects main fields (not extra fields).', '', NULL, 1, 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `settings_options`
--

CREATE TABLE `settings_options` (
  `id` int(11) NOT NULL,
  `variable` varchar(190) NOT NULL,
  `value` varchar(190) DEFAULT NULL,
  `display_text` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `settings_value_template`
--

CREATE TABLE `settings_value_template` (
  `id` int(10) UNSIGNED NOT NULL,
  `variable` varchar(190) NOT NULL,
  `description` longtext DEFAULT NULL,
  `json_example` longtext DEFAULT NULL,
  `created_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `settings_value_template`
--

INSERT INTO `settings_value_template` (`id`, `variable`, `description`, `json_example`, `created_at`, `updated_at`) VALUES
(1, 'community_managers_user_list', NULL, '{\n    \"users\": [\n        1\n    ]\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(2, 'my_progress_course_tools_order', NULL, '{\n    \"order\": [\n        \"quizzes\",\n        \"learning_paths\",\n        \"skills\"\n    ]\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(3, 'show_tabs_per_role', NULL, '{\n    \"SESSIONADMIN\": [\n        \"session_admin\",\n        \"my_courses\"\n    ],\n    \"ADMIN\": [\n        \"platform_administration\"\n    ]\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(4, 'table_row_list', NULL, '{\n    \"options\": [\n        50,\n        100,\n        200,\n        500\n    ]\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(5, 'only_show_course_from_selected_category', NULL, '[\n    \"Cat1\",\n    \"Cat2\"\n]', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(6, 'course_catalog_settings', NULL, '{\n    \"link_settings\": {\n        \"info_url\": \"course_description_popup\",\n        \"title_url\": \"course_home\",\n        \"image_url\": \"course_about\"\n    },\n    \"hide_course_title\": false,\n    \"search_by_title\": true,\n    \"redirect_after_subscription\": \"course_home\",\n    \"extra_fields_in_search_form\": [\n        \"variable1\",\n        \"variable2\"\n    ],\n    \"extra_fields_in_course_block\": [\n        \"variable3\",\n        \"variable4\"\n    ],\n    \"standard_sort_options\": {\n        \"title\": 1,\n        \"creation_date\": -1,\n        \"count_users\": -1,\n        \"point_info\\/point_average\": -1,\n        \"point_info\\/total_score\": -1,\n        \"point_info\\/users\": -1\n    },\n    \"extra_field_sort_options\": {\n        \"variable5\": -1,\n        \"variable6\": 1\n    },\n    \"pre_filter_on_language\": 1\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(7, 'session_catalog_settings', NULL, '{\n    \"by_title\": true,\n    \"by_date\": true,\n    \"by_tag\": true,\n    \"show_session_info\": true,\n    \"show_session_date\": true\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(8, 'push_notification_settings', NULL, '{\n    \"gotify_url\": \"http:\\/\\/localhost:8080\",\n    \"gotify_token\": \"A0yWWfe_8YRLv_B\",\n    \"enabled\": true,\n    \"vapid_public_key\": \"BNg54MTyDZSdyFq99EmppT606jKVDS5o7jGVxMLW3Qir937A98sxtrK4VMt1ddNlK93MUenK0kM3aiAMu9HRcjQ=\",\n    \"vapid_private_key\": \"UgS5-xSneOcSyNJVq4c9wmEGaCoE1Y8oh-7ZGXPgs8o\"\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(9, 'user_status_show_option', NULL, '{\n    \"COURSEMANAGER\": true,\n    \"STUDENT\": true,\n    \"DRH\": false,\n    \"SESSIONADMIN\": false,\n    \"STUDENT_BOSS\": false,\n    \"INVITEE\": false\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(10, 'agenda_legend', NULL, '{\n    \"red\": \"red caption\",\n    \"#f0f\": \"another caption\"\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(11, 'agenda_colors', NULL, '{\n    \"platform\": \"red\",\n    \"course\": \"#458B00\",\n    \"group\": \"#A0522D\",\n    \"session\": \"#00496D\",\n    \"other_session\": \"#999\",\n    \"personal\": \"steel blue\",\n    \"student_publication\": \"#FF8C00\"\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(12, 'agenda_on_hover_info', NULL, '{\n    \"options\": {\n        \"comment\": true,\n        \"description\": true\n    }\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(13, 'fullcalendar_settings', NULL, '{\n    \"settings\": {\n        \"businessHours\": {\n            \"dow\": [\n                0,\n                1,\n                2,\n                3,\n                4\n            ],\n            \"start\": \"10:00\",\n            \"end\": \"18:00\"\n        },\n        \"firstDay\": 0\n    }\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(14, 'user_status_option_show_only_for_admin', NULL, '{\n    \"COURSEMANAGER\": false,\n    \"STUDENT\": false,\n    \"DRH\": false,\n    \"SESSIONADMIN\": true,\n    \"STUDENT_BOSS\": false,\n    \"INVITEE\": false\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(15, 'ai_providers', NULL, '{\n    \"openai\": {\n        \"url\": \"https:\\/\\/api.openai.com\\/v1\\/chat\\/completions\",\n        \"api_key\": \"your-key\",\n        \"model\": \"gpt-4o\",\n        \"temperature\": 0.7,\n        \"organization_id\": \"org123\",\n        \"monthly_token_limit\": 10000\n    },\n    \"deepseek\": {\n        \"url\": \"https:\\/\\/api.deepseek.com\\/chat\\/completions\",\n        \"api_key\": \"your-key\",\n        \"model\": \"deepseek-chat\",\n        \"temperature\": 0.7,\n        \"organization_id\": \"org456\",\n        \"monthly_token_limit\": 5000\n    }\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(16, 'compilatio_tool', NULL, '{\n    \"settings\": {\n        \"key\": \"\",\n        \"soap_url\": \"\",\n        \"proxy_host\": \"\",\n        \"proxy_port\": \"\",\n        \"max_filesize\": \"\",\n        \"transport_mode\": \"\",\n        \"wget_uri\": \"\",\n        \"wget_login\": \"\",\n        \"wget_password\": \"\"\n    }\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(17, 'send_all_emails_to', NULL, '{\n    \"emails\": [\n        \"admin1@example.com\",\n        \"admin2@example.com\"\n    ]\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(18, 'update_student_expiration_x_date', NULL, '{\n    \"days\": 0,\n    \"months\": 0\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(19, 'user_number_of_days_for_default_expiration_date_per_role', NULL, '{\n    \"COURSEMANAGER\": 365,\n    \"STUDENT\": 31,\n    \"DRH\": 31,\n    \"SESSIONADMIN\": 60,\n    \"STUDENT_BOSS\": 60,\n    \"INVITEE\": 31\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(20, 'course_log_hide_columns', NULL, '{\n    \"columns\": [\n        1,\n        9\n    ]\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(21, 'course_student_info', NULL, '{\n    \"score\": false,\n    \"progress\": false,\n    \"certificate\": false\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(22, 'course_log_default_extra_fields', NULL, '{\n    \"extra_fields\": [\n        \"office_address\",\n        \"office_phone_extension\"\n    ]\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(23, 'course_creation_by_teacher_extra_fields_to_show', NULL, '{\n    \"fields\": [\n        \"ExtrafieldLabel1\",\n        \"ExtrafieldLabel2\"\n    ]\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(24, 'course_creation_form_set_extra_fields_mandatory', NULL, '{\n    \"fields\": [\n        \"fieldLabel1\",\n        \"fieldLabel2\"\n    ]\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(25, 'course_configuration_tool_extra_fields_to_show_and_edit', NULL, '{\n    \"fields\": [\n        \"ExtrafieldLabel1\",\n        \"ExtrafieldLabel2\"\n    ]\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(26, 'course_creation_user_course_extra_field_relation_to_prefill', NULL, '{\n    \"fields\": {\n        \"CourseExtrafieldLabel1\": \"UserExtrafieldLabel1\",\n        \"CourseExtrafieldLabel2\": \"UserExtrafieldLabel2\"\n    }\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(27, 'video_features', NULL, '{\n    \"features\": [\n        \"speed\"\n    ]\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(28, 'documents_custom_cloud_link_list', NULL, '{\n    \"links\": [\n        \"example.com\",\n        \"example2.com\"\n    ]\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(29, 'editor_driver_list', NULL, '[\n    \"PersonalDriver\",\n    \"CourseDriver\"\n]', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(30, 'editor_settings', NULL, '{\n    \"config\": {\n        \"youtube_responsive\": true,\n        \"image_responsive\": true\n    }\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(31, 'video_player_renderers', NULL, '{\n    \"renderers\": [\n        \"dailymotion\",\n        \"facebook\",\n        \"twitch\",\n        \"vimeo\",\n        \"youtube\"\n    ]\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(32, 'exercise_additional_teacher_modify_actions', NULL, '{\n    \"myplugin\": [\n        \"MyPlugin\",\n        \"urlGeneratorCallback\"\n    ]\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(33, 'quiz_image_zoom', NULL, '{\n    \"options\": {\n        \"zoomWindowWidth\": 400,\n        \"zoomWindowHeight\": 400\n    }\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(34, 'add_exercise_best_attempt_in_report', NULL, '{\n    \"courses\": {\n        \"ABC\": [\n            88,\n            89\n        ]\n    }\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(35, 'exercise_category_report_user_extra_fields', NULL, '{\n    \"fields\": [\n        \"skype\",\n        \"rssfeeds\"\n    ]\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(36, 'score_grade_model', NULL, '{\n    \"models\": [\n        {\n            \"id\": 1,\n            \"variable\": \"ThisIsMyModel\",\n            \"display_score_name\": 0,\n            \"score_list\": [\n                {\n                    \"variable\": \"VeryBad\",\n                    \"css_class\": \"btn-danger\",\n                    \"min\": 0,\n                    \"max\": 20,\n                    \"score_to_qualify\": 0\n                },\n                {\n                    \"variable\": \"Bad\",\n                    \"css_class\": \"btn-danger\",\n                    \"min\": 21,\n                    \"max\": 50,\n                    \"score_to_qualify\": 25\n                },\n                {\n                    \"variable\": \"Good\",\n                    \"css_class\": \"btn-warning\",\n                    \"min\": 51,\n                    \"max\": 70,\n                    \"score_to_qualify\": 60\n                },\n                {\n                    \"variable\": \"VeryGood\",\n                    \"css_class\": \"btn-success\",\n                    \"min\": 71,\n                    \"max\": 100,\n                    \"score_to_qualify\": 100\n                }\n            ]\n        }\n    ]\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(37, 'exercise_embeddable_extra_types', NULL, '{\n    \"types\": []\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(38, 'gradebook_dependency_mandatory_courses', NULL, '{\n    \"courses\": [\n        1,\n        2\n    ]\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(39, 'gradebook_badge_sidebar', NULL, '{\n    \"gradebooks\": [\n        1,\n        2,\n        3\n    ]\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(40, 'gradebook_flatview_extrafields_columns', NULL, '{\n    \"variables\": []\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(41, 'gradebook_pdf_export_settings', NULL, '{\n    \"hide_score_weight\": true,\n    \"hide_feedback_textarea\": true\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(42, 'gradebook_display_extra_stats', NULL, '{\n    \"columns\": [\n        1,\n        2,\n        3\n    ]\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(43, 'lp_subscription_settings', NULL, '{\n    \"options\": {\n        \"allow_add_users_to_lp\": true,\n        \"allow_add_users_to_lp_category\": true\n    }\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(44, 'lp_view_settings', NULL, '{\n    \"display\": {\n        \"show_reporting_icon\": true,\n        \"hide_lp_arrow_navigation\": false,\n        \"show_toolbar_by_default\": false,\n        \"navigation_in_the_middle\": false\n    }\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(45, 'download_files_after_all_lp_finished', NULL, '{\n    \"courses\": {\n        \"ABC\": [\n            1,\n            100\n        ]\n    }\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(46, 'cron_notification_help_desk', NULL, '{\n    \"emails\": [\n        \"email@example.com\",\n        \"email2@example.com\"\n    ]\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(47, 'notifications_extended_footer_message', NULL, '{\n    \"english\": {\n        \"paragraphs\": [\n            \"Change or delete this paragraph or add another one\"\n        ]\n    }\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(48, 'mailer_dkim', NULL, '{\n    \"enable\": 1,\n    \"selector\": \"chamilo\",\n    \"domain\": \"mydomain.com\",\n    \"private_key_string\": \"\",\n    \"private_key\": \"\",\n    \"passphrase\": \"\"\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(49, 'mailer_xoauth2', NULL, '{\n    \"method\": false,\n    \"url_authorize\": \"https:\\/\\/provider.example\\/oauth2\\/auth\",\n    \"url_access_token\": \"https:\\/\\/provider.example\\/token\",\n    \"url_resource_owner_details\": \"https:\\/\\/provider.example\\/userinfo\",\n    \"scopes\": \"\",\n    \"client_id\": \"\",\n    \"client_secret\": \"\",\n    \"refresh_token\": \"\"\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(50, 'hide_user_field_from_list', NULL, '{\n    \"fields\": [\n        \"username\"\n    ]\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(51, 'send_notification_when_user_added', NULL, '{\n    \"admins\": [\n        1\n    ]\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(52, 'show_conditions_to_user', NULL, '{\n    \"conditions\": [\n        {\n            \"variable\": \"gdpr\",\n            \"display_text\": \"GDPRTitle\",\n            \"text_area\": \"GDPRTextArea\"\n        },\n        {\n            \"variable\": \"my_terms\",\n            \"display_text\": \"My test conditions\",\n            \"text_area\": \"This is a long text area, with lot of terms and conditions ... \"\n        }\n    ]\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(53, 'profile_fields_visibility', NULL, '{\n    \"options\": {\n        \"vcard\": false,\n        \"firstname\": true,\n        \"lastname\": true,\n        \"photo\": true,\n        \"email\": false,\n        \"language\": true,\n        \"chat\": true,\n        \"terms_ville\": true,\n        \"terms_datedenaissance\": true,\n        \"terms_paysresidence\": false,\n        \"filiere_user\": true,\n        \"terms_villedustage\": true,\n        \"hobbies\": true,\n        \"langue_cible\": true\n    }\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(54, 'user_import_settings', NULL, '{\n    \"options\": {\n        \"send_mail_default_option\": \"1\"\n    }\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(55, 'user_search_on_extra_fields', NULL, '{\n    \"extra_fields\": [\n        \"variable1\",\n        \"variable2\"\n    ]\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(56, 'allow_social_map_fields', NULL, '{\n    \"fields\": [\n        \"terms_villedustage\",\n        \"terms_ville\"\n    ]\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(57, 'extldap_config', NULL, '{\n    \"host\": \"\",\n    \"port\": \"\"\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(58, 'required_extra_fields_in_inscription', NULL, '{\n    \"options\": [\n        \"terms_adresse\",\n        \"terms_codepostal\",\n        \"terms_ville\",\n        \"terms_paysresidence\",\n        \"terms_datedenaissance\",\n        \"terms_genre\",\n        \"filiere_user\",\n        \"terms_formation_niveau\",\n        \"langue_cible\"\n    ]\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(59, 'allow_fields_inscription', NULL, '{\n    \"fields\": [\n        \"lastname\",\n        \"firstname\",\n        \"email\",\n        \"language\",\n        \"phone\",\n        \"address\"\n    ],\n    \"extra_fields\": [\n        \"terms_nationalite\",\n        \"terms_numeroderue\",\n        \"terms_nomderue\",\n        \"terms_codepostal\",\n        \"terms_paysresidence\",\n        \"terms_ville\",\n        \"terms_datedenaissance\",\n        \"terms_genre\",\n        \"filiere_user\",\n        \"terms_formation_niveau\",\n        \"terms_villedustage\",\n        \"terms_adresse\",\n        \"gdpr\",\n        \"langue_cible\"\n    ]\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(60, 'redirect_after_login', NULL, '{\n    \"COURSEMANAGER\": \"\",\n    \"STUDENT\": \"\",\n    \"DRH\": \"\",\n    \"SESSIONADMIN\": \"admin-dashboard\",\n    \"STUDENT_BOSS\": \"\",\n    \"INVITEE\": \"\",\n    \"ADMIN\": \"admin-dashboard\"\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(61, 'proxy_settings', NULL, '{\n    \"stream_context_create\": {\n        \"http\": {\n            \"proxy\": \"tcp:\\/\\/example.com:8080\",\n            \"request_fulluri\": true\n        }\n    },\n    \"curl_setopt_array\": {\n        \"CURLOPT_PROXY\": \"http:\\/\\/example.com\",\n        \"CURLOPT_PROXYPORT\": \"8080\"\n    }\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(62, 'password_requirements', NULL, '{\n    \"min\": {\n        \"lowercase\": 2,\n        \"uppercase\": 2,\n        \"numeric\": 2,\n        \"length\": 8\n    }\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(63, 'allow_online_users_by_status', NULL, '{\n    \"status\": [\n        1,\n        5\n    ]\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(64, 'my_courses_session_order', NULL, '{\n    \"field\": \"end_date\",\n    \"order\": \"desc\"\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(65, 'session_import_settings', NULL, '{\n    \"options\": {\n        \"session_exists_default_option\": \"1\",\n        \"send_mail_default_option\": \"1\"\n    }\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(66, 'tracking_columns', NULL, '{\n    \"course_session\": {\n        \"course_title\": true,\n        \"published_exercises\": true,\n        \"new_exercises\": true,\n        \"my_average\": true,\n        \"average_exercise_result\": true,\n        \"time_spent\": true,\n        \"lp_progress\": true,\n        \"score\": true,\n        \"best_score\": true,\n        \"last_connection\": true,\n        \"details\": true\n    },\n    \"my_students_lp\": {\n        \"lp\": true,\n        \"time\": true,\n        \"best_score\": true,\n        \"latest_attempt_avg_score\": true,\n        \"progress\": true,\n        \"last_connection\": true\n    },\n    \"my_progress_lp\": {\n        \"lp\": true,\n        \"time\": true,\n        \"progress\": true,\n        \"score\": true,\n        \"best_score\": true,\n        \"last_connection\": true\n    },\n    \"my_progress_courses\": {\n        \"course_title\": true,\n        \"time_spent\": true,\n        \"progress\": true,\n        \"best_score_in_lp\": true,\n        \"best_score_not_in_lp\": true,\n        \"latest_login\": true,\n        \"details\": true\n    }\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(67, 'session_creation_user_course_extra_field_relation_to_prefill', NULL, '{\n    \"fields\": {\n        \"client\": \"client\",\n        \"region\": \"region\"\n    }\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(68, 'session_creation_form_set_extra_fields_mandatory', NULL, '{\n    \"fields\": [\n        \"client\",\n        \"region\"\n    ]\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(69, 'skill_levels_names', NULL, '{\n    \"levels\": {\n        \"1\": \"Skills\",\n        \"2\": \"Capability\",\n        \"3\": \"Dimension\"\n    }\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(70, 'hide_survey_edition', NULL, '{\n    \"codes\": []\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(71, 'survey_additional_teacher_modify_actions', NULL, '{\n    \"myplugin\": [\n        \"MyPlugin\",\n        \"urlGeneratorCallback\"\n    ]\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17'),
(72, 'ticket_project_user_roles', NULL, '{\n    \"permissions\": {\n        \"1\": [\n            17,\n            1\n        ]\n    }\n}', '2025-11-21 22:22:17', '2025-11-21 22:22:17');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `skill`
--

CREATE TABLE `skill` (
  `id` int(11) NOT NULL,
  `profile_id` int(11) DEFAULT NULL,
  `asset_id` binary(16) DEFAULT NULL COMMENT '(DC2Type:uuid)',
  `title` varchar(255) NOT NULL,
  `short_code` varchar(100) NOT NULL,
  `description` longtext NOT NULL,
  `access_url_id` int(11) NOT NULL,
  `icon` varchar(255) NOT NULL,
  `criteria` longtext DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `skill`
--

INSERT INTO `skill` (`id`, `profile_id`, `asset_id`, `title`, `short_code`, `description`, `access_url_id`, `icon`, `criteria`, `status`, `updated_at`) VALUES
(1, NULL, NULL, 'Root', 'root', '', 1, '', NULL, 1, '2025-11-21 22:22:17');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `skill_level`
--

CREATE TABLE `skill_level` (
  `id` int(11) NOT NULL,
  `profile_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `position` int(11) NOT NULL,
  `short_title` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `skill_level_profile`
--

CREATE TABLE `skill_level_profile` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `skill_profile`
--

CREATE TABLE `skill_profile` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `skill_rel_course`
--

CREATE TABLE `skill_rel_course` (
  `id` int(11) NOT NULL,
  `skill_id` int(11) DEFAULT NULL,
  `c_id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `skill_rel_gradebook`
--

CREATE TABLE `skill_rel_gradebook` (
  `id` int(11) NOT NULL,
  `skill_id` int(11) DEFAULT NULL,
  `gradebook_id` int(11) DEFAULT NULL,
  `type` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `skill_rel_item`
--

CREATE TABLE `skill_rel_item` (
  `id` int(11) NOT NULL,
  `skill_id` int(11) DEFAULT NULL,
  `item_type` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `obtain_conditions` varchar(255) DEFAULT NULL,
  `requires_validation` tinyint(1) NOT NULL,
  `is_real` tinyint(1) NOT NULL,
  `c_id` int(11) DEFAULT NULL,
  `session_id` int(11) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `updated_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `skill_rel_item_rel_user`
--

CREATE TABLE `skill_rel_item_rel_user` (
  `id` int(11) NOT NULL,
  `skill_rel_item_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `result_id` int(11) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `updated_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `skill_rel_profile`
--

CREATE TABLE `skill_rel_profile` (
  `id` int(11) NOT NULL,
  `skill_id` int(11) DEFAULT NULL,
  `profile_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `skill_rel_skill`
--

CREATE TABLE `skill_rel_skill` (
  `id` int(11) NOT NULL,
  `skill_id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `relation_type` int(11) NOT NULL,
  `level` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `skill_rel_user`
--

CREATE TABLE `skill_rel_user` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `skill_id` int(11) NOT NULL,
  `course_id` int(11) DEFAULT NULL,
  `session_id` int(11) DEFAULT NULL,
  `acquired_level` int(11) DEFAULT NULL,
  `acquired_skill_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `validation_status` int(11) NOT NULL,
  `argumentation` longtext NOT NULL,
  `argumentation_author_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `skill_rel_user_comment`
--

CREATE TABLE `skill_rel_user_comment` (
  `id` int(11) NOT NULL,
  `skill_rel_user_id` int(11) DEFAULT NULL,
  `feedback_giver_id` int(11) DEFAULT NULL,
  `feedback_text` longtext NOT NULL,
  `feedback_value` int(11) DEFAULT 1,
  `feedback_datetime` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `social_post`
--

CREATE TABLE `social_post` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `user_receiver_id` int(11) DEFAULT NULL,
  `group_receiver_id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `subject` longtext DEFAULT NULL,
  `content` longtext NOT NULL,
  `type` smallint(6) NOT NULL,
  `status` smallint(6) NOT NULL,
  `send_date` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `social_post`
--

INSERT INTO `social_post` (`id`, `sender_id`, `user_receiver_id`, `group_receiver_id`, `parent_id`, `subject`, `content`, `type`, `status`, `send_date`, `updated_at`) VALUES
(1, 1, NULL, NULL, NULL, NULL, '<div class=\"tiny-content\"><p>sasassaas</p></div>', 1, 1, '2025-11-22 01:13:24', '2025-11-22 01:13:24'),
(2, 1, NULL, NULL, NULL, NULL, '<div class=\"tiny-content\"><p>asasasasas</p></div>', 1, 1, '2025-11-22 01:13:33', '2025-11-22 01:13:33'),
(3, 1, NULL, NULL, NULL, NULL, '<div class=\"tiny-content\"><p>xyxyxyxyyx</p></div>', 4, 1, '2025-11-22 01:14:21', '2025-11-22 01:14:21'),
(4, 4, NULL, NULL, 3, NULL, 'yxyxy', 2, 1, '2025-11-22 01:15:00', '2025-11-22 01:15:00');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `social_post_attachments`
--

CREATE TABLE `social_post_attachments` (
  `id` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `social_post_id` int(11) DEFAULT NULL,
  `path` varchar(255) NOT NULL,
  `filename` longtext NOT NULL,
  `size` int(11) NOT NULL,
  `sys_insert_user_id` int(11) NOT NULL,
  `sys_insert_datetime` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `sys_lastedit_user_id` int(11) DEFAULT NULL,
  `sys_lastedit_datetime` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `social_post_feedback`
--

CREATE TABLE `social_post_feedback` (
  `id` int(11) NOT NULL,
  `social_post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `liked` tinyint(1) NOT NULL DEFAULT 0,
  `disliked` tinyint(1) NOT NULL DEFAULT 0,
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `specific_field`
--

CREATE TABLE `specific_field` (
  `id` int(11) NOT NULL,
  `code` varchar(1) NOT NULL,
  `title` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `specific_field_values`
--

CREATE TABLE `specific_field_values` (
  `id` int(11) NOT NULL,
  `course_code` varchar(40) NOT NULL,
  `tool_id` varchar(100) NOT NULL,
  `ref_id` int(11) NOT NULL,
  `field_id` int(11) NOT NULL,
  `value` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `system_template`
--

CREATE TABLE `system_template` (
  `id` int(11) NOT NULL,
  `image_id` binary(16) DEFAULT NULL COMMENT '(DC2Type:uuid)',
  `title` varchar(250) NOT NULL,
  `comment` longtext NOT NULL,
  `content` longtext NOT NULL,
  `language` varchar(40) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `sys_announcement`
--

CREATE TABLE `sys_announcement` (
  `id` int(11) NOT NULL,
  `access_url_id` int(11) DEFAULT NULL,
  `career_id` int(11) DEFAULT NULL,
  `promotion_id` int(11) DEFAULT NULL,
  `date_start` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `date_end` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `title` varchar(250) NOT NULL,
  `content` longtext NOT NULL,
  `lang` varchar(70) DEFAULT NULL,
  `roles` longtext NOT NULL COMMENT '(DC2Type:array)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `sys_announcement`
--

INSERT INTO `sys_announcement` (`id`, `access_url_id`, `career_id`, `promotion_id`, `date_start`, `date_end`, `title`, `content`, `lang`, `roles`) VALUES
(1, 1, NULL, NULL, '2025-11-21 22:22:00', '2025-12-21 22:22:00', 'Welcome to Bro World', '<p><img src=\"/img/document/images/mr_chamilo/svg/collaborative.svg\" width=\"320\" height=\"340\" /></p>\r\n<p>If this is your first time using Chamilo, make sure you check the side menu to find your way through its many features. If you need help, you will find <a href=\"https://docs.chamilo.org\">our official docs</a> can help for standard documentation, while our <a href=\"https://github.com/chamilo/chamilo-lms/discussions\">online forum</a> can help share ideas and find answers from other Chamilo users.</p>', '', 'a:1:{i:0;s:14:\"ROLE_ANONYMOUS\";}');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `tag`
--

CREATE TABLE `tag` (
  `id` int(11) NOT NULL,
  `field_id` int(11) DEFAULT NULL,
  `tag` varchar(255) NOT NULL,
  `count` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `tag`
--

INSERT INTO `tag` (`id`, `field_id`, `tag`, `count`) VALUES
(1, 4, '', 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `templates`
--

CREATE TABLE `templates` (
  `id` int(11) NOT NULL,
  `c_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `image_id` binary(16) DEFAULT NULL COMMENT '(DC2Type:uuid)',
  `title` varchar(100) NOT NULL,
  `description` varchar(250) NOT NULL,
  `ref_doc` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `third_party`
--

CREATE TABLE `third_party` (
  `id` int(11) NOT NULL,
  `title` longtext NOT NULL,
  `description` longtext DEFAULT NULL,
  `address` longtext DEFAULT NULL,
  `website` longtext DEFAULT NULL,
  `data_exchange_party` tinyint(1) NOT NULL,
  `recruiter` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `third_party_data_exchange`
--

CREATE TABLE `third_party_data_exchange` (
  `id` int(11) NOT NULL,
  `third_party_id` int(11) DEFAULT NULL,
  `sent_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `description` longtext DEFAULT NULL,
  `all_users` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `third_party_data_exchange_user`
--

CREATE TABLE `third_party_data_exchange_user` (
  `id` int(11) NOT NULL,
  `third_party_data_exchange_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `ticket_assigned_log`
--

CREATE TABLE `ticket_assigned_log` (
  `id` int(11) NOT NULL,
  `ticket_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `sys_insert_user_id` int(11) NOT NULL,
  `assigned_date` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `ticket_category`
--

CREATE TABLE `ticket_category` (
  `id` int(11) NOT NULL,
  `project_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext DEFAULT NULL,
  `total_tickets` int(11) NOT NULL,
  `course_required` tinyint(1) NOT NULL,
  `sys_insert_user_id` int(11) NOT NULL,
  `sys_insert_datetime` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `sys_lastedit_user_id` int(11) DEFAULT NULL,
  `sys_lastedit_datetime` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `ticket_category`
--

INSERT INTO `ticket_category` (`id`, `project_id`, `title`, `description`, `total_tickets`, `course_required`, `sys_insert_user_id`, `sys_insert_datetime`, `sys_lastedit_user_id`, `sys_lastedit_datetime`) VALUES
(1, 1, 'Enrollment', 'Tickets about enrollment', 0, 0, 1, '2025-11-21 22:22:18', NULL, NULL),
(2, 1, 'General information', 'Tickets about general information', 0, 0, 1, '2025-11-21 22:22:18', NULL, NULL),
(3, 1, 'Requests and paperwork', 'Tickets about requests and paperwork', 0, 0, 1, '2025-11-21 22:22:18', NULL, NULL),
(4, 1, 'Academic Incidents', 'Tickets about academic incidents, like exams, practices, tasks, etc.', 0, 0, 1, '2025-11-21 22:22:18', NULL, NULL),
(5, 1, 'Virtual campus', 'Tickets about virtual campus', 0, 0, 1, '2025-11-21 22:22:18', NULL, NULL),
(6, 1, 'Online evaluation', 'Tickets about online evaluation', 0, 1, 1, '2025-11-21 22:22:18', NULL, NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `ticket_category_rel_user`
--

CREATE TABLE `ticket_category_rel_user` (
  `id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `ticket_message`
--

CREATE TABLE `ticket_message` (
  `id` int(11) NOT NULL,
  `ticket_id` int(11) DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `message` longtext DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `ip_address` varchar(255) NOT NULL,
  `sys_insert_user_id` int(11) NOT NULL,
  `sys_lastedit_user_id` int(11) DEFAULT NULL,
  `sys_insert_datetime` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `sys_lastedit_datetime` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `ticket_message_attachments`
--

CREATE TABLE `ticket_message_attachments` (
  `id` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `ticket_id` int(11) DEFAULT NULL,
  `message_id` int(11) DEFAULT NULL,
  `path` varchar(255) NOT NULL,
  `filename` longtext NOT NULL,
  `size` int(11) NOT NULL,
  `sys_insert_user_id` int(11) NOT NULL,
  `sys_insert_datetime` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `sys_lastedit_user_id` int(11) DEFAULT NULL,
  `sys_lastedit_datetime` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `ticket_priority`
--

CREATE TABLE `ticket_priority` (
  `id` int(11) NOT NULL,
  `access_url_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `description` longtext DEFAULT NULL,
  `color` varchar(255) NOT NULL,
  `urgency` varchar(255) NOT NULL,
  `sys_insert_user_id` int(11) NOT NULL,
  `sys_insert_datetime` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `sys_lastedit_user_id` int(11) DEFAULT NULL,
  `sys_lastedit_datetime` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `ticket_priority`
--

INSERT INTO `ticket_priority` (`id`, `access_url_id`, `title`, `code`, `description`, `color`, `urgency`, `sys_insert_user_id`, `sys_insert_datetime`, `sys_lastedit_user_id`, `sys_lastedit_datetime`) VALUES
(1, NULL, 'Normal', '1', NULL, '', '', 1, '2025-11-21 22:22:18', NULL, NULL),
(2, NULL, 'High', '2', NULL, '', '', 1, '2025-11-21 22:22:18', NULL, NULL),
(3, NULL, 'Low', '3', NULL, '', '', 1, '2025-11-21 22:22:18', NULL, NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `ticket_project`
--

CREATE TABLE `ticket_project` (
  `id` int(11) NOT NULL,
  `access_url_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `other_area` int(11) DEFAULT NULL,
  `sys_insert_user_id` int(11) NOT NULL,
  `sys_insert_datetime` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `sys_lastedit_user_id` int(11) DEFAULT NULL,
  `sys_lastedit_datetime` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `ticket_project`
--

INSERT INTO `ticket_project` (`id`, `access_url_id`, `title`, `description`, `email`, `other_area`, `sys_insert_user_id`, `sys_insert_datetime`, `sys_lastedit_user_id`, `sys_lastedit_datetime`) VALUES
(1, NULL, 'Ticket System', NULL, NULL, NULL, 1, '2025-11-21 22:22:17', NULL, NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `ticket_rel_user`
--

CREATE TABLE `ticket_rel_user` (
  `user_id` int(11) NOT NULL,
  `ticket_id` int(11) NOT NULL,
  `notify` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `ticket_status`
--

CREATE TABLE `ticket_status` (
  `id` int(11) NOT NULL,
  `access_url_id` int(11) DEFAULT NULL,
  `code` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `ticket_status`
--

INSERT INTO `ticket_status` (`id`, `access_url_id`, `code`, `title`, `description`) VALUES
(1, NULL, '1', 'New', NULL),
(2, NULL, '2', 'Pending', NULL),
(3, NULL, '3', 'Unconfirmed', NULL),
(4, NULL, '4', 'Closed', NULL),
(5, NULL, '5', 'Forwarded', NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `ticket_ticket`
--

CREATE TABLE `ticket_ticket` (
  `id` int(11) NOT NULL,
  `project_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `priority_id` int(11) DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL,
  `session_id` int(11) DEFAULT NULL,
  `assigned_last_user` int(11) DEFAULT NULL,
  `status_id` int(11) DEFAULT NULL,
  `access_url_id` int(11) DEFAULT NULL,
  `code` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` longtext DEFAULT NULL,
  `personal_email` varchar(255) NOT NULL,
  `total_messages` int(11) NOT NULL,
  `keyword` varchar(255) DEFAULT NULL,
  `source` varchar(255) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `end_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `sys_insert_user_id` int(11) NOT NULL,
  `sys_insert_datetime` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `sys_lastedit_user_id` int(11) DEFAULT NULL,
  `sys_lastedit_datetime` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `exercise_id` int(11) DEFAULT NULL,
  `lp_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `tool`
--

CREATE TABLE `tool` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `tool`
--

INSERT INTO `tool` (`id`, `title`) VALUES
(1, 'agenda'),
(2, 'announcement'),
(3, 'asset'),
(5, 'attendance'),
(38, 'Bbb'),
(6, 'blog'),
(7, 'chat'),
(8, 'course_description'),
(9, 'course_homepage'),
(23, 'course_maintenance'),
(10, 'course_progress'),
(30, 'course_setting'),
(11, 'course_tool'),
(12, 'CustomCertificate'),
(13, 'document'),
(14, 'dropbox'),
(16, 'forum'),
(17, 'global'),
(18, 'glossary'),
(19, 'gradebook'),
(20, 'group'),
(21, 'learnpath'),
(22, 'link'),
(24, 'member'),
(25, 'Mobidico'),
(26, 'notebook'),
(27, 'NotebookTeacher'),
(28, 'portfolio'),
(29, 'Positioning'),
(15, 'quiz'),
(31, 'shortcuts'),
(4, 'student_publication'),
(32, 'survey'),
(33, 'Test2Pdf'),
(34, 'tool_intro'),
(35, 'tracking'),
(36, 'user'),
(37, 'usergroup'),
(39, 'wiki'),
(40, 'Zoom');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `tool_resource_right`
--

CREATE TABLE `tool_resource_right` (
  `id` int(11) NOT NULL,
  `tool_id` int(11) DEFAULT NULL,
  `role` varchar(255) NOT NULL,
  `mask` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `track_e_access`
--

CREATE TABLE `track_e_access` (
  `access_id` int(11) NOT NULL,
  `access_user_id` int(11) DEFAULT NULL,
  `access_date` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `c_id` int(11) NOT NULL,
  `access_tool` varchar(30) DEFAULT NULL,
  `session_id` int(11) NOT NULL,
  `user_ip` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `track_e_access`
--

INSERT INTO `track_e_access` (`access_id`, `access_user_id`, `access_date`, `c_id`, `access_tool`, `session_id`, `user_ip`) VALUES
(1, 4, '2025-11-21 22:39:50', 1, 'announcement', 1, '176.6.50.232'),
(2, 4, '2025-11-21 22:39:57', 1, 'chat', 1, '176.6.50.232'),
(3, 4, '2025-11-21 22:40:49', 1, 'chat', 1, '176.6.50.232'),
(4, 1, '2025-11-21 22:41:26', 1, 'chat', 0, '176.6.50.232'),
(5, 4, '2025-11-21 22:41:57', 1, 'chat', 1, '176.6.50.232'),
(6, 4, '2025-11-21 22:42:35', 1, 'chat', 1, '176.6.50.232'),
(7, 4, '2025-11-21 22:43:12', 1, 'chat', 1, '176.6.50.232'),
(8, 1, '2025-11-22 00:21:10', 1, 'user', 0, '176.6.49.111'),
(9, 4, '2025-11-22 00:23:17', 1, 'chat', 0, '176.6.49.111'),
(10, 1, '2025-11-22 00:24:06', 1, 'chat', 0, '176.6.49.111'),
(11, 1, '2025-11-22 00:37:18', 1, 'quiz', 0, '176.6.49.111'),
(12, 1, '2025-11-22 00:39:15', 1, 'quiz', 0, '176.6.49.111'),
(13, 4, '2025-11-22 00:41:02', 1, 'quiz', 0, '176.6.49.111'),
(14, 4, '2025-11-22 00:41:55', 1, 'quiz', 0, '176.6.49.111'),
(15, 1, '2025-11-22 00:42:54', 1, 'quiz', 0, '176.6.49.111'),
(16, 1, '2025-11-22 00:57:26', 1, 'forum', 0, '176.6.49.111'),
(17, 4, '2025-11-22 01:00:27', 1, 'forum', 0, '176.6.49.111');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `track_e_access_complete`
--

CREATE TABLE `track_e_access_complete` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date_reg` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `tool` varchar(255) NOT NULL,
  `tool_id` int(11) NOT NULL,
  `tool_id_detail` int(11) NOT NULL,
  `action` varchar(255) NOT NULL,
  `action_details` varchar(255) NOT NULL,
  `current_id` int(11) NOT NULL,
  `ip_user` varchar(255) NOT NULL,
  `user_agent` varchar(255) NOT NULL,
  `session_id` int(11) NOT NULL,
  `c_id` int(11) NOT NULL,
  `ch_sid` varchar(255) NOT NULL,
  `login_as` int(11) NOT NULL,
  `info` longtext NOT NULL,
  `url` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `track_e_attempt`
--

CREATE TABLE `track_e_attempt` (
  `id` int(11) NOT NULL,
  `exe_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `question_id` int(11) NOT NULL,
  `answer` longtext NOT NULL,
  `teacher_comment` longtext NOT NULL,
  `marks` double NOT NULL,
  `position` int(11) DEFAULT NULL,
  `tms` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `filename` varchar(255) DEFAULT NULL,
  `seconds_spent` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `track_e_attempt`
--

INSERT INTO `track_e_attempt` (`id`, `exe_id`, `user_id`, `question_id`, `answer`, `teacher_comment`, `marks`, `position`, `tms`, `filename`, `seconds_spent`) VALUES
(1, 1, 4, 1, '1', '', 1, 0, '2025-11-22 00:41:21', NULL, 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `track_e_attempt_coeff`
--

CREATE TABLE `track_e_attempt_coeff` (
  `id` int(11) NOT NULL,
  `attempt_id` int(11) NOT NULL,
  `marks_coeff` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `track_e_attempt_qualify`
--

CREATE TABLE `track_e_attempt_qualify` (
  `id` int(11) NOT NULL,
  `exe_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `marks` double NOT NULL,
  `insert_date` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `author` int(11) NOT NULL,
  `teacher_comment` longtext NOT NULL,
  `session_id` int(11) NOT NULL,
  `answer` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `track_e_attempt_qualify`
--

INSERT INTO `track_e_attempt_qualify` (`id`, `exe_id`, `question_id`, `marks`, `insert_date`, `author`, `teacher_comment`, `session_id`, `answer`) VALUES
(1, 1, 1, 1, '2025-11-22 00:44:09', 1, '', 0, NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `track_e_course_access`
--

CREATE TABLE `track_e_course_access` (
  `course_access_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `c_id` int(11) NOT NULL,
  `login_course_date` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `logout_course_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `counter` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `user_ip` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `track_e_course_access`
--

INSERT INTO `track_e_course_access` (`course_access_id`, `user_id`, `c_id`, `login_course_date`, `logout_course_date`, `counter`, `session_id`, `user_ip`) VALUES
(1, 1, 1, '2025-11-21 22:28:43', '2025-11-22 00:59:16', 48, 0, '176.6.50.232'),
(2, 4, 1, '2025-11-21 22:39:14', '2025-11-22 00:55:39', 39, 1, '176.6.50.232'),
(3, 1, 1, '2025-11-22 00:14:26', '2025-11-22 01:02:22', 88, 0, '176.6.49.111'),
(4, 4, 1, '2025-11-22 00:23:08', '2025-11-22 01:01:44', 46, 0, '176.6.49.111'),
(5, 4, 1, '2025-11-22 00:55:40', '2025-11-22 01:00:00', 7, 1, '176.6.49.111');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `track_e_default`
--

CREATE TABLE `track_e_default` (
  `default_id` int(11) NOT NULL,
  `default_user_id` int(11) NOT NULL,
  `c_id` int(11) DEFAULT NULL,
  `default_date` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `default_event_type` varchar(255) NOT NULL,
  `default_value_type` varchar(255) NOT NULL,
  `default_value` longtext NOT NULL,
  `session_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `track_e_default`
--

INSERT INTO `track_e_default` (`default_id`, `default_user_id`, `c_id`, `default_date`, `default_event_type`, `default_value_type`, `default_value`, `session_id`) VALUES
(1, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_links', '6', NULL),
(2, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_links', '7', NULL),
(3, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_links', '8', NULL),
(4, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_links', '9', NULL),
(5, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_links', '10', NULL),
(6, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_links', '11', NULL),
(7, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_links', '12', NULL),
(8, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_links', '13', NULL),
(9, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_links', '14', NULL),
(10, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_links', '15', NULL),
(11, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_links', '16', NULL),
(12, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_links', '17', NULL),
(13, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_links', '18', NULL),
(14, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_links', '19', NULL),
(15, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_links', '20', NULL),
(16, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_links', '21', NULL),
(17, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_links', '22', NULL),
(18, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_links', '23', NULL),
(19, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_links', '24', NULL),
(20, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_links', '25', NULL),
(21, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_links', '26', NULL),
(22, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_links', '27', NULL),
(23, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_links', '28', NULL),
(24, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_links', '29', NULL),
(25, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_links', '30', NULL),
(26, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_links', '31', NULL),
(27, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_links', '32', NULL),
(28, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_group_categories', '33', NULL),
(29, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_files', '34', NULL),
(30, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_files', '35', NULL),
(31, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_files', '36', NULL),
(32, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_files', '37', NULL),
(33, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_files', '38', NULL),
(34, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_files', '39', NULL),
(35, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_files', '40', NULL),
(36, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_files', '41', NULL),
(37, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_files', '42', NULL),
(38, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_files', '43', NULL),
(39, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_files', '44', NULL),
(40, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_events', '45', NULL),
(41, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_links', '46', NULL),
(42, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_links', '47', NULL),
(43, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_forum_categories', '49', NULL),
(44, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_forums', '50', NULL),
(45, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_forum_threads', '51', NULL),
(46, 1, 1, '2025-11-21 22:28:42', 'creation', 'resource_type_forum_posts', '52', NULL),
(47, 1, 1, '2025-11-21 22:28:42', 'edition', 'resource_type_forum_threads', '51', NULL),
(48, 1, 1, '2025-11-21 22:28:42', 'course_created', 'course_id', 'i:1;', 0),
(49, 1, 1, '2025-11-21 22:29:06', 'visibility_change', 'resource_type_links', '32', NULL),
(50, 1, 1, '2025-11-21 22:29:08', 'visibility_change', 'resource_type_links', '32', NULL),
(51, 1, 1, '2025-11-21 22:29:11', 'visibility_change', 'resource_type_links', '26', NULL),
(52, 1, 1, '2025-11-21 22:30:52', 'creation', 'resource_type_tool_intro', '53', NULL),
(53, 1, 0, '2025-11-21 22:32:06', 'user_created', 'user_id', '4', 0),
(54, 0, 0, '2025-11-21 22:32:06', 'user_disable', 'user_id', '4', 0),
(55, 1, 0, '2025-11-21 22:36:29', 'user_updated', 'user_id', '4', 0),
(56, 1, 0, '2025-11-21 22:36:29', 'user_enable', 'user_id', '4', 0),
(57, 4, 1, '2025-11-21 22:39:57', 'creation', 'resource_type_files', '55', 1),
(58, 4, 1, '2025-11-21 22:40:11', 'creation', 'resource_type_conversations', '57', 1),
(59, 4, 1, '2025-11-21 22:40:11', 'creation', 'resource_type_conversations', '58', 1),
(60, 4, 1, '2025-11-21 22:40:11', 'creation', 'resource_type_files', '59', 1),
(61, 1, 1, '2025-11-21 22:41:45', 'creation', 'resource_type_conversations', '61', NULL),
(62, 1, 1, '2025-11-21 22:41:45', 'creation', 'resource_type_conversations', '62', NULL),
(63, 1, 1, '2025-11-21 22:41:45', 'creation', 'resource_type_files', '63', NULL),
(64, 1, 1, '2025-11-21 22:42:25', 'creation', 'resource_type_conversations', '65', NULL),
(65, 1, 1, '2025-11-21 22:42:25', 'creation', 'resource_type_conversations', '66', NULL),
(66, 1, 1, '2025-11-21 22:42:25', 'creation', 'resource_type_files', '67', NULL),
(67, 1, 1, '2025-11-22 00:22:01', 'user_subscribed', 'course_code', 'SYMFONY', 0),
(68, 1, 1, '2025-11-22 00:22:01', 'user_subscribed', 'user_object', 'a:32:{s:9:\"firstname\";s:7:\"student\";s:8:\"lastname\";s:7:\"aouinti\";s:5:\"email\";s:29:\"rami.aouinti.dourant@gmail.om\";s:31:\"complete_name_with_email_forced\";s:47:\"student aouinti (rami.aouinti.dourant@gmail.om)\";s:5:\"phone\";s:0:\"\";s:7:\"address\";N;s:13:\"official_code\";s:12:\"RAMI-AOUINTI\";s:6:\"status\";i:5;s:6:\"active\";i:1;s:12:\"auth_sources\";a:1:{i:0;s:8:\"platform\";}s:8:\"username\";s:12:\"rami-aouinti\";s:5:\"theme\";N;s:8:\"language\";N;s:6:\"locale\";s:5:\"en_US\";s:10:\"creator_id\";i:1;s:10:\"created_at\";s:19:\"2025-11-21 22:32:03\";s:10:\"hr_dept_id\";i:0;s:15:\"expiration_date\";N;s:14:\"user_is_online\";N;s:17:\"profile_completed\";N;s:2:\"id\";i:4;s:7:\"user_id\";i:4;s:16:\"has_certificates\";i:0;s:11:\"icon_status\";s:107:\"<img src=\"https://education.bro-world.org/img/icons/svg/identifier_student.svg\" width=\"22px\" height=\"22px\">\";s:18:\"icon_status_medium\";s:107:\"<img src=\"https://education.bro-world.org/img/icons/svg/identifier_student.svg\" width=\"32px\" height=\"32px\">\";s:8:\"is_admin\";b:0;s:15:\"avatar_no_query\";s:25:\"/img/icons/32/unknown.png\";s:13:\"avatar_medium\";s:30:\"/img/icons/32/unknown.png?w=64\";s:17:\"icon_status_label\";s:7:\"Learner\";s:22:\"user_is_online_in_chat\";i:0;s:11:\"profile_url\";s:59:\"https://education.bro-world.org/main/social/profile.php?u=4\";s:31:\"complete_name_with_message_link\";s:158:\"<a class=\"ajax\" href=\"https://education.bro-world.org/main/inc/ajax/user_manager.ajax.php?a=get_user_popup&amp;user_id=4\"  >student aouinti (rami-aouinti)</a>\";}', 0),
(69, 4, 1, '2025-11-22 00:23:38', 'creation', 'resource_type_conversations', '71', NULL),
(70, 4, 1, '2025-11-22 00:23:38', 'creation', 'resource_type_conversations', '72', NULL),
(71, 4, 1, '2025-11-22 00:23:38', 'creation', 'resource_type_files', '73', NULL),
(72, 1, 1, '2025-11-22 00:24:58', 'creation', 'resource_type_conversations', '75', NULL),
(73, 1, 1, '2025-11-22 00:24:58', 'creation', 'resource_type_conversations', '76', NULL),
(74, 1, 1, '2025-11-22 00:24:58', 'creation', 'resource_type_files', '77', NULL),
(75, 1, 1, '2025-11-22 00:39:37', 'creation', 'resource_type_exercises', '78', NULL),
(76, 1, 1, '2025-11-22 00:40:34', 'creation', 'resource_type_questions', '79', NULL),
(77, 1, 1, '2025-11-22 00:40:34', 'question_created', 'question_id', '1', 0),
(78, 1, 1, '2025-11-22 00:40:34', 'edition', 'resource_type_questions', '79', NULL),
(79, 1, 1, '2025-11-22 00:40:34', 'question_updated', 'question_id', '0', 0),
(80, 1, 1, '2025-11-22 00:54:20', 'creation', 'resource_type_files', '81', NULL),
(81, 1, 1, '2025-11-22 00:59:34', 'edition', 'resource_type_forums', '50', NULL),
(82, 4, 1, '2025-11-22 01:00:47', 'edition', 'resource_type_forum_threads', '51', NULL),
(83, 1, 1, '2025-11-22 01:02:16', 'edition', 'resource_type_forums', '50', NULL),
(84, 1, NULL, '2025-11-22 01:12:20', 'creation', 'resource_type_message_attachments', '83', NULL),
(85, 1, NULL, '2025-11-22 01:12:20', 'creation', 'resource_type_message_attachments', '84', NULL),
(86, 1, NULL, '2025-11-22 01:12:21', 'creation', 'resource_type_message_attachments', '85', NULL),
(87, 1, NULL, '2025-11-22 01:12:29', 'creation', 'resource_type_message_attachments', '86', NULL),
(88, 1, NULL, '2025-11-22 01:12:44', 'creation', 'resource_type_message_attachments', '87', NULL),
(89, 1, NULL, '2025-11-22 01:12:44', 'creation', 'resource_type_message_attachments', '88', NULL),
(90, 1, NULL, '2025-11-22 01:12:45', 'creation', 'resource_type_message_attachments', '89', NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `track_e_downloads`
--

CREATE TABLE `track_e_downloads` (
  `down_id` int(11) NOT NULL,
  `resource_link_id` int(11) DEFAULT NULL,
  `down_user_id` int(11) DEFAULT NULL,
  `down_date` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `down_doc_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `track_e_exercises`
--

CREATE TABLE `track_e_exercises` (
  `exe_id` int(11) NOT NULL,
  `exe_user_id` int(11) NOT NULL,
  `c_id` int(11) NOT NULL,
  `session_id` int(11) DEFAULT NULL,
  `exe_exo_id` int(11) DEFAULT NULL,
  `exe_date` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `score` double NOT NULL,
  `max_score` double NOT NULL,
  `user_ip` varchar(45) NOT NULL,
  `status` varchar(20) NOT NULL,
  `data_tracking` longtext NOT NULL,
  `start_date` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `steps_counter` smallint(6) NOT NULL,
  `orig_lp_id` int(11) NOT NULL,
  `orig_lp_item_id` int(11) NOT NULL,
  `exe_duration` int(11) NOT NULL,
  `expired_time_control` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `orig_lp_item_view_id` int(11) NOT NULL,
  `questions_to_check` longtext NOT NULL,
  `blocked_categories` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `track_e_exercises`
--

INSERT INTO `track_e_exercises` (`exe_id`, `exe_user_id`, `c_id`, `session_id`, `exe_exo_id`, `exe_date`, `score`, `max_score`, `user_ip`, `status`, `data_tracking`, `start_date`, `steps_counter`, `orig_lp_id`, `orig_lp_item_id`, `exe_duration`, `expired_time_control`, `orig_lp_item_view_id`, `questions_to_check`, `blocked_categories`) VALUES
(1, 4, 1, NULL, 1, '2025-11-22 00:41:23', 1, 1, '176.6.49.111', '', '1', '2025-11-22 00:41:15', 0, 0, 0, 6, NULL, 0, '', '');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `track_e_exercise_confirmation`
--

CREATE TABLE `track_e_exercise_confirmation` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `course_id` int(11) NOT NULL,
  `attempt_id` int(11) NOT NULL,
  `quiz_id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `confirmed` tinyint(1) NOT NULL DEFAULT 0,
  `questions_count` int(11) NOT NULL,
  `saved_answers_count` int(11) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `track_e_hotpotatoes`
--

CREATE TABLE `track_e_hotpotatoes` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `exe_user_id` int(11) DEFAULT NULL,
  `exe_date` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `c_id` int(11) NOT NULL,
  `score` smallint(6) NOT NULL,
  `max_score` smallint(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `track_e_hotspot`
--

CREATE TABLE `track_e_hotspot` (
  `hotspot_id` int(11) NOT NULL,
  `c_id` int(11) DEFAULT NULL,
  `hotspot_user_id` int(11) NOT NULL,
  `hotspot_exe_id` int(11) NOT NULL,
  `hotspot_question_id` int(11) NOT NULL,
  `hotspot_answer_id` int(11) NOT NULL,
  `hotspot_correct` tinyint(1) NOT NULL,
  `hotspot_coordinate` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `track_e_lastaccess`
--

CREATE TABLE `track_e_lastaccess` (
  `access_id` int(11) NOT NULL,
  `access_user_id` int(11) DEFAULT NULL,
  `access_date` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `c_id` int(11) NOT NULL,
  `access_tool` varchar(30) DEFAULT NULL,
  `session_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `track_e_lastaccess`
--

INSERT INTO `track_e_lastaccess` (`access_id`, `access_user_id`, `access_date`, `c_id`, `access_tool`, `session_id`) VALUES
(1, 4, '2025-11-21 22:39:50', 1, 'announcement', 1),
(2, 4, '2025-11-21 22:43:12', 1, 'chat', 1),
(3, 1, '2025-11-22 00:24:06', 1, 'chat', 0),
(4, 1, '2025-11-22 00:22:01', 1, 'user', 0),
(5, 4, '2025-11-22 00:23:17', 1, 'chat', 0),
(6, 1, '2025-11-22 00:42:54', 1, 'quiz', 0),
(7, 4, '2025-11-22 00:41:55', 1, 'quiz', 0),
(8, 1, '2025-11-22 01:02:17', 1, 'forum', 0),
(9, 4, '2025-11-22 01:01:40', 1, 'forum', 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `track_e_links`
--

CREATE TABLE `track_e_links` (
  `links_id` int(11) NOT NULL,
  `links_user_id` int(11) DEFAULT NULL,
  `links_date` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `c_id` int(11) NOT NULL,
  `links_link_id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `track_e_login`
--

CREATE TABLE `track_e_login` (
  `login_id` int(11) NOT NULL,
  `login_user_id` int(11) DEFAULT NULL,
  `login_date` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `user_ip` varchar(45) NOT NULL,
  `logout_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `track_e_login`
--

INSERT INTO `track_e_login` (`login_id`, `login_user_id`, `login_date`, `user_ip`, `logout_date`) VALUES
(1, 1, '2025-11-21 22:22:39', '176.6.50.232', NULL),
(2, 4, '2025-11-21 22:34:00', '176.6.50.232', NULL),
(3, 4, '2025-11-21 22:36:39', '176.6.50.232', NULL),
(4, 1, '2025-11-22 00:12:18', '176.6.49.111', NULL),
(5, 1, '2025-11-22 00:12:30', '176.6.49.111', NULL),
(6, 1, '2025-11-22 00:12:31', '176.6.49.111', NULL),
(7, 1, '2025-11-22 00:12:33', '176.6.49.111', NULL),
(8, 1, '2025-11-22 00:12:35', '176.6.49.111', NULL),
(9, 1, '2025-11-22 00:12:37', '176.6.49.111', NULL),
(10, 1, '2025-11-22 00:13:48', '176.6.49.111', NULL),
(11, 1, '2025-11-22 00:14:35', '176.6.49.111', NULL),
(12, 4, '2025-11-22 00:22:51', '176.6.49.111', NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `track_e_login_record`
--

CREATE TABLE `track_e_login_record` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `login_date` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `user_ip` varchar(45) NOT NULL,
  `success` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `track_e_login_record`
--

INSERT INTO `track_e_login_record` (`id`, `username`, `login_date`, `user_ip`, `success`) VALUES
(1, 'admin', '2025-11-21 22:22:39', '176.6.50.232', 1),
(2, 'rami-aouinti', '2025-11-21 22:34:00', '176.6.50.232', 1),
(3, 'rami-aouinti', '2025-11-21 22:36:39', '176.6.50.232', 1),
(4, 'admin', '2025-11-22 00:12:18', '176.6.49.111', 1),
(5, 'admin', '2025-11-22 00:12:30', '176.6.49.111', 1),
(6, 'admin', '2025-11-22 00:12:31', '176.6.49.111', 1),
(7, 'admin', '2025-11-22 00:12:33', '176.6.49.111', 1),
(8, 'admin', '2025-11-22 00:12:35', '176.6.49.111', 1),
(9, 'admin', '2025-11-22 00:12:37', '176.6.49.111', 1),
(10, 'admin', '2025-11-22 00:13:48', '176.6.49.111', 1),
(11, 'admin', '2025-11-22 00:14:35', '176.6.49.111', 1),
(12, 'rami-aouinti', '2025-11-22 00:22:51', '176.6.49.111', 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `track_e_online`
--

CREATE TABLE `track_e_online` (
  `login_id` int(11) NOT NULL,
  `login_user_id` int(11) NOT NULL,
  `login_date` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `user_ip` varchar(45) NOT NULL,
  `c_id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `access_url_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `track_e_online`
--

INSERT INTO `track_e_online` (`login_id`, `login_user_id`, `login_date`, `user_ip`, `c_id`, `session_id`, `access_url_id`) VALUES
(1, 1, '2025-11-21 22:22:39', '176.6.50.232', 0, 0, 1),
(2, 4, '2025-11-21 22:34:00', '176.6.50.232', 0, 0, 1),
(3, 4, '2025-11-21 22:36:39', '176.6.50.232', 0, 0, 1),
(4, 1, '2025-11-22 00:12:18', '176.6.49.111', 0, 0, 1),
(5, 1, '2025-11-22 00:12:30', '176.6.49.111', 0, 0, 1),
(6, 1, '2025-11-22 00:12:31', '176.6.49.111', 0, 0, 1),
(7, 1, '2025-11-22 00:12:33', '176.6.49.111', 0, 0, 1),
(8, 1, '2025-11-22 00:12:35', '176.6.49.111', 0, 0, 1),
(9, 1, '2025-11-22 00:12:37', '176.6.49.111', 0, 0, 1),
(10, 1, '2025-11-22 00:13:48', '176.6.49.111', 0, 0, 1),
(11, 1, '2025-11-22 00:14:35', '176.6.49.111', 0, 0, 1),
(12, 4, '2025-11-22 00:22:51', '176.6.49.111', 0, 0, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `track_e_uploads`
--

CREATE TABLE `track_e_uploads` (
  `upload_id` int(11) NOT NULL,
  `upload_user_id` int(11) DEFAULT NULL,
  `upload_date` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `c_id` int(11) DEFAULT NULL,
  `upload_work_id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `username` varchar(100) NOT NULL,
  `api_token` varchar(255) DEFAULT NULL,
  `firstname` varchar(64) DEFAULT NULL,
  `lastname` varchar(64) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `biography` longtext DEFAULT NULL,
  `locale` varchar(10) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username_canonical` varchar(180) NOT NULL,
  `timezone` varchar(64) NOT NULL,
  `email_canonical` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `locked` tinyint(1) NOT NULL,
  `expired` tinyint(1) NOT NULL,
  `credentials_expired` tinyint(1) NOT NULL,
  `credentials_expire_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `date_of_birth` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `expires_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `phone` varchar(64) DEFAULT NULL,
  `address` varchar(250) DEFAULT NULL,
  `salt` varchar(255) NOT NULL,
  `gender` varchar(1) DEFAULT NULL,
  `last_login` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `confirmation_token` varchar(255) DEFAULT NULL,
  `password_requested_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `roles` longtext NOT NULL COMMENT '(DC2Type:array)',
  `profile_completed` tinyint(1) DEFAULT NULL,
  `status` int(11) NOT NULL,
  `official_code` varchar(40) DEFAULT NULL,
  `picture_uri` varchar(250) DEFAULT NULL,
  `creator_id` int(11) DEFAULT NULL,
  `competences` longtext DEFAULT NULL,
  `diplomas` longtext DEFAULT NULL,
  `openarea` longtext DEFAULT NULL,
  `teach` longtext DEFAULT NULL,
  `productions` varchar(250) DEFAULT NULL,
  `expiration_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `active` int(11) NOT NULL,
  `openid` varchar(255) DEFAULT NULL,
  `theme` varchar(255) DEFAULT NULL,
  `hr_dept_id` smallint(6) DEFAULT NULL,
  `uuid` binary(16) NOT NULL COMMENT '(DC2Type:uuid)',
  `mfa_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `mfa_service` varchar(255) DEFAULT NULL,
  `mfa_secret` varchar(255) DEFAULT NULL,
  `mfa_backup_codes` longtext DEFAULT NULL,
  `mfa_last_used` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `password_updated_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `user`
--

INSERT INTO `user` (`id`, `resource_node_id`, `username`, `api_token`, `firstname`, `lastname`, `website`, `biography`, `locale`, `password`, `username_canonical`, `timezone`, `email_canonical`, `email`, `locked`, `expired`, `credentials_expired`, `credentials_expire_at`, `date_of_birth`, `expires_at`, `phone`, `address`, `salt`, `gender`, `last_login`, `confirmation_token`, `password_requested_at`, `roles`, `profile_completed`, `status`, `official_code`, `picture_uri`, `creator_id`, `competences`, `diplomas`, `openarea`, `teach`, `productions`, `expiration_date`, `active`, `openid`, `theme`, `hr_dept_id`, `uuid`, `mfa_enabled`, `mfa_service`, `mfa_secret`, `mfa_backup_codes`, `mfa_last_used`, `password_updated_at`, `created_at`, `updated_at`) VALUES
(1, 1, 'admin', NULL, 'John', 'Rami', '', '', 'en_US', '$2y$13$yEgXDkpOfNF6H5SUi/EmS.l8YBYBC4cWHlQ3qovI4Tf6vo4eNpZzq', 'admin', 'Europe/Paris', 'rami.aouinti@gmail.com', 'rami.aouinti@gmail.com', 0, 0, 0, '2025-11-21 22:22:15', NULL, '2025-11-21 22:22:15', '017635587613', NULL, 'e5523ab8709d9013b00be2780d7fce8483bce61f', NULL, '2025-11-22 00:14:35', NULL, '2025-11-21 22:22:15', 'a:2:{i:0;s:10:\"ROLE_ADMIN\";i:1;s:17:\"ROLE_GLOBAL_ADMIN\";}', NULL, 1, 'ADMIN', NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, 0xbcfaf9b6523344a8a51f0ee67d7a75d3, 0, NULL, NULL, NULL, NULL, '2025-11-21 22:56:33', '2025-11-21 22:22:15', '2025-11-22 00:14:35'),
(2, 2, 'anon', NULL, 'Anonymous', 'Joe', '', '', 'en', '$2y$13$3fD8wWrx91l7noI.dmj5hOjgmmfgXLI5XyS5s34KPJlBzGHBwYgFm', 'anon', 'Europe/Paris', 'anonymous@localhost', 'anonymous@localhost', 0, 0, 0, '2025-11-21 22:22:15', NULL, '2025-11-21 22:22:15', NULL, NULL, 'a48e7ddd25008be510aac1c72ccc8b177ddd7784', NULL, NULL, NULL, '2025-11-21 22:22:15', 'a:0:{}', NULL, 6, 'anonymous', NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, 0xb2fb8625ebb44767ab3b262ada00cd74, 0, NULL, NULL, NULL, NULL, NULL, '2025-11-21 22:22:15', '2025-11-21 22:22:16'),
(3, 3, 'fallback_user', NULL, 'User', 'Fallback', '', '', 'en', '$2y$13$J/Uyov3mnZofmE/Nr2bgR.eZJdolniK278gad3CJcu/Ku.JZgaQ7a', 'fallback_user', 'Europe/Paris', 'fallback@example.com', 'fallback@example.com', 0, 0, 0, '2025-11-21 22:22:16', NULL, '2025-11-21 22:22:16', '0000000000', NULL, '1cea1bc4c735a74eddd49c1b05760b8017560bf9', NULL, NULL, NULL, '2025-11-21 22:22:16', 'a:0:{}', NULL, 99, 'FALLBACK', NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, -2, NULL, NULL, NULL, 0xecfb7a9500a04bac8f7bd3ed8664fcee, 0, NULL, NULL, NULL, NULL, NULL, '2025-11-21 22:22:16', '2025-11-21 22:22:16'),
(4, 54, 'rami-aouinti', NULL, 'student', 'aouinti', '', '', 'en_US', '$2y$13$NaU/DJJ6GXpOIbXVL//sdup2Tk9uYn7pJM4QMKaNMilXzQWE.ts2G', 'rami-aouinti', 'Europe/Paris', 'rami.aouinti.dourant@gmail.om', 'rami.aouinti.dourant@gmail.om', 0, 0, 0, '2025-11-21 22:32:03', NULL, '2025-11-21 22:32:03', '', NULL, '8203f0e02772571ab76c15393706a02a0b0075dd', NULL, '2025-11-22 00:22:51', NULL, '2025-11-21 22:32:03', 'a:1:{i:0;s:12:\"ROLE_STUDENT\";}', NULL, 5, 'RAMI-AOUINTI', NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, 0, 0xb327013bc20b4119ab6242ed3efa558a, 0, NULL, NULL, NULL, NULL, NULL, '2025-11-21 22:32:03', '2025-11-22 01:15:00');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `usergroup`
--

CREATE TABLE `usergroup` (
  `id` int(11) NOT NULL,
  `resource_node_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext DEFAULT NULL,
  `group_type` int(11) NOT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `visibility` varchar(255) NOT NULL,
  `author_id` int(11) DEFAULT NULL,
  `allow_members_leave_group` int(11) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `usergroup`
--

INSERT INTO `usergroup` (`id`, `resource_node_id`, `title`, `description`, `group_type`, `picture`, `url`, `visibility`, `author_id`, `allow_members_leave_group`, `created_at`, `updated_at`) VALUES
(1, 82, 'Social', 'Social', 1, NULL, '/symfony', '1', NULL, 1, '2025-11-22 01:11:33', '2025-11-22 01:11:33');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `usergroup_rel_course`
--

CREATE TABLE `usergroup_rel_course` (
  `id` int(11) NOT NULL,
  `usergroup_id` int(11) DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `usergroup_rel_question`
--

CREATE TABLE `usergroup_rel_question` (
  `id` int(11) NOT NULL,
  `question_id` int(11) DEFAULT NULL,
  `usergroup_id` int(11) DEFAULT NULL,
  `coefficient` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `usergroup_rel_session`
--

CREATE TABLE `usergroup_rel_session` (
  `id` int(11) NOT NULL,
  `usergroup_id` int(11) DEFAULT NULL,
  `session_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `usergroup_rel_user`
--

CREATE TABLE `usergroup_rel_user` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `usergroup_id` int(11) DEFAULT NULL,
  `relation_type` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `usergroup_rel_user`
--

INSERT INTO `usergroup_rel_user` (`id`, `user_id`, `usergroup_id`, `relation_type`) VALUES
(1, 1, 1, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `usergroup_rel_usergroup`
--

CREATE TABLE `usergroup_rel_usergroup` (
  `id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `subgroup_id` int(11) NOT NULL,
  `relation_type` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user_api_key`
--

CREATE TABLE `user_api_key` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `api_key` varchar(32) NOT NULL,
  `api_service` varchar(10) NOT NULL,
  `api_end_point` longtext DEFAULT NULL,
  `created_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `validity_start_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `validity_end_date` datetime DEFAULT NULL COMMENT '(DC2Type:datetime)',
  `description` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user_auth_source`
--

CREATE TABLE `user_auth_source` (
  `id` int(11) NOT NULL,
  `url_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `authentication` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `user_auth_source`
--

INSERT INTO `user_auth_source` (`id`, `url_id`, `user_id`, `authentication`) VALUES
(1, 1, 1, 'platform'),
(2, 1, 2, 'platform'),
(3, 1, 3, 'platform'),
(5, 1, 4, 'platform');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user_career`
--

CREATE TABLE `user_career` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `career_id` int(11) NOT NULL,
  `extra_data` longtext DEFAULT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user_course_category`
--

CREATE TABLE `user_course_category` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `title` longtext NOT NULL,
  `sort` int(11) DEFAULT NULL,
  `collapsed` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user_friend_relation_type`
--

CREATE TABLE `user_friend_relation_type` (
  `id` int(11) NOT NULL,
  `title` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `user_friend_relation_type`
--

INSERT INTO `user_friend_relation_type` (`id`, `title`) VALUES
(1, 'Unknown'),
(2, 'My parents'),
(3, 'My friends'),
(4, 'My real friends'),
(5, 'My enemies'),
(6, 'Contact deleted');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user_rel_course_vote`
--

CREATE TABLE `user_rel_course_vote` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `c_id` int(11) DEFAULT NULL,
  `session_id` int(11) DEFAULT NULL,
  `url_id` int(11) DEFAULT NULL,
  `vote` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `user_rel_course_vote`
--

INSERT INTO `user_rel_course_vote` (`id`, `user_id`, `c_id`, `session_id`, `url_id`, `vote`) VALUES
(1, 1, 1, NULL, 1, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user_rel_tag`
--

CREATE TABLE `user_rel_tag` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `tag_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `user_rel_tag`
--

INSERT INTO `user_rel_tag` (`id`, `user_id`, `tag_id`) VALUES
(1, 4, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user_rel_user`
--

CREATE TABLE `user_rel_user` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `friend_user_id` int(11) NOT NULL,
  `relation_type` int(11) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Daten für Tabelle `user_rel_user`
--

INSERT INTO `user_rel_user` (`id`, `user_id`, `friend_user_id`, `relation_type`, `created_at`, `updated_at`) VALUES
(1, 4, 1, 3, '2025-11-21 22:47:20', '2025-11-21 22:48:03'),
(2, 1, 4, 3, '2025-11-21 22:48:03', '2025-11-21 22:48:03');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `validation_token`
--

CREATE TABLE `validation_token` (
  `id` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `resource_id` bigint(20) NOT NULL,
  `hash` varchar(64) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `xapi_activity_profile`
--

CREATE TABLE `xapi_activity_profile` (
  `id` int(11) NOT NULL,
  `profile_id` varchar(255) NOT NULL,
  `activity_id` varchar(255) NOT NULL,
  `document_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '(DC2Type:json)' CHECK (json_valid(`document_data`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `xapi_activity_state`
--

CREATE TABLE `xapi_activity_state` (
  `id` int(11) NOT NULL,
  `state_id` varchar(255) NOT NULL,
  `activity_id` varchar(255) NOT NULL,
  `agent` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '(DC2Type:json)' CHECK (json_valid(`agent`)),
  `document_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '(DC2Type:json)' CHECK (json_valid(`document_data`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `xapi_actor`
--

CREATE TABLE `xapi_actor` (
  `identifier` int(11) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `mbox` varchar(255) DEFAULT NULL,
  `mbox_sha1_sum` varchar(255) DEFAULT NULL,
  `open_id` varchar(255) DEFAULT NULL,
  `account_name` varchar(255) DEFAULT NULL,
  `account_home_page` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `xapi_attachment`
--

CREATE TABLE `xapi_attachment` (
  `identifier` int(11) NOT NULL,
  `statement_id` varchar(255) DEFAULT NULL,
  `usage_type` varchar(255) NOT NULL,
  `content_type` int(11) NOT NULL,
  `length` int(11) NOT NULL,
  `sha2` varchar(255) NOT NULL,
  `display` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '(DC2Type:json)' CHECK (json_valid(`display`)),
  `has_description` tinyint(1) NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '(DC2Type:json)' CHECK (json_valid(`description`)),
  `file_url` varchar(255) DEFAULT NULL,
  `content` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `xapi_cmi5_item`
--

CREATE TABLE `xapi_cmi5_item` (
  `id` int(11) NOT NULL,
  `root_id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `tool_id` int(11) DEFAULT NULL,
  `identifier` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `title` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '(DC2Type:json)' CHECK (json_valid(`title`)),
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '(DC2Type:json)' CHECK (json_valid(`description`)),
  `url` varchar(255) DEFAULT NULL,
  `activity_type` varchar(255) DEFAULT NULL,
  `launch_method` varchar(255) DEFAULT NULL,
  `move_on` varchar(255) DEFAULT NULL,
  `mastery_score` double DEFAULT NULL,
  `launch_parameters` varchar(255) DEFAULT NULL,
  `entitlement_key` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `lft` int(11) NOT NULL,
  `lvl` int(11) NOT NULL,
  `rgt` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `xapi_context`
--

CREATE TABLE `xapi_context` (
  `identifier` int(11) NOT NULL,
  `instructor_id` int(11) DEFAULT NULL,
  `team_id` int(11) DEFAULT NULL,
  `extensions_id` int(11) DEFAULT NULL,
  `registration` varchar(255) DEFAULT NULL,
  `has_context_activities` tinyint(1) DEFAULT NULL,
  `revision` varchar(255) DEFAULT NULL,
  `platform` varchar(255) DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `statement` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `xapi_extensions`
--

CREATE TABLE `xapi_extensions` (
  `identifier` int(11) NOT NULL,
  `extensions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '(DC2Type:json)' CHECK (json_valid(`extensions`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `xapi_internal_log`
--

CREATE TABLE `xapi_internal_log` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `statement_id` varchar(255) NOT NULL,
  `verb` varchar(255) NOT NULL,
  `object_id` varchar(255) NOT NULL,
  `activity_name` varchar(255) DEFAULT NULL,
  `activity_description` varchar(255) NOT NULL,
  `score_scaled` double DEFAULT NULL,
  `score_raw` double DEFAULT NULL,
  `score_min` double DEFAULT NULL,
  `score_max` double DEFAULT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `xapi_lrs_auth`
--

CREATE TABLE `xapi_lrs_auth` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `xapi_object`
--

CREATE TABLE `xapi_object` (
  `identifier` int(11) NOT NULL,
  `actor_id` int(11) DEFAULT NULL,
  `verb_id` int(11) DEFAULT NULL,
  `object_id` int(11) DEFAULT NULL,
  `activity_extensions_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `parent_context_id` int(11) DEFAULT NULL,
  `grouping_context_id` int(11) DEFAULT NULL,
  `category_context_id` int(11) DEFAULT NULL,
  `other_context_id` int(11) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `activity_id` varchar(255) DEFAULT NULL,
  `has_activity_definition` tinyint(1) DEFAULT NULL,
  `has_activity_name` tinyint(1) DEFAULT NULL,
  `activity_name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '(DC2Type:json)' CHECK (json_valid(`activity_name`)),
  `has_activity_description` tinyint(1) DEFAULT NULL,
  `activity_description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '(DC2Type:json)' CHECK (json_valid(`activity_description`)),
  `activity_type` varchar(255) DEFAULT NULL,
  `activity_more_info` varchar(255) DEFAULT NULL,
  `mbox` varchar(255) DEFAULT NULL,
  `mbox_sha1_sum` varchar(255) DEFAULT NULL,
  `open_id` varchar(255) DEFAULT NULL,
  `account_name` varchar(255) DEFAULT NULL,
  `account_home_page` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `referenced_statement_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `xapi_result`
--

CREATE TABLE `xapi_result` (
  `identifier` int(11) NOT NULL,
  `extensions_id` int(11) DEFAULT NULL,
  `has_score` tinyint(1) NOT NULL,
  `scaled` double DEFAULT NULL,
  `raw` double DEFAULT NULL,
  `min` double DEFAULT NULL,
  `max` double DEFAULT NULL,
  `success` tinyint(1) DEFAULT NULL,
  `completion` tinyint(1) DEFAULT NULL,
  `response` varchar(255) DEFAULT NULL,
  `duration` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `xapi_shared_statement`
--

CREATE TABLE `xapi_shared_statement` (
  `id` int(11) NOT NULL,
  `uuid` binary(16) DEFAULT NULL COMMENT '(DC2Type:uuid)',
  `statement` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '(DC2Type:json)' CHECK (json_valid(`statement`)),
  `sent` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `xapi_statement`
--

CREATE TABLE `xapi_statement` (
  `id` varchar(255) NOT NULL,
  `actor_id` int(11) DEFAULT NULL,
  `verb_id` int(11) DEFAULT NULL,
  `object_id` int(11) DEFAULT NULL,
  `result_id` int(11) DEFAULT NULL,
  `authority_id` int(11) DEFAULT NULL,
  `context_id` int(11) DEFAULT NULL,
  `created` int(11) DEFAULT NULL,
  `stored` int(11) DEFAULT NULL,
  `has_attachments` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `xapi_tool_launch`
--

CREATE TABLE `xapi_tool_launch` (
  `id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `session_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext DEFAULT NULL,
  `launch_url` varchar(255) NOT NULL,
  `activity_id` varchar(255) DEFAULT NULL,
  `activity_type` varchar(255) DEFAULT NULL,
  `allow_multiple_attempts` tinyint(1) NOT NULL,
  `lrs_url` varchar(255) DEFAULT NULL,
  `lrs_auth_username` varchar(255) DEFAULT NULL,
  `lrs_auth_password` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `xapi_verb`
--

CREATE TABLE `xapi_verb` (
  `identifier` int(11) NOT NULL,
  `id` varchar(255) NOT NULL,
  `display` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '(DC2Type:json)' CHECK (json_valid(`display`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `access_url`
--
ALTER TABLE `access_url`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_9436187B1BAD783F` (`resource_node_id`),
  ADD KEY `IDX_9436187B727ACA70` (`parent_id`),
  ADD KEY `IDX_9436187BA977936C` (`tree_root`);

--
-- Indizes für die Tabelle `access_url_rel_color_theme`
--
ALTER TABLE `access_url_rel_color_theme`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_D2A2E1C981CFDAE7` (`url_id`),
  ADD KEY `IDX_D2A2E1C98587EFC5` (`color_theme_id`);

--
-- Indizes für die Tabelle `access_url_rel_course`
--
ALTER TABLE `access_url_rel_course`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_8E97FC0891D79BD3` (`c_id`),
  ADD KEY `IDX_8E97FC0873444FD5` (`access_url_id`);

--
-- Indizes für die Tabelle `access_url_rel_course_category`
--
ALTER TABLE `access_url_rel_course_category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_3545C2A673444FD5` (`access_url_id`),
  ADD KEY `IDX_3545C2A66628AD36` (`course_category_id`);

--
-- Indizes für die Tabelle `access_url_rel_plugin`
--
ALTER TABLE `access_url_rel_plugin`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_7167B425EC942BCF` (`plugin_id`),
  ADD KEY `IDX_7167B42581CFDAE7` (`url_id`);

--
-- Indizes für die Tabelle `access_url_rel_session`
--
ALTER TABLE `access_url_rel_session`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_6CBA5F5D613FECDF` (`session_id`),
  ADD KEY `IDX_6CBA5F5D73444FD5` (`access_url_id`);

--
-- Indizes für die Tabelle `access_url_rel_user`
--
ALTER TABLE `access_url_rel_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_access_url_rel_user_user` (`user_id`),
  ADD KEY `idx_access_url_rel_user_access_url` (`access_url_id`),
  ADD KEY `idx_access_url_rel_user_access_url_user` (`user_id`,`access_url_id`);

--
-- Indizes für die Tabelle `access_url_rel_usergroup`
--
ALTER TABLE `access_url_rel_usergroup`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_AD488DD573444FD5` (`access_url_id`),
  ADD KEY `IDX_AD488DD5D2112630` (`usergroup_id`);

--
-- Indizes für die Tabelle `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_880E0D76A76ED395` (`user_id`);

--
-- Indizes für die Tabelle `agenda_reminder`
--
ALTER TABLE `agenda_reminder`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_416FFA2471F7E88B` (`event_id`);

--
-- Indizes für die Tabelle `ai_requests`
--
ALTER TABLE `ai_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `announcement_rel_group`
--
ALTER TABLE `announcement_rel_group`
  ADD PRIMARY KEY (`group_id`,`announcement_id`);

--
-- Indizes für die Tabelle `asset`
--
ALTER TABLE `asset`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `attempt_feedback`
--
ALTER TABLE `attempt_feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_BA30B2FEB191BE6B` (`attempt_id`),
  ADD KEY `IDX_BA30B2FEA76ED395` (`user_id`),
  ADD KEY `IDX_BA30B2FE5DA1941` (`asset_id`);

--
-- Indizes für die Tabelle `attempt_file`
--
ALTER TABLE `attempt_file`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_4F22BDF0B191BE6B` (`attempt_id`),
  ADD KEY `IDX_4F22BDF05DA1941` (`asset_id`);

--
-- Indizes für die Tabelle `azure_sync_state`
--
ALTER TABLE `azure_sync_state`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `block`
--
ALTER TABLE `block`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_831B9722A76ED395` (`user_id`);

--
-- Indizes für die Tabelle `branch_sync`
--
ALTER TABLE `branch_sync`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_F62F45EDE3C68343` (`unique_id`),
  ADD KEY `IDX_F62F45ED73444FD5` (`access_url_id`),
  ADD KEY `IDX_F62F45ED727ACA70` (`parent_id`);

--
-- Indizes für die Tabelle `branch_transaction`
--
ALTER TABLE `branch_transaction`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_FEFBA12B6BF700BD` (`status_id`),
  ADD KEY `IDX_FEFBA12BDCD6CC49` (`branch_id`);

--
-- Indizes für die Tabelle `branch_transaction_status`
--
ALTER TABLE `branch_transaction_status`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `career`
--
ALTER TABLE `career`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `catalogue_course_rel_access_url_rel_usergroup`
--
ALTER TABLE `catalogue_course_rel_access_url_rel_usergroup`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_37CC1F8E591CC992` (`course_id`),
  ADD KEY `IDX_37CC1F8E73444FD5` (`access_url_id`),
  ADD KEY `IDX_37CC1F8ED2112630` (`usergroup_id`);

--
-- Indizes für die Tabelle `catalogue_session_rel_access_url_rel_usergroup`
--
ALTER TABLE `catalogue_session_rel_access_url_rel_usergroup`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_B143E63A613FECDF` (`session_id`),
  ADD KEY `IDX_B143E63A73444FD5` (`access_url_id`),
  ADD KEY `IDX_B143E63AD2112630` (`usergroup_id`);

--
-- Indizes für die Tabelle `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_chat_to_user` (`to_user`),
  ADD KEY `idx_chat_from_user` (`from_user`);

--
-- Indizes für die Tabelle `chat_video`
--
ALTER TABLE `chat_video`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_chat_video_to_user` (`to_user`),
  ADD KEY `idx_chat_video_from_user` (`from_user`),
  ADD KEY `idx_chat_video_users` (`from_user`,`to_user`),
  ADD KEY `idx_chat_video_title` (`title`);

--
-- Indizes für die Tabelle `color_theme`
--
ALTER TABLE `color_theme`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `conference_activity`
--
ALTER TABLE `conference_activity`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_6935CF7B67433D9C` (`meeting_id`),
  ADD KEY `IDX_6935CF7B9D1C3019` (`participant_id`);

--
-- Indizes für die Tabelle `conference_meeting`
--
ALTER TABLE `conference_meeting`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_EE87E8191D79BD3` (`c_id`),
  ADD KEY `IDX_EE87E81613FECDF` (`session_id`),
  ADD KEY `IDX_EE87E8173444FD5` (`access_url_id`),
  ADD KEY `IDX_EE87E81FE54D947` (`group_id`),
  ADD KEY `IDX_EE87E81A76ED395` (`user_id`);

--
-- Indizes für die Tabelle `conference_recording`
--
ALTER TABLE `conference_recording`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_F7FF7ACB67433D9C` (`meeting_id`);

--
-- Indizes für die Tabelle `contact_form_contact_category`
--
ALTER TABLE `contact_form_contact_category`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_169E6FB977153098` (`code`),
  ADD UNIQUE KEY `UNIQ_169E6FB91BAD783F` (`resource_node_id`),
  ADD KEY `IDX_169E6FB954177093` (`room_id`),
  ADD KEY `idx_course_sticky` (`sticky`);

--
-- Indizes für die Tabelle `course_category`
--
ALTER TABLE `course_category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `IDX_AFF874975DA1941` (`asset_id`),
  ADD KEY `parent_id` (`parent_id`),
  ADD KEY `tree_pos` (`tree_pos`);

--
-- Indizes für die Tabelle `course_rel_category`
--
ALTER TABLE `course_rel_category`
  ADD PRIMARY KEY (`course_id`,`course_category_id`),
  ADD KEY `IDX_16B33772591CC992` (`course_id`),
  ADD KEY `IDX_16B337726628AD36` (`course_category_id`);

--
-- Indizes für die Tabelle `course_rel_class`
--
ALTER TABLE `course_rel_class`
  ADD PRIMARY KEY (`course_code`,`class_id`);

--
-- Indizes für die Tabelle `course_rel_user`
--
ALTER TABLE `course_rel_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_92CFD9FEA76ED395` (`user_id`),
  ADD KEY `IDX_92CFD9FE91D79BD3` (`c_id`),
  ADD KEY `course_rel_user_user_id` (`id`,`user_id`),
  ADD KEY `course_rel_user_c_id_user_id` (`id`,`c_id`,`user_id`);

--
-- Indizes für die Tabelle `course_rel_user_catalogue`
--
ALTER TABLE `course_rel_user_catalogue`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_rel_user_catalogue_user_id` (`user_id`),
  ADD KEY `course_rel_user_catalogue_c_id` (`c_id`);

--
-- Indizes für die Tabelle `course_request`
--
ALTER TABLE `course_request`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `IDX_33548A73A76ED395` (`user_id`);

--
-- Indizes für die Tabelle `course_type`
--
ALTER TABLE `course_type`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `c_announcement`
--
ALTER TABLE `c_announcement`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `UNIQ_39912E021BAD783F` (`resource_node_id`);

--
-- Indizes für die Tabelle `c_announcement_attachment`
--
ALTER TABLE `c_announcement_attachment`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `UNIQ_5480BD4A1BAD783F` (`resource_node_id`),
  ADD KEY `IDX_5480BD4A913AEA17` (`announcement_id`);

--
-- Indizes für die Tabelle `c_attendance`
--
ALTER TABLE `c_attendance`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `UNIQ_413634921BAD783F` (`resource_node_id`),
  ADD KEY `active` (`active`);

--
-- Indizes für die Tabelle `c_attendance_calendar`
--
ALTER TABLE `c_attendance_calendar`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `IDX_AA3A9AB8163DDA15` (`attendance_id`),
  ADD KEY `done_attendance` (`done_attendance`);

--
-- Indizes für die Tabelle `c_attendance_calendar_rel_group`
--
ALTER TABLE `c_attendance_calendar_rel_group`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `IDX_C2AB1FACFE54D947` (`group_id`),
  ADD KEY `IDX_C2AB1FACA40A2C8` (`calendar_id`);

--
-- Indizes für die Tabelle `c_attendance_result`
--
ALTER TABLE `c_attendance_result`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `IDX_2C7640A76ED395` (`user_id`),
  ADD KEY `IDX_2C7640163DDA15` (`attendance_id`);

--
-- Indizes für die Tabelle `c_attendance_result_comment`
--
ALTER TABLE `c_attendance_result_comment`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `attendance_sheet_id` (`attendance_sheet_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indizes für die Tabelle `c_attendance_sheet`
--
ALTER TABLE `c_attendance_sheet`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `IDX_AD1394FAA76ED395` (`user_id`),
  ADD KEY `IDX_AD1394FA19EA43C3` (`attendance_calendar_id`),
  ADD KEY `presence` (`presence`);

--
-- Indizes für die Tabelle `c_attendance_sheet_log`
--
ALTER TABLE `c_attendance_sheet_log`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `IDX_181D0917163DDA15` (`attendance_id`),
  ADD KEY `IDX_181D091731BA5DD` (`lastedit_user_id`);

--
-- Indizes für die Tabelle `c_autogroup_user_invitation`
--
ALTER TABLE `c_autogroup_user_invitation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_84AB498037FE8223` (`group_category_id`),
  ADD KEY `IDX_84AB4980FE54D947` (`group_id`),
  ADD KEY `IDX_84AB4980A76ED395` (`user_id`);

--
-- Indizes für die Tabelle `c_blog`
--
ALTER TABLE `c_blog`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `UNIQ_64B00A121BAD783F` (`resource_node_id`);

--
-- Indizes für die Tabelle `c_blog_attachment`
--
ALTER TABLE `c_blog_attachment`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `IDX_E769AADCDAE07E97` (`blog_id`),
  ADD KEY `IDX_E769AADC4B89032C` (`post_id`),
  ADD KEY `IDX_E769AADCF8697D13` (`comment_id`);

--
-- Indizes für die Tabelle `c_blog_comment`
--
ALTER TABLE `c_blog_comment`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `IDX_CAA18F1F675F31B` (`author_id`),
  ADD KEY `IDX_CAA18F1DAE07E97` (`blog_id`),
  ADD KEY `IDX_CAA18F14B89032C` (`post_id`),
  ADD KEY `IDX_CAA18F1BF2AF943` (`parent_comment_id`);

--
-- Indizes für die Tabelle `c_blog_post`
--
ALTER TABLE `c_blog_post`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `IDX_B6FD68A3F675F31B` (`author_id`),
  ADD KEY `IDX_B6FD68A3DAE07E97` (`blog_id`);

--
-- Indizes für die Tabelle `c_blog_rating`
--
ALTER TABLE `c_blog_rating`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `IDX_D4E30760DAE07E97` (`blog_id`),
  ADD KEY `IDX_D4E30760A76ED395` (`user_id`),
  ADD KEY `IDX_D4E307604B89032C` (`post_id`);

--
-- Indizes für die Tabelle `c_blog_rel_user`
--
ALTER TABLE `c_blog_rel_user`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `uniq_blog_user` (`blog_id`,`user_id`),
  ADD KEY `IDX_B55D851BDAE07E97` (`blog_id`),
  ADD KEY `IDX_B55D851BA76ED395` (`user_id`);

--
-- Indizes für die Tabelle `c_blog_task`
--
ALTER TABLE `c_blog_task`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `IDX_BE09DF0BDAE07E97` (`blog_id`),
  ADD KEY `IDX_BE09DF0BF675F31B` (`author_id`);

--
-- Indizes für die Tabelle `c_blog_task_rel_user`
--
ALTER TABLE `c_blog_task_rel_user`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `uniq_task_user_blog_date` (`task_id`,`user_id`,`blog_id`,`target_date`),
  ADD KEY `IDX_FD8B3C738DB60186` (`task_id`),
  ADD KEY `IDX_FD8B3C73DAE07E97` (`blog_id`),
  ADD KEY `IDX_FD8B3C73A76ED395` (`user_id`);

--
-- Indizes für die Tabelle `c_calendar_event`
--
ALTER TABLE `c_calendar_event`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `UNIQ_A06225811BAD783F` (`resource_node_id`),
  ADD KEY `IDX_A0622581EE3A445A` (`parent_event_id`),
  ADD KEY `IDX_A062258154177093` (`room_id`),
  ADD KEY `IDX_A0622581B58CDA09` (`career_id`),
  ADD KEY `IDX_A0622581139DF194` (`promotion_id`);

--
-- Indizes für die Tabelle `c_calendar_event_attachment`
--
ALTER TABLE `c_calendar_event_attachment`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `UNIQ_DDD745A61BAD783F` (`resource_node_id`),
  ADD KEY `IDX_DDD745A6EA67784A` (`agenda_id`);

--
-- Indizes für die Tabelle `c_calendar_event_repeat`
--
ALTER TABLE `c_calendar_event_repeat`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `IDX_86FD1CA87300D633` (`cal_id`);

--
-- Indizes für die Tabelle `c_calendar_event_repeat_not`
--
ALTER TABLE `c_calendar_event_repeat_not`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `IDX_7D4436947300D633` (`cal_id`);

--
-- Indizes für die Tabelle `c_chat_connected`
--
ALTER TABLE `c_chat_connected`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `course` (`c_id`),
  ADD KEY `user` (`user_id`),
  ADD KEY `char_connected_index` (`user_id`,`session_id`,`to_group_id`);

--
-- Indizes für die Tabelle `c_chat_conversation`
--
ALTER TABLE `c_chat_conversation`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_CD09E33F1BAD783F` (`resource_node_id`);

--
-- Indizes für die Tabelle `c_course_description`
--
ALTER TABLE `c_course_description`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `UNIQ_EC3CD8091BAD783F` (`resource_node_id`);

--
-- Indizes für die Tabelle `c_course_setting`
--
ALTER TABLE `c_course_setting`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `course` (`c_id`);

--
-- Indizes für die Tabelle `c_document`
--
ALTER TABLE `c_document`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `UNIQ_C9FA0CBD1BAD783F` (`resource_node_id`),
  ADD KEY `idx_cdoc_type` (`filetype`);

--
-- Indizes für die Tabelle `c_dropbox_category`
--
ALTER TABLE `c_dropbox_category`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `course` (`c_id`),
  ADD KEY `session_id` (`session_id`);

--
-- Indizes für die Tabelle `c_dropbox_feedback`
--
ALTER TABLE `c_dropbox_feedback`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `course` (`c_id`),
  ADD KEY `file_id` (`file_id`),
  ADD KEY `author_user_id` (`author_user_id`);

--
-- Indizes für die Tabelle `c_dropbox_file`
--
ALTER TABLE `c_dropbox_file`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `UN_filename` (`filename`),
  ADD UNIQUE KEY `UNIQ_4D71B46C1BAD783F` (`resource_node_id`),
  ADD KEY `course` (`c_id`),
  ADD KEY `session_id` (`session_id`);

--
-- Indizes für die Tabelle `c_dropbox_person`
--
ALTER TABLE `c_dropbox_person`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `course` (`c_id`),
  ADD KEY `user` (`user_id`);

--
-- Indizes für die Tabelle `c_dropbox_post`
--
ALTER TABLE `c_dropbox_post`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `course` (`c_id`),
  ADD KEY `dest_user` (`dest_user_id`),
  ADD KEY `session_id` (`session_id`);

--
-- Indizes für die Tabelle `c_forum_attachment`
--
ALTER TABLE `c_forum_attachment`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `UNIQ_F1113A881BAD783F` (`resource_node_id`),
  ADD KEY `IDX_F1113A884B89032C` (`post_id`),
  ADD KEY `course` (`c_id`);

--
-- Indizes für die Tabelle `c_forum_category`
--
ALTER TABLE `c_forum_category`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `UNIQ_D627B86E1BAD783F` (`resource_node_id`);

--
-- Indizes für die Tabelle `c_forum_forum`
--
ALTER TABLE `c_forum_forum`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `UNIQ_47A9C991BAD783F` (`resource_node_id`),
  ADD KEY `IDX_47A9C99F2E82C87` (`forum_last_post`),
  ADD KEY `IDX_47A9C9921BF9426` (`forum_category`),
  ADD KEY `IDX_47A9C9968DFD1EF` (`lp_id`);

--
-- Indizes für die Tabelle `c_forum_mailcue`
--
ALTER TABLE `c_forum_mailcue`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `course` (`c_id`),
  ADD KEY `thread` (`thread_id`),
  ADD KEY `user` (`user_id`),
  ADD KEY `post` (`post_id`);

--
-- Indizes für die Tabelle `c_forum_notification`
--
ALTER TABLE `c_forum_notification`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `course` (`c_id`),
  ADD KEY `thread` (`thread_id`),
  ADD KEY `post` (`post_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `forum_id` (`forum_id`);

--
-- Indizes für die Tabelle `c_forum_post`
--
ALTER TABLE `c_forum_post`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `UNIQ_B5BEF5591BAD783F` (`resource_node_id`),
  ADD KEY `IDX_B5BEF5595BB66C05` (`poster_id`),
  ADD KEY `IDX_B5BEF559D314B487` (`post_parent_id`),
  ADD KEY `forum_id` (`forum_id`),
  ADD KEY `idx_forum_post_thread_id` (`thread_id`),
  ADD KEY `idx_forum_post_visible` (`visible`);

--
-- Indizes für die Tabelle `c_forum_thread`
--
ALTER TABLE `c_forum_thread`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `UNIQ_5DA7884C1BAD783F` (`resource_node_id`),
  ADD KEY `IDX_5DA7884C29CCBAD0` (`forum_id`),
  ADD KEY `IDX_5DA7884CD4DC43B9` (`thread_poster_id`),
  ADD KEY `IDX_5DA7884C43CB876D` (`thread_last_post`),
  ADD KEY `IDX_5DA7884CDBF72317` (`lp_item_id`);

--
-- Indizes für die Tabelle `c_forum_thread_qualify`
--
ALTER TABLE `c_forum_thread_qualify`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `IDX_715FC3A5A76ED395` (`user_id`),
  ADD KEY `IDX_715FC3A5E2904019` (`thread_id`),
  ADD KEY `IDX_715FC3A5E5E1B95C` (`qualify_user_id`),
  ADD KEY `course` (`c_id`),
  ADD KEY `user_id` (`user_id`,`thread_id`);

--
-- Indizes für die Tabelle `c_forum_thread_qualify_log`
--
ALTER TABLE `c_forum_thread_qualify_log`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `course` (`c_id`),
  ADD KEY `user_id` (`user_id`,`thread_id`);

--
-- Indizes für die Tabelle `c_glossary`
--
ALTER TABLE `c_glossary`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `UNIQ_A1168D881BAD783F` (`resource_node_id`);

--
-- Indizes für die Tabelle `c_group_category`
--
ALTER TABLE `c_group_category`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `UNIQ_F8E479F61BAD783F` (`resource_node_id`),
  ADD KEY `IDX_F8E479F6FDC232CD` (`peer_assessment`);

--
-- Indizes für die Tabelle `c_group_category_rel_user`
--
ALTER TABLE `c_group_category_rel_user`
  ADD PRIMARY KEY (`id`,`group_category_id`),
  ADD KEY `IDX_4D66D81337FE8223` (`group_category_id`);

--
-- Indizes für die Tabelle `c_group_info`
--
ALTER TABLE `c_group_info`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `UNIQ_CE0653241BAD783F` (`resource_node_id`),
  ADD KEY `IDX_CE06532412469DE2` (`category_id`);

--
-- Indizes für die Tabelle `c_group_rel_tutor`
--
ALTER TABLE `c_group_rel_tutor`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `IDX_F6FF71ABA76ED395` (`user_id`),
  ADD KEY `IDX_F6FF71ABFE54D947` (`group_id`),
  ADD KEY `course` (`c_id`);

--
-- Indizes für die Tabelle `c_group_rel_user`
--
ALTER TABLE `c_group_rel_user`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `IDX_C5D3D49FA76ED395` (`user_id`),
  ADD KEY `IDX_C5D3D49FFE54D947` (`group_id`),
  ADD KEY `course` (`c_id`);

--
-- Indizes für die Tabelle `c_group_rel_usergroup`
--
ALTER TABLE `c_group_rel_usergroup`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_AEE272A8FE54D947` (`group_id`),
  ADD KEY `IDX_AEE272A8D2112630` (`usergroup_id`),
  ADD KEY `IDX_AEE272A8613FECDF` (`session_id`),
  ADD KEY `IDX_AEE272A891D79BD3` (`c_id`);

--
-- Indizes für die Tabelle `c_link`
--
ALTER TABLE `c_link`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `UNIQ_9209C2A01BAD783F` (`resource_node_id`),
  ADD KEY `IDX_9209C2A012469DE2` (`category_id`),
  ADD KEY `IDX_9209C2A0D877C209` (`custom_image_id`);

--
-- Indizes für die Tabelle `c_link_category`
--
ALTER TABLE `c_link_category`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `UNIQ_319D6C9C1BAD783F` (`resource_node_id`);

--
-- Indizes für die Tabelle `c_lp`
--
ALTER TABLE `c_lp`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `UNIQ_F67ABBEB1BAD783F` (`resource_node_id`),
  ADD KEY `IDX_F67ABBEB12469DE2` (`category_id`),
  ADD KEY `IDX_F67ABBEB5DA1941` (`asset_id`);

--
-- Indizes für die Tabelle `c_lp_category`
--
ALTER TABLE `c_lp_category`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `UNIQ_90A0FC071BAD783F` (`resource_node_id`);

--
-- Indizes für die Tabelle `c_lp_category_rel_user`
--
ALTER TABLE `c_lp_category_rel_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_83D3582912469DE2` (`category_id`),
  ADD KEY `IDX_83D35829A76ED395` (`user_id`);

--
-- Indizes für die Tabelle `c_lp_item`
--
ALTER TABLE `c_lp_item`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `IDX_CCC9C1EDDEC4BDA0` (`item_root`),
  ADD KEY `IDX_CCC9C1ED60272618` (`parent_item_id`),
  ADD KEY `lp_id` (`lp_id`);

--
-- Indizes für die Tabelle `c_lp_item_view`
--
ALTER TABLE `c_lp_item_view`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `lp_item_id` (`lp_item_id`),
  ADD KEY `lp_view_id` (`lp_view_id`);

--
-- Indizes für die Tabelle `c_lp_iv_interaction`
--
ALTER TABLE `c_lp_iv_interaction`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `course` (`c_id`),
  ADD KEY `lp_iv_id` (`lp_iv_id`);

--
-- Indizes für die Tabelle `c_lp_iv_objective`
--
ALTER TABLE `c_lp_iv_objective`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `course` (`c_id`),
  ADD KEY `lp_iv_id` (`lp_iv_id`);

--
-- Indizes für die Tabelle `c_lp_rel_user`
--
ALTER TABLE `c_lp_rel_user`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `IDX_AD97516E68DFD1EF` (`lp_id`),
  ADD KEY `IDX_AD97516E91D79BD3` (`c_id`),
  ADD KEY `IDX_AD97516E613FECDF` (`session_id`),
  ADD KEY `IDX_AD97516EA76ED395` (`user_id`),
  ADD KEY `IDX_AD97516E61220EA6` (`creator_id`),
  ADD KEY `IDX_AD97516EFE54D947` (`group_id`);

--
-- Indizes für die Tabelle `c_lp_rel_usergroup`
--
ALTER TABLE `c_lp_rel_usergroup`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_DB8689FF68DFD1EF` (`lp_id`),
  ADD KEY `IDX_DB8689FF91D79BD3` (`c_id`),
  ADD KEY `IDX_DB8689FF613FECDF` (`session_id`),
  ADD KEY `IDX_DB8689FFD2112630` (`usergroup_id`);

--
-- Indizes für die Tabelle `c_lp_user_access`
--
ALTER TABLE `c_lp_user_access`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_7CAC73F7A76ED395` (`user_id`),
  ADD KEY `IDX_7CAC73F768DFD1EF` (`lp_id`);

--
-- Indizes für die Tabelle `c_lp_view`
--
ALTER TABLE `c_lp_view`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `IDX_2D2F4F7DA76ED395` (`user_id`),
  ADD KEY `course` (`c_id`),
  ADD KEY `lp_id` (`lp_id`),
  ADD KEY `session_id` (`session_id`);

--
-- Indizes für die Tabelle `c_notebook`
--
ALTER TABLE `c_notebook`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `UNIQ_E7EE1CE01BAD783F` (`resource_node_id`),
  ADD KEY `IDX_E7EE1CE0A76ED395` (`user_id`);

--
-- Indizes für die Tabelle `c_peer_assessment`
--
ALTER TABLE `c_peer_assessment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_8532634391D79BD3` (`c_id`),
  ADD KEY `IDX_8532634337FE8223` (`group_category_id`);

--
-- Indizes für die Tabelle `c_peer_assessment_correction`
--
ALTER TABLE `c_peer_assessment_correction`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_AFB0F2B7672C3733` (`peer_assessment_id`),
  ADD KEY `IDX_AFB0F2B74DDF95DC` (`student_group_id`);

--
-- Indizes für die Tabelle `c_peer_assessment_correction_criteria`
--
ALTER TABLE `c_peer_assessment_correction_criteria`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_C1AB8C19D723148D` (`peer_assessment_correction_id`),
  ADD KEY `IDX_C1AB8C1962488999` (`peer_assessment_criteria_id`);

--
-- Indizes für die Tabelle `c_peer_assessment_criteria`
--
ALTER TABLE `c_peer_assessment_criteria`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_5025776B672C3733` (`peer_assessment_id`);

--
-- Indizes für die Tabelle `c_peer_assessment_log`
--
ALTER TABLE `c_peer_assessment_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_71C6D04B672C3733` (`peer_assessment_id`),
  ADD KEY `IDX_71C6D04BA76ED395` (`user_id`);

--
-- Indizes für die Tabelle `c_peer_assessment_rel_student_publication`
--
ALTER TABLE `c_peer_assessment_rel_student_publication`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_1B078BC7672C3733` (`peer_assessment_id`),
  ADD KEY `IDX_1B078BC72F50351C` (`student_publication_id`),
  ADD KEY `IDX_1B078BC7FE54D947` (`group_id`);

--
-- Indizes für die Tabelle `c_peer_autogroup_rel_student_publication`
--
ALTER TABLE `c_peer_autogroup_rel_student_publication`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_52659CE4A76ED395` (`user_id`),
  ADD KEY `IDX_52659CE42F50351C` (`student_publication_id`),
  ADD KEY `IDX_52659CE4FE54D947` (`group_id`);

--
-- Indizes für die Tabelle `c_plagiarism_compilatio_docs`
--
ALTER TABLE `c_plagiarism_compilatio_docs`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `c_quiz`
--
ALTER TABLE `c_quiz`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `UNIQ_B7A1C31BAD783F` (`resource_node_id`),
  ADD KEY `IDX_B7A1C33D608E42` (`quiz_category_id`);

--
-- Indizes für die Tabelle `c_quiz_answer`
--
ALTER TABLE `c_quiz_answer`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `idx_cqa_q` (`question_id`);

--
-- Indizes für die Tabelle `c_quiz_category`
--
ALTER TABLE `c_quiz_category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_2AF3F5101BAD783F` (`resource_node_id`),
  ADD KEY `IDX_2AF3F51091D79BD3` (`c_id`);

--
-- Indizes für die Tabelle `c_quiz_question`
--
ALTER TABLE `c_quiz_question`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `UNIQ_9A48A59F1BAD783F` (`resource_node_id`),
  ADD KEY `position` (`position`);

--
-- Indizes für die Tabelle `c_quiz_question_category`
--
ALTER TABLE `c_quiz_question_category`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `UNIQ_1414369D1BAD783F` (`resource_node_id`);

--
-- Indizes für die Tabelle `c_quiz_question_option`
--
ALTER TABLE `c_quiz_question_option`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `IDX_499A73F31E27F6BF` (`question_id`);

--
-- Indizes für die Tabelle `c_quiz_question_rel_category`
--
ALTER TABLE `c_quiz_question_rel_category`
  ADD PRIMARY KEY (`question_id`,`category_id`),
  ADD KEY `IDX_A468585C1E27F6BF` (`question_id`),
  ADD KEY `IDX_A468585C12469DE2` (`category_id`);

--
-- Indizes für die Tabelle `c_quiz_rel_category`
--
ALTER TABLE `c_quiz_rel_category`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `IDX_F8EC662312469DE2` (`category_id`),
  ADD KEY `IDX_F8EC6623E934951A` (`exercise_id`);

--
-- Indizes für die Tabelle `c_quiz_rel_question`
--
ALTER TABLE `c_quiz_rel_question`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `question` (`question_id`),
  ADD KEY `exercise` (`quiz_id`);

--
-- Indizes für die Tabelle `c_shortcut`
--
ALTER TABLE `c_shortcut`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_3F6BB9571BAD783F` (`resource_node_id`),
  ADD UNIQUE KEY `UNIQ_3F6BB957937100BE` (`shortcut_node_id`);

--
-- Indizes für die Tabelle `c_student_publication`
--
ALTER TABLE `c_student_publication`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `UNIQ_5246F7461BAD783F` (`resource_node_id`),
  ADD KEY `IDX_5246F746727ACA70` (`parent_id`),
  ADD KEY `IDX_5246F746A76ED395` (`user_id`),
  ADD KEY `IDX_5246F74637FE8223` (`group_category_id`);

--
-- Indizes für die Tabelle `c_student_publication_assignment`
--
ALTER TABLE `c_student_publication_assignment`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `UNIQ_25687EB838B217A7` (`publication_id`);

--
-- Indizes für die Tabelle `c_student_publication_comment`
--
ALTER TABLE `c_student_publication_comment`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `UNIQ_35C509F61BAD783F` (`resource_node_id`),
  ADD KEY `IDX_35C509F6BB3453DB` (`work_id`),
  ADD KEY `IDX_35C509F6A76ED395` (`user_id`);

--
-- Indizes für die Tabelle `c_student_publication_correction`
--
ALTER TABLE `c_student_publication_correction`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_B7309BBA1BAD783F` (`resource_node_id`);

--
-- Indizes für die Tabelle `c_student_publication_rel_document`
--
ALTER TABLE `c_student_publication_rel_document`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `IDX_BD6672A5BB3453DB` (`work_id`),
  ADD KEY `IDX_BD6672A5C33F7837` (`document_id`);

--
-- Indizes für die Tabelle `c_student_publication_rel_user`
--
ALTER TABLE `c_student_publication_rel_user`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `IDX_2B007FA9BB3453DB` (`work_id`),
  ADD KEY `IDX_2B007FA9A76ED395` (`user_id`);

--
-- Indizes für die Tabelle `c_survey`
--
ALTER TABLE `c_survey`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `UNIQ_F246DB301BAD783F` (`resource_node_id`),
  ADD KEY `IDX_F246DB30727ACA70` (`parent_id`),
  ADD KEY `idx_survey_code` (`code`);

--
-- Indizes für die Tabelle `c_survey_answer`
--
ALTER TABLE `c_survey_answer`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `IDX_8A897DDB3FE509D` (`survey_id`),
  ADD KEY `IDX_8A897DD1E27F6BF` (`question_id`);

--
-- Indizes für die Tabelle `c_survey_invitation`
--
ALTER TABLE `c_survey_invitation`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `IDX_D0BC7C2613FECDF` (`session_id`),
  ADD KEY `IDX_D0BC7C2FE54D947` (`group_id`),
  ADD KEY `IDX_D0BC7C2B3FE509D` (`survey_id`),
  ADD KEY `IDX_D0BC7C2A76ED395` (`user_id`),
  ADD KEY `course` (`c_id`);

--
-- Indizes für die Tabelle `c_survey_question`
--
ALTER TABLE `c_survey_question`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `IDX_92F05EE7727ACA70` (`parent_id`),
  ADD KEY `IDX_92F05EE7568F3281` (`parent_option_id`),
  ADD KEY `IDX_92F05EE7B3FE509D` (`survey_id`);

--
-- Indizes für die Tabelle `c_survey_question_option`
--
ALTER TABLE `c_survey_question_option`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `IDX_C4B6F5FB3FE509D` (`survey_id`),
  ADD KEY `idx_survey_qo_qid` (`question_id`);

--
-- Indizes für die Tabelle `c_thematic`
--
ALTER TABLE `c_thematic`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `UNIQ_6D8F59B91BAD783F` (`resource_node_id`),
  ADD KEY `active` (`active`);

--
-- Indizes für die Tabelle `c_thematic_advance`
--
ALTER TABLE `c_thematic_advance`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `IDX_62798E972395FCED` (`thematic_id`),
  ADD KEY `IDX_62798E97163DDA15` (`attendance_id`),
  ADD KEY `IDX_62798E9754177093` (`room_id`);

--
-- Indizes für die Tabelle `c_thematic_plan`
--
ALTER TABLE `c_thematic_plan`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `IDX_1197487C2395FCED` (`thematic_id`),
  ADD KEY `thematic_id` (`thematic_id`,`description_type`);

--
-- Indizes für die Tabelle `c_tool`
--
ALTER TABLE `c_tool`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `UNIQ_845665801BAD783F` (`resource_node_id`),
  ADD KEY `IDX_845665808F7B22CC` (`tool_id`),
  ADD KEY `course` (`c_id`),
  ADD KEY `session_id` (`session_id`);

--
-- Indizes für die Tabelle `c_tool_intro`
--
ALTER TABLE `c_tool_intro`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `UNIQ_D705267B1BAD783F` (`resource_node_id`),
  ADD KEY `IDX_D705267B1DF6B517` (`c_tool_id`);

--
-- Indizes für die Tabelle `c_wiki`
--
ALTER TABLE `c_wiki`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `UNIQ_866887571BAD783F` (`resource_node_id`),
  ADD KEY `course` (`c_id`),
  ADD KEY `reflink` (`reflink`),
  ADD KEY `group_id` (`group_id`),
  ADD KEY `page_id` (`page_id`),
  ADD KEY `session_id` (`session_id`);

--
-- Indizes für die Tabelle `c_wiki_category`
--
ALTER TABLE `c_wiki_category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_17F1099A91D79BD3` (`c_id`),
  ADD KEY `IDX_17F1099A613FECDF` (`session_id`),
  ADD KEY `IDX_17F1099AA977936C` (`tree_root`),
  ADD KEY `IDX_17F1099A727ACA70` (`parent_id`);

--
-- Indizes für die Tabelle `c_wiki_conf`
--
ALTER TABLE `c_wiki_conf`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `course` (`c_id`),
  ADD KEY `page_id` (`page_id`);

--
-- Indizes für die Tabelle `c_wiki_discuss`
--
ALTER TABLE `c_wiki_discuss`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `course` (`c_id`);

--
-- Indizes für die Tabelle `c_wiki_mailcue`
--
ALTER TABLE `c_wiki_mailcue`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `course` (`c_id`),
  ADD KEY `user` (`user_id`),
  ADD KEY `c_id` (`c_id`,`iid`);

--
-- Indizes für die Tabelle `c_wiki_rel_category`
--
ALTER TABLE `c_wiki_rel_category`
  ADD PRIMARY KEY (`wiki_id`,`category_id`),
  ADD KEY `IDX_AC88945BAA948DBE` (`wiki_id`),
  ADD KEY `IDX_AC88945B12469DE2` (`category_id`);

--
-- Indizes für die Tabelle `extra_field`
--
ALTER TABLE `extra_field`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_extra_field_variable_itemtype` (`variable`,`item_type`);

--
-- Indizes für die Tabelle `extra_field_options`
--
ALTER TABLE `extra_field_options`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_A572E3AE443707B0` (`field_id`);

--
-- Indizes für die Tabelle `extra_field_option_rel_field_option`
--
ALTER TABLE `extra_field_option_rel_field_option`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx` (`field_id`,`role_id`,`field_option_id`,`related_field_option_id`),
  ADD KEY `IDX_8E04DF6B42C79BE5` (`field_option_id`),
  ADD KEY `IDX_8E04DF6BCFAFCECC` (`related_field_option_id`),
  ADD KEY `IDX_8E04DF6B443707B0` (`field_id`);

--
-- Indizes für die Tabelle `extra_field_rel_tag`
--
ALTER TABLE `extra_field_rel_tag`
  ADD PRIMARY KEY (`id`),
  ADD KEY `field` (`field_id`),
  ADD KEY `item` (`item_id`),
  ADD KEY `tag` (`tag_id`),
  ADD KEY `field_item_tag` (`field_id`,`item_id`,`tag_id`);

--
-- Indizes für die Tabelle `extra_field_saved_search`
--
ALTER TABLE `extra_field_saved_search`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_16ABE32A443707B0` (`field_id`),
  ADD KEY `IDX_16ABE32AA76ED395` (`user_id`);

--
-- Indizes für die Tabelle `extra_field_values`
--
ALTER TABLE `extra_field_values`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_171DF924443707B0` (`field_id`),
  ADD KEY `IDX_171DF9245DA1941` (`asset_id`),
  ADD KEY `idx_efv_fiii` (`field_id`,`item_id`),
  ADD KEY `idx_efv_item` (`item_id`);

--
-- Indizes für die Tabelle `ext_log_entries`
--
ALTER TABLE `ext_log_entries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `log_class_lookup_idx` (`object_class`),
  ADD KEY `log_date_lookup_idx` (`logged_at`),
  ADD KEY `log_user_lookup_idx` (`username`),
  ADD KEY `log_version_lookup_idx` (`object_id`,`object_class`,`version`);

--
-- Indizes für die Tabelle `ext_translations`
--
ALTER TABLE `ext_translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `lookup_unique_idx` (`foreign_key`,`locale`,`object_class`,`field`);

--
-- Indizes für die Tabelle `fos_group`
--
ALTER TABLE `fos_group`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_4B019DDB77153098` (`code`),
  ADD UNIQUE KEY `UNIQ_4B019DDB2B36786B` (`title`);

--
-- Indizes für die Tabelle `fos_user_user_group`
--
ALTER TABLE `fos_user_user_group`
  ADD PRIMARY KEY (`user_id`,`group_id`),
  ADD KEY `IDX_B3C77447A76ED395` (`user_id`),
  ADD KEY `IDX_B3C77447FE54D947` (`group_id`);

--
-- Indizes für die Tabelle `gradebook_category`
--
ALTER TABLE `gradebook_category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_96A4C705A76ED395` (`user_id`),
  ADD KEY `IDX_96A4C70591D79BD3` (`c_id`),
  ADD KEY `IDX_96A4C705727ACA70` (`parent_id`),
  ADD KEY `IDX_96A4C705613FECDF` (`session_id`),
  ADD KEY `IDX_96A4C705378B7921` (`grade_model_id`),
  ADD KEY `IDX_96A4C705C33F7837` (`document_id`);

--
-- Indizes für die Tabelle `gradebook_certificate`
--
ALTER TABLE `gradebook_certificate`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_650669D1BAD783F` (`resource_node_id`),
  ADD KEY `IDX_650669DE6ADA943` (`cat_id`),
  ADD KEY `idx_gradebook_certificate_user_id` (`user_id`);

--
-- Indizes für die Tabelle `gradebook_comment`
--
ALTER TABLE `gradebook_comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_C3B70763A76ED395` (`user_id`),
  ADD KEY `IDX_C3B70763AD3ED51C` (`gradebook_id`);

--
-- Indizes für die Tabelle `gradebook_evaluation`
--
ALTER TABLE `gradebook_evaluation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_DDDED80491D79BD3` (`c_id`),
  ADD KEY `idx_ge_cat` (`category_id`);

--
-- Indizes für die Tabelle `gradebook_link`
--
ALTER TABLE `gradebook_link`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_4F0F595F91D79BD3` (`c_id`),
  ADD KEY `idx_gl_cat` (`category_id`);

--
-- Indizes für die Tabelle `gradebook_linkeval_log`
--
ALTER TABLE `gradebook_linkeval_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_1F554C7474C99BA2` (`user_id_log`);

--
-- Indizes für die Tabelle `gradebook_result`
--
ALTER TABLE `gradebook_result`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_B88AEB67456C5646` (`evaluation_id`),
  ADD KEY `IDX_B88AEB67A76ED395` (`user_id`),
  ADD KEY `idx_gb_uid_eid` (`user_id`,`evaluation_id`);

--
-- Indizes für die Tabelle `gradebook_result_attempt`
--
ALTER TABLE `gradebook_result_attempt`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_28B1CC3F7A7B643` (`result_id`);

--
-- Indizes für die Tabelle `gradebook_result_log`
--
ALTER TABLE `gradebook_result_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_C5C4CABB7A7B643` (`result_id`),
  ADD KEY `IDX_C5C4CABB456C5646` (`evaluation_id`),
  ADD KEY `IDX_C5C4CABBA76ED395` (`user_id`);

--
-- Indizes für die Tabelle `gradebook_score_display`
--
ALTER TABLE `gradebook_score_display`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indizes für die Tabelle `gradebook_score_log`
--
ALTER TABLE `gradebook_score_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_640C644912469DE2` (`category_id`),
  ADD KEY `idx_gradebook_score_log_user` (`user_id`),
  ADD KEY `idx_gradebook_score_log_user_category` (`user_id`,`category_id`);

--
-- Indizes für die Tabelle `grade_components`
--
ALTER TABLE `grade_components`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_F34247C378B7921` (`grade_model_id`);

--
-- Indizes für die Tabelle `grade_model`
--
ALTER TABLE `grade_model`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `illustration`
--
ALTER TABLE `illustration`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_D67B9A421BAD783F` (`resource_node_id`);

--
-- Indizes für die Tabelle `justification_document`
--
ALTER TABLE `justification_document`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `justification_document_rel_users`
--
ALTER TABLE `justification_document_rel_users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_D1BB19421F2B6144` (`justification_document_id`),
  ADD KEY `IDX_D1BB1942A76ED395` (`user_id`);

--
-- Indizes für die Tabelle `language`
--
ALTER TABLE `language`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_D4DB71B5727ACA70` (`parent_id`);

--
-- Indizes für die Tabelle `legal`
--
ALTER TABLE `legal`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `lti_external_tool`
--
ALTER TABLE `lti_external_tool`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_DB0E04E41BAD783F` (`resource_node_id`),
  ADD KEY `IDX_DB0E04E482F80D8B` (`gradebook_eval_id`);

--
-- Indizes für die Tabelle `lti_lineitem`
--
ALTER TABLE `lti_lineitem`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_5C76B75D1323A575` (`evaluation`),
  ADD KEY `IDX_5C76B75D8F7B22CC` (`tool_id`);

--
-- Indizes für die Tabelle `lti_platform`
--
ALTER TABLE `lti_platform`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `lti_token`
--
ALTER TABLE `lti_token`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_EA71C468F7B22CC` (`tool_id`);

--
-- Indizes für die Tabelle `mail_template`
--
ALTER TABLE `mail_template`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_4AB7DECBF675F31B` (`author_id`),
  ADD KEY `IDX_4AB7DECB81CFDAE7` (`url_id`);

--
-- Indizes für die Tabelle `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_B6BD307F727ACA70` (`parent_id`),
  ADD KEY `idx_message_user_sender` (`user_sender_id`),
  ADD KEY `idx_message_group` (`group_id`),
  ADD KEY `idx_message_type` (`msg_type`);

--
-- Indizes für die Tabelle `message_attachment`
--
ALTER TABLE `message_attachment`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_B68FF5241BAD783F` (`resource_node_id`),
  ADD KEY `IDX_B68FF524537A1329` (`message_id`);

--
-- Indizes für die Tabelle `message_rel_user`
--
ALTER TABLE `message_rel_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `message_receiver` (`message_id`,`user_id`,`receiver_type`),
  ADD KEY `IDX_325D70B9537A1329` (`message_id`),
  ADD KEY `IDX_325D70B9A76ED395` (`user_id`);

--
-- Indizes für die Tabelle `message_rel_user_rel_tags`
--
ALTER TABLE `message_rel_user_rel_tags`
  ADD PRIMARY KEY (`message_rel_user_id`,`message_tag_id`),
  ADD KEY `IDX_B4B37A20962B5422` (`message_rel_user_id`),
  ADD KEY `IDX_B4B37A208DF5FE1E` (`message_tag_id`);

--
-- Indizes für die Tabelle `message_tag`
--
ALTER TABLE `message_tag`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_tag` (`user_id`,`tag`),
  ADD KEY `IDX_2ABC3D6FA76ED395` (`user_id`);

--
-- Indizes für die Tabelle `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mail_notify_sent_index` (`sent_at`),
  ADD KEY `mail_notify_freq_index` (`sent_at`,`send_freq`,`created_at`);

--
-- Indizes für die Tabelle `notification_event`
--
ALTER TABLE `notification_event`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `notification_event_rel_user`
--
ALTER TABLE `notification_event_rel_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_9F7995A671F7E88B` (`event_id`),
  ADD KEY `IDX_9F7995A6A76ED395` (`user_id`);

--
-- Indizes für die Tabelle `page`
--
ALTER TABLE `page`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_140AB62073444FD5` (`access_url_id`),
  ADD KEY `IDX_140AB62061220EA6` (`creator_id`),
  ADD KEY `IDX_140AB62012469DE2` (`category_id`);

--
-- Indizes für die Tabelle `page_category`
--
ALTER TABLE `page_category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_86D31EE161220EA6` (`creator_id`);

--
-- Indizes für die Tabelle `page_layout`
--
ALTER TABLE `page_layout`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_55EC9DFCDE12AB56` (`created_by`),
  ADD UNIQUE KEY `UNIQ_55EC9DFC16FE72E1` (`updated_by`),
  ADD KEY `IDX_55EC9DFC1D784B46` (`page_layout_template_id`);

--
-- Indizes für die Tabelle `page_layout_template`
--
ALTER TABLE `page_layout_template`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `permission`
--
ALTER TABLE `permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_E04992AA989D9B62` (`slug`);

--
-- Indizes für die Tabelle `permission_rel_role`
--
ALTER TABLE `permission_rel_role`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_14B93D3DFED90CCA` (`permission_id`),
  ADD KEY `IDX_14B93D3DD60322AC` (`role_id`);

--
-- Indizes für die Tabelle `personal_file`
--
ALTER TABLE `personal_file`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_BD95312D1BAD783F` (`resource_node_id`);

--
-- Indizes für die Tabelle `plugin`
--
ALTER TABLE `plugin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_E96E27942B36786B` (`title`);

--
-- Indizes für die Tabelle `portfolio`
--
ALTER TABLE `portfolio`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_A9ED10621BAD783F` (`resource_node_id`),
  ADD KEY `IDX_A9ED1062FC4CB679` (`duplicated_from`),
  ADD KEY `category` (`category_id`);

--
-- Indizes für die Tabelle `portfolio_category`
--
ALTER TABLE `portfolio_category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_7AC64359727ACA70` (`parent_id`),
  ADD KEY `user` (`user_id`);

--
-- Indizes für die Tabelle `portfolio_comment`
--
ALTER TABLE `portfolio_comment`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_C2C17DA21BAD783F` (`resource_node_id`),
  ADD KEY `IDX_C2C17DA2126F525E` (`item_id`);

--
-- Indizes für die Tabelle `portfolio_rel_tag`
--
ALTER TABLE `portfolio_rel_tag`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_DB734472BAD26311` (`tag_id`),
  ADD KEY `IDX_DB73447291D79BD3` (`c_id`),
  ADD KEY `IDX_DB734472613FECDF` (`session_id`);

--
-- Indizes für die Tabelle `promotion`
--
ALTER TABLE `promotion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_C11D7DD1B58CDA09` (`career_id`);

--
-- Indizes für die Tabelle `push_subscription`
--
ALTER TABLE `push_subscription`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_push_subscription_user` (`user_id`);

--
-- Indizes für die Tabelle `reset_password_request`
--
ALTER TABLE `reset_password_request`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_7CE748AA76ED395` (`user_id`);

--
-- Indizes für die Tabelle `resource_comment`
--
ALTER TABLE `resource_comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_C9D4B5841BAD783F` (`resource_node_id`),
  ADD KEY `IDX_C9D4B584F675F31B` (`author_id`),
  ADD KEY `IDX_C9D4B584727ACA70` (`parent_id`);

--
-- Indizes für die Tabelle `resource_file`
--
ALTER TABLE `resource_file`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_83BF96AA73444FD5` (`access_url_id`),
  ADD KEY `IDX_83BF96AA1BAD783F` (`resource_node_id`);

--
-- Indizes für die Tabelle `resource_format`
--
ALTER TABLE `resource_format`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `resource_link`
--
ALTER TABLE `resource_link`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_398C394B1BAD783F` (`resource_node_id`),
  ADD KEY `IDX_398C394B91D79BD3` (`c_id`),
  ADD KEY `IDX_398C394B613FECDF` (`session_id`),
  ADD KEY `IDX_398C394BD2112630` (`usergroup_id`),
  ADD KEY `IDX_398C394BFE54D947` (`group_id`),
  ADD KEY `IDX_398C394BA76ED395` (`user_id`),
  ADD KEY `idx_resource_link_sortable_groups` (`c_id`,`session_id`,`usergroup_id`,`group_id`,`user_id`,`resource_type_group`);

--
-- Indizes für die Tabelle `resource_node`
--
ALTER TABLE `resource_node`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_8A5F48FFD17F50A6` (`uuid`),
  ADD KEY `IDX_8A5F48FF98EC6B7B` (`resource_type_id`),
  ADD KEY `IDX_8A5F48FF7EE0A59A` (`resource_format_id`),
  ADD KEY `IDX_8A5F48FF61220EA6` (`creator_id`),
  ADD KEY `IDX_8A5F48FF727ACA70` (`parent_id`);

--
-- Indizes für die Tabelle `resource_right`
--
ALTER TABLE `resource_right`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_9F710F26F004E599` (`resource_link_id`);

--
-- Indizes für die Tabelle `resource_tag`
--
ALTER TABLE `resource_tag`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_23D039CAF675F31B` (`author_id`);

--
-- Indizes für die Tabelle `resource_type`
--
ALTER TABLE `resource_type`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_83FEF7938F7B22CC` (`tool_id`),
  ADD KEY `idx_title` (`title`);

--
-- Indizes für die Tabelle `resource_user_tag`
--
ALTER TABLE `resource_user_tag`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_46131CA5A76ED395` (`user_id`),
  ADD KEY `IDX_46131CA5BAD26311` (`tag_id`);

--
-- Indizes für die Tabelle `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_57698A6A77153098` (`code`);

--
-- Indizes für die Tabelle `room`
--
ALTER TABLE `room`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_729F519BDCD6CC49` (`branch_id`);

--
-- Indizes für die Tabelle `scheduled_announcements`
--
ALTER TABLE `scheduled_announcements`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `search_engine_ref`
--
ALTER TABLE `search_engine_ref`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_473F037891D79BD3` (`c_id`);

--
-- Indizes für die Tabelle `sequence`
--
ALTER TABLE `sequence`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `sequence_condition`
--
ALTER TABLE `sequence_condition`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `sequence_formula`
--
ALTER TABLE `sequence_formula`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_533B9159B2D1386E` (`sequence_method_id`),
  ADD KEY `IDX_533B915955C65E08` (`sequence_variable_id`);

--
-- Indizes für die Tabelle `sequence_method`
--
ALTER TABLE `sequence_method`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `sequence_resource`
--
ALTER TABLE `sequence_resource`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_34ADA43998FB19AE` (`sequence_id`);

--
-- Indizes für die Tabelle `sequence_row_entity`
--
ALTER TABLE `sequence_row_entity`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_2779761FAED14944` (`sequence_type_entity_id`);

--
-- Indizes für die Tabelle `sequence_rule`
--
ALTER TABLE `sequence_rule`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `sequence_rule_condition`
--
ALTER TABLE `sequence_rule_condition`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_F948EE6A4044CA89` (`sequence_rule_id`),
  ADD KEY `IDX_F948EE6A8C0A7083` (`sequence_condition_id`);

--
-- Indizes für die Tabelle `sequence_rule_method`
--
ALTER TABLE `sequence_rule_method`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_6336EA764044CA89` (`sequence_rule_id`),
  ADD KEY `IDX_6336EA76B2D1386E` (`sequence_method_id`);

--
-- Indizes für die Tabelle `sequence_type_entity`
--
ALTER TABLE `sequence_type_entity`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `sequence_valid`
--
ALTER TABLE `sequence_valid`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_F78B9CE655C65E08` (`sequence_variable_id`),
  ADD KEY `IDX_F78B9CE68C0A7083` (`sequence_condition_id`);

--
-- Indizes für die Tabelle `sequence_value`
--
ALTER TABLE `sequence_value`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_66FBF12DA76ED395` (`user_id`),
  ADD KEY `IDX_66FBF12D218736B2` (`sequence_row_entity_id`);

--
-- Indizes für die Tabelle `sequence_variable`
--
ALTER TABLE `sequence_variable`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `session`
--
ALTER TABLE `session`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `title` (`title`),
  ADD KEY `IDX_D044D5D4139DF194` (`promotion_id`),
  ADD KEY `IDX_D044D5D4EE1F8395` (`session_category_id`),
  ADD KEY `IDX_D044D5D43DA5256D` (`image_id`);

--
-- Indizes für die Tabelle `session_category`
--
ALTER TABLE `session_category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_8DE079A973444FD5` (`access_url_id`);

--
-- Indizes für die Tabelle `session_rel_course`
--
ALTER TABLE `session_rel_course`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `course_session_unique` (`session_id`,`c_id`),
  ADD KEY `IDX_12D110D3613FECDF` (`session_id`),
  ADD KEY `idx_session_rel_course_course_id` (`c_id`);

--
-- Indizes für die Tabelle `session_rel_course_rel_user`
--
ALTER TABLE `session_rel_course_rel_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `course_session_unique` (`session_id`,`c_id`,`user_id`,`status`),
  ADD KEY `IDX_720167E613FECDF` (`session_id`),
  ADD KEY `idx_session_rel_course_rel_user_id_user` (`user_id`),
  ADD KEY `idx_session_rel_course_rel_user_course_id` (`c_id`);

--
-- Indizes für die Tabelle `session_rel_user`
--
ALTER TABLE `session_rel_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `session_user_unique` (`session_id`,`user_id`,`relation_type`),
  ADD KEY `IDX_B0D7D4C0613FECDF` (`session_id`),
  ADD KEY `IDX_B0D7D4C0A76ED395` (`user_id`),
  ADD KEY `idx_session_rel_user_id_user_moved` (`user_id`,`moved_to`);

--
-- Indizes für die Tabelle `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_setting` (`variable`,`subkey`,`access_url`),
  ADD KEY `IDX_E545A0C5C72FB79B` (`value_template_id`),
  ADD KEY `access_url` (`access_url`);

--
-- Indizes für die Tabelle `settings_options`
--
ALTER TABLE `settings_options`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_setting_option` (`variable`,`value`);

--
-- Indizes für die Tabelle `settings_value_template`
--
ALTER TABLE `settings_value_template`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_settings_value_template_variable` (`variable`);

--
-- Indizes für die Tabelle `skill`
--
ALTER TABLE `skill`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_5E3DE477CCFA12B8` (`profile_id`),
  ADD KEY `IDX_5E3DE4775DA1941` (`asset_id`);

--
-- Indizes für die Tabelle `skill_level`
--
ALTER TABLE `skill_level`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_BFC25F2FCCFA12B8` (`profile_id`);

--
-- Indizes für die Tabelle `skill_level_profile`
--
ALTER TABLE `skill_level_profile`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `skill_profile`
--
ALTER TABLE `skill_profile`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `skill_rel_course`
--
ALTER TABLE `skill_rel_course`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_E7CEC7FA5585C142` (`skill_id`),
  ADD KEY `IDX_E7CEC7FA91D79BD3` (`c_id`),
  ADD KEY `IDX_E7CEC7FA613FECDF` (`session_id`);

--
-- Indizes für die Tabelle `skill_rel_gradebook`
--
ALTER TABLE `skill_rel_gradebook`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_4AC0B45E5585C142` (`skill_id`),
  ADD KEY `IDX_4AC0B45EAD3ED51C` (`gradebook_id`);

--
-- Indizes für die Tabelle `skill_rel_item`
--
ALTER TABLE `skill_rel_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_EB5B2A0D5585C142` (`skill_id`);

--
-- Indizes für die Tabelle `skill_rel_item_rel_user`
--
ALTER TABLE `skill_rel_item_rel_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_D1133E0DFD4B12DC` (`skill_rel_item_id`),
  ADD KEY `IDX_D1133E0DA76ED395` (`user_id`);

--
-- Indizes für die Tabelle `skill_rel_profile`
--
ALTER TABLE `skill_rel_profile`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_6E73EA8D5585C142` (`skill_id`),
  ADD KEY `IDX_6E73EA8DCCFA12B8` (`profile_id`);

--
-- Indizes für die Tabelle `skill_rel_skill`
--
ALTER TABLE `skill_rel_skill`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_DA77E5A65585C142` (`skill_id`),
  ADD KEY `IDX_DA77E5A6727ACA70` (`parent_id`);

--
-- Indizes für die Tabelle `skill_rel_user`
--
ALTER TABLE `skill_rel_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_79D3D95AA76ED395` (`user_id`),
  ADD KEY `IDX_79D3D95A5585C142` (`skill_id`),
  ADD KEY `IDX_79D3D95A591CC992` (`course_id`),
  ADD KEY `IDX_79D3D95A613FECDF` (`session_id`),
  ADD KEY `IDX_79D3D95AF68F11CE` (`acquired_level`),
  ADD KEY `idx_select_cs` (`course_id`,`session_id`),
  ADD KEY `idx_select_s_c_u` (`session_id`,`course_id`,`user_id`),
  ADD KEY `idx_select_sk_u` (`skill_id`,`user_id`);

--
-- Indizes für die Tabelle `skill_rel_user_comment`
--
ALTER TABLE `skill_rel_user_comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_7AE9F6B6484A9317` (`skill_rel_user_id`),
  ADD KEY `IDX_7AE9F6B63AF3B65B` (`feedback_giver_id`),
  ADD KEY `idx_select_su_giver` (`skill_rel_user_id`,`feedback_giver_id`);

--
-- Indizes für die Tabelle `social_post`
--
ALTER TABLE `social_post`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_159BBFE9727ACA70` (`parent_id`),
  ADD KEY `idx_social_post_sender` (`sender_id`),
  ADD KEY `idx_social_post_user` (`user_receiver_id`),
  ADD KEY `idx_social_post_group` (`group_receiver_id`),
  ADD KEY `idx_social_post_type` (`type`);

--
-- Indizes für die Tabelle `social_post_attachments`
--
ALTER TABLE `social_post_attachments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_DF2A8F341BAD783F` (`resource_node_id`),
  ADD KEY `IDX_DF2A8F34C4F2D6B1` (`social_post_id`);

--
-- Indizes für die Tabelle `social_post_feedback`
--
ALTER TABLE `social_post_feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_DB7E436DC4F2D6B1` (`social_post_id`),
  ADD KEY `IDX_DB7E436DA76ED395` (`user_id`),
  ADD KEY `idx_social_post_uid_spid` (`social_post_id`,`user_id`);

--
-- Indizes für die Tabelle `specific_field`
--
ALTER TABLE `specific_field`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_specific_field__code` (`code`);

--
-- Indizes für die Tabelle `specific_field_values`
--
ALTER TABLE `specific_field_values`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `system_template`
--
ALTER TABLE `system_template`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_FE8AAE013DA5256D` (`image_id`);

--
-- Indizes für die Tabelle `sys_announcement`
--
ALTER TABLE `sys_announcement`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_E4A3EAD473444FD5` (`access_url_id`),
  ADD KEY `IDX_E4A3EAD4B58CDA09` (`career_id`),
  ADD KEY `IDX_E4A3EAD4139DF194` (`promotion_id`);

--
-- Indizes für die Tabelle `tag`
--
ALTER TABLE `tag`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_389B783443707B0` (`field_id`);

--
-- Indizes für die Tabelle `templates`
--
ALTER TABLE `templates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_6F287D8E91D79BD3` (`c_id`),
  ADD KEY `IDX_6F287D8EA76ED395` (`user_id`),
  ADD KEY `IDX_6F287D8E3DA5256D` (`image_id`);

--
-- Indizes für die Tabelle `third_party`
--
ALTER TABLE `third_party`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `third_party_data_exchange`
--
ALTER TABLE `third_party_data_exchange`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_162BE47354C4149C` (`third_party_id`);

--
-- Indizes für die Tabelle `third_party_data_exchange_user`
--
ALTER TABLE `third_party_data_exchange_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_1F59F6F4A658DC87` (`third_party_data_exchange_id`),
  ADD KEY `IDX_1F59F6F4A76ED395` (`user_id`);

--
-- Indizes für die Tabelle `ticket_assigned_log`
--
ALTER TABLE `ticket_assigned_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_54B65868700047D2` (`ticket_id`),
  ADD KEY `IDX_54B65868A76ED395` (`user_id`);

--
-- Indizes für die Tabelle `ticket_category`
--
ALTER TABLE `ticket_category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_8325E540166D1F9C` (`project_id`);

--
-- Indizes für die Tabelle `ticket_category_rel_user`
--
ALTER TABLE `ticket_category_rel_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_5B8A98712469DE2` (`category_id`),
  ADD KEY `IDX_5B8A987A76ED395` (`user_id`);

--
-- Indizes für die Tabelle `ticket_message`
--
ALTER TABLE `ticket_message`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_BA71692D700047D2` (`ticket_id`);

--
-- Indizes für die Tabelle `ticket_message_attachments`
--
ALTER TABLE `ticket_message_attachments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_70BF9E261BAD783F` (`resource_node_id`),
  ADD KEY `IDX_70BF9E26700047D2` (`ticket_id`),
  ADD KEY `IDX_70BF9E26537A1329` (`message_id`);

--
-- Indizes für die Tabelle `ticket_priority`
--
ALTER TABLE `ticket_priority`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_E7CF20A673444FD5` (`access_url_id`);

--
-- Indizes für die Tabelle `ticket_project`
--
ALTER TABLE `ticket_project`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_237F89BC73444FD5` (`access_url_id`);

--
-- Indizes für die Tabelle `ticket_rel_user`
--
ALTER TABLE `ticket_rel_user`
  ADD PRIMARY KEY (`user_id`,`ticket_id`),
  ADD KEY `IDX_BE124829A76ED395` (`user_id`),
  ADD KEY `IDX_BE124829700047D2` (`ticket_id`);

--
-- Indizes für die Tabelle `ticket_status`
--
ALTER TABLE `ticket_status`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_1420FD773444FD5` (`access_url_id`);

--
-- Indizes für die Tabelle `ticket_ticket`
--
ALTER TABLE `ticket_ticket`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_EDE2C768166D1F9C` (`project_id`),
  ADD KEY `IDX_EDE2C76812469DE2` (`category_id`),
  ADD KEY `IDX_EDE2C768497B19F9` (`priority_id`),
  ADD KEY `IDX_EDE2C768591CC992` (`course_id`),
  ADD KEY `IDX_EDE2C768613FECDF` (`session_id`),
  ADD KEY `IDX_EDE2C7686219A7B7` (`assigned_last_user`),
  ADD KEY `IDX_EDE2C7686BF700BD` (`status_id`),
  ADD KEY `IDX_EDE2C76873444FD5` (`access_url_id`);

--
-- Indizes für die Tabelle `tool`
--
ALTER TABLE `tool`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_20F33ED12B36786B` (`title`);

--
-- Indizes für die Tabelle `tool_resource_right`
--
ALTER TABLE `tool_resource_right`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_E5C562598F7B22CC` (`tool_id`);

--
-- Indizes für die Tabelle `track_e_access`
--
ALTER TABLE `track_e_access`
  ADD PRIMARY KEY (`access_id`),
  ADD KEY `access_user_id` (`access_user_id`),
  ADD KEY `access_c_id` (`c_id`),
  ADD KEY `session_id` (`session_id`),
  ADD KEY `user_course_session_date` (`access_user_id`,`c_id`,`session_id`,`access_date`);

--
-- Indizes für die Tabelle `track_e_access_complete`
--
ALTER TABLE `track_e_access_complete`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_57FAFDBFA76ED395` (`user_id`);

--
-- Indizes für die Tabelle `track_e_attempt`
--
ALTER TABLE `track_e_attempt`
  ADD PRIMARY KEY (`id`),
  ADD KEY `exe_id` (`exe_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `question_id` (`question_id`),
  ADD KEY `idx_track_e_attempt_tms` (`tms`);

--
-- Indizes für die Tabelle `track_e_attempt_coeff`
--
ALTER TABLE `track_e_attempt_coeff`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `track_e_attempt_qualify`
--
ALTER TABLE `track_e_attempt_qualify`
  ADD PRIMARY KEY (`id`),
  ADD KEY `exe_id` (`exe_id`),
  ADD KEY `question_id` (`question_id`),
  ADD KEY `session_id` (`session_id`);

--
-- Indizes für die Tabelle `track_e_course_access`
--
ALTER TABLE `track_e_course_access`
  ADD PRIMARY KEY (`course_access_id`),
  ADD KEY `course` (`c_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `login_course_date` (`login_course_date`),
  ADD KEY `session_id` (`session_id`),
  ADD KEY `user_course_session_date` (`user_id`,`c_id`,`session_id`,`login_course_date`);

--
-- Indizes für die Tabelle `track_e_default`
--
ALTER TABLE `track_e_default`
  ADD PRIMARY KEY (`default_id`),
  ADD KEY `course` (`c_id`),
  ADD KEY `session` (`session_id`),
  ADD KEY `idx_default_user_id` (`default_user_id`);

--
-- Indizes für die Tabelle `track_e_downloads`
--
ALTER TABLE `track_e_downloads`
  ADD PRIMARY KEY (`down_id`),
  ADD KEY `IDX_EEDF4DA6F004E599` (`resource_link_id`),
  ADD KEY `idx_ted_user_id` (`down_user_id`);

--
-- Indizes für die Tabelle `track_e_exercises`
--
ALTER TABLE `track_e_exercises`
  ADD PRIMARY KEY (`exe_id`),
  ADD KEY `IDX_AA0DA082B9773F9E` (`exe_exo_id`),
  ADD KEY `idx_tee_user_id` (`exe_user_id`),
  ADD KEY `idx_tee_c_id` (`c_id`),
  ADD KEY `session_id` (`session_id`);

--
-- Indizes für die Tabelle `track_e_exercise_confirmation`
--
ALTER TABLE `track_e_exercise_confirmation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_980C28C7A76ED395` (`user_id`);

--
-- Indizes für die Tabelle `track_e_hotpotatoes`
--
ALTER TABLE `track_e_hotpotatoes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tehp_user_id` (`exe_user_id`),
  ADD KEY `idx_tehp_c_id` (`c_id`);

--
-- Indizes für die Tabelle `track_e_hotspot`
--
ALTER TABLE `track_e_hotspot`
  ADD PRIMARY KEY (`hotspot_id`),
  ADD KEY `IDX_A89CC3B691D79BD3` (`c_id`),
  ADD KEY `hotspot_user_id` (`hotspot_user_id`),
  ADD KEY `hotspot_exe_id` (`hotspot_exe_id`),
  ADD KEY `hotspot_question_id` (`hotspot_question_id`);

--
-- Indizes für die Tabelle `track_e_lastaccess`
--
ALTER TABLE `track_e_lastaccess`
  ADD PRIMARY KEY (`access_id`),
  ADD KEY `access_user_id` (`access_user_id`),
  ADD KEY `access_c_id` (`c_id`),
  ADD KEY `session_id` (`session_id`);

--
-- Indizes für die Tabelle `track_e_links`
--
ALTER TABLE `track_e_links`
  ADD PRIMARY KEY (`links_id`),
  ADD KEY `idx_tel_c_id` (`c_id`),
  ADD KEY `idx_tel_user_id` (`links_user_id`),
  ADD KEY `session_id` (`session_id`);

--
-- Indizes für die Tabelle `track_e_login`
--
ALTER TABLE `track_e_login`
  ADD PRIMARY KEY (`login_id`),
  ADD KEY `login_user_id` (`login_user_id`),
  ADD KEY `idx_track_e_login_date` (`login_date`);

--
-- Indizes für die Tabelle `track_e_login_record`
--
ALTER TABLE `track_e_login_record`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `track_e_online`
--
ALTER TABLE `track_e_online`
  ADD PRIMARY KEY (`login_id`),
  ADD KEY `course` (`c_id`),
  ADD KEY `login_user_id` (`login_user_id`),
  ADD KEY `session_id` (`session_id`);

--
-- Indizes für die Tabelle `track_e_uploads`
--
ALTER TABLE `track_e_uploads`
  ADD PRIMARY KEY (`upload_id`),
  ADD KEY `course` (`c_id`),
  ADD KEY `upload_user_id` (`upload_user_id`),
  ADD KEY `session_id` (`session_id`);

--
-- Indizes für die Tabelle `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_8D93D649F85E0677` (`username`),
  ADD UNIQUE KEY `UNIQ_8D93D649D17F50A6` (`uuid`),
  ADD UNIQUE KEY `UNIQ_8D93D6497BA2F5EB` (`api_token`),
  ADD UNIQUE KEY `UNIQ_8D93D6491BAD783F` (`resource_node_id`),
  ADD KEY `status` (`status`);

--
-- Indizes für die Tabelle `usergroup`
--
ALTER TABLE `usergroup`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_4A6478171BAD783F` (`resource_node_id`);

--
-- Indizes für die Tabelle `usergroup_rel_course`
--
ALTER TABLE `usergroup_rel_course`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_4A8DF159D2112630` (`usergroup_id`),
  ADD KEY `IDX_4A8DF159591CC992` (`course_id`);

--
-- Indizes für die Tabelle `usergroup_rel_question`
--
ALTER TABLE `usergroup_rel_question`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_FF3E58F21E27F6BF` (`question_id`),
  ADD KEY `IDX_FF3E58F2D2112630` (`usergroup_id`);

--
-- Indizes für die Tabelle `usergroup_rel_session`
--
ALTER TABLE `usergroup_rel_session`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_70122432D2112630` (`usergroup_id`),
  ADD KEY `IDX_70122432613FECDF` (`session_id`);

--
-- Indizes für die Tabelle `usergroup_rel_user`
--
ALTER TABLE `usergroup_rel_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_739515A9A76ED395` (`user_id`),
  ADD KEY `IDX_739515A9D2112630` (`usergroup_id`);

--
-- Indizes für die Tabelle `usergroup_rel_usergroup`
--
ALTER TABLE `usergroup_rel_usergroup`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `user_api_key`
--
ALTER TABLE `user_api_key`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_api_keys_user` (`user_id`);

--
-- Indizes für die Tabelle `user_auth_source`
--
ALTER TABLE `user_auth_source`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_D632110481CFDAE7` (`url_id`),
  ADD KEY `IDX_D6321104A76ED395` (`user_id`);

--
-- Indizes für die Tabelle `user_career`
--
ALTER TABLE `user_career`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_D70977B9A76ED395` (`user_id`),
  ADD KEY `IDX_D70977B9B58CDA09` (`career_id`);

--
-- Indizes für die Tabelle `user_course_category`
--
ALTER TABLE `user_course_category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_c_cat_uid` (`user_id`);

--
-- Indizes für die Tabelle `user_friend_relation_type`
--
ALTER TABLE `user_friend_relation_type`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `user_rel_course_vote`
--
ALTER TABLE `user_rel_course_vote`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_4038AA47613FECDF` (`session_id`),
  ADD KEY `IDX_4038AA4781CFDAE7` (`url_id`),
  ADD KEY `idx_ucv_cid` (`c_id`),
  ADD KEY `idx_ucv_uid` (`user_id`),
  ADD KEY `idx_ucv_cuid` (`user_id`,`c_id`);

--
-- Indizes für die Tabelle `user_rel_tag`
--
ALTER TABLE `user_rel_tag`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_urt_uid` (`user_id`),
  ADD KEY `idx_urt_tid` (`tag_id`);

--
-- Indizes für die Tabelle `user_rel_user`
--
ALTER TABLE `user_rel_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_friend_relation` (`user_id`,`friend_user_id`,`relation_type`),
  ADD KEY `idx_user_rel_user__user` (`user_id`),
  ADD KEY `idx_user_rel_user__friend_user` (`friend_user_id`),
  ADD KEY `idx_user_rel_user__user_friend_user` (`user_id`,`friend_user_id`);

--
-- Indizes für die Tabelle `validation_token`
--
ALTER TABLE `validation_token`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_type_hash` (`type`,`hash`);

--
-- Indizes für die Tabelle `xapi_activity_profile`
--
ALTER TABLE `xapi_activity_profile`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `xapi_activity_state`
--
ALTER TABLE `xapi_activity_state`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `xapi_actor`
--
ALTER TABLE `xapi_actor`
  ADD PRIMARY KEY (`identifier`);

--
-- Indizes für die Tabelle `xapi_attachment`
--
ALTER TABLE `xapi_attachment`
  ADD PRIMARY KEY (`identifier`),
  ADD KEY `IDX_7148C9A1849CB65B` (`statement_id`);

--
-- Indizes für die Tabelle `xapi_cmi5_item`
--
ALTER TABLE `xapi_cmi5_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_7CA116D879066886` (`root_id`),
  ADD KEY `IDX_7CA116D8727ACA70` (`parent_id`),
  ADD KEY `IDX_7CA116D88F7B22CC` (`tool_id`);

--
-- Indizes für die Tabelle `xapi_context`
--
ALTER TABLE `xapi_context`
  ADD PRIMARY KEY (`identifier`),
  ADD UNIQUE KEY `UNIQ_3D7771908C4FC193` (`instructor_id`),
  ADD UNIQUE KEY `UNIQ_3D777190296CD8AE` (`team_id`),
  ADD UNIQUE KEY `UNIQ_3D777190D0A19400` (`extensions_id`);

--
-- Indizes für die Tabelle `xapi_extensions`
--
ALTER TABLE `xapi_extensions`
  ADD PRIMARY KEY (`identifier`);

--
-- Indizes für die Tabelle `xapi_internal_log`
--
ALTER TABLE `xapi_internal_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_C1C667ACA76ED395` (`user_id`);

--
-- Indizes für die Tabelle `xapi_lrs_auth`
--
ALTER TABLE `xapi_lrs_auth`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `xapi_object`
--
ALTER TABLE `xapi_object`
  ADD PRIMARY KEY (`identifier`),
  ADD UNIQUE KEY `UNIQ_E2B6864010DAF24A` (`actor_id`),
  ADD UNIQUE KEY `UNIQ_E2B68640C1D03483` (`verb_id`),
  ADD UNIQUE KEY `UNIQ_E2B68640232D562B` (`object_id`),
  ADD UNIQUE KEY `UNIQ_E2B68640D1735DC4` (`activity_extensions_id`),
  ADD KEY `IDX_E2B68640FE54D947` (`group_id`),
  ADD KEY `IDX_E2B686402C43459F` (`parent_context_id`),
  ADD KEY `IDX_E2B68640C89A54F0` (`grouping_context_id`),
  ADD KEY `IDX_E2B686404D1E91B1` (`category_context_id`),
  ADD KEY `IDX_E2B68640D0D57945` (`other_context_id`);

--
-- Indizes für die Tabelle `xapi_result`
--
ALTER TABLE `xapi_result`
  ADD PRIMARY KEY (`identifier`),
  ADD UNIQUE KEY `UNIQ_5971ECBFD0A19400` (`extensions_id`);

--
-- Indizes für die Tabelle `xapi_shared_statement`
--
ALTER TABLE `xapi_shared_statement`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_uuid` (`uuid`);

--
-- Indizes für die Tabelle `xapi_statement`
--
ALTER TABLE `xapi_statement`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_BAF6663B10DAF24A` (`actor_id`),
  ADD UNIQUE KEY `UNIQ_BAF6663BC1D03483` (`verb_id`),
  ADD UNIQUE KEY `UNIQ_BAF6663B232D562B` (`object_id`),
  ADD UNIQUE KEY `UNIQ_BAF6663B7A7B643` (`result_id`),
  ADD UNIQUE KEY `UNIQ_BAF6663B81EC865B` (`authority_id`),
  ADD UNIQUE KEY `UNIQ_BAF6663B6B00C1CF` (`context_id`);

--
-- Indizes für die Tabelle `xapi_tool_launch`
--
ALTER TABLE `xapi_tool_launch`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_E18CB583591CC992` (`course_id`),
  ADD KEY `IDX_E18CB583613FECDF` (`session_id`);

--
-- Indizes für die Tabelle `xapi_verb`
--
ALTER TABLE `xapi_verb`
  ADD PRIMARY KEY (`identifier`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `access_url`
--
ALTER TABLE `access_url`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `access_url_rel_color_theme`
--
ALTER TABLE `access_url_rel_color_theme`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `access_url_rel_course`
--
ALTER TABLE `access_url_rel_course`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `access_url_rel_course_category`
--
ALTER TABLE `access_url_rel_course_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT für Tabelle `access_url_rel_plugin`
--
ALTER TABLE `access_url_rel_plugin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `access_url_rel_session`
--
ALTER TABLE `access_url_rel_session`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `access_url_rel_user`
--
ALTER TABLE `access_url_rel_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT für Tabelle `access_url_rel_usergroup`
--
ALTER TABLE `access_url_rel_usergroup`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `agenda_reminder`
--
ALTER TABLE `agenda_reminder`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `ai_requests`
--
ALTER TABLE `ai_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `azure_sync_state`
--
ALTER TABLE `azure_sync_state`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `block`
--
ALTER TABLE `block`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `branch_sync`
--
ALTER TABLE `branch_sync`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `branch_transaction`
--
ALTER TABLE `branch_transaction`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `branch_transaction_status`
--
ALTER TABLE `branch_transaction_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `career`
--
ALTER TABLE `career`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `catalogue_course_rel_access_url_rel_usergroup`
--
ALTER TABLE `catalogue_course_rel_access_url_rel_usergroup`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `catalogue_session_rel_access_url_rel_usergroup`
--
ALTER TABLE `catalogue_session_rel_access_url_rel_usergroup`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `chat`
--
ALTER TABLE `chat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `chat_video`
--
ALTER TABLE `chat_video`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `color_theme`
--
ALTER TABLE `color_theme`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `conference_activity`
--
ALTER TABLE `conference_activity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `conference_meeting`
--
ALTER TABLE `conference_meeting`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `conference_recording`
--
ALTER TABLE `conference_recording`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `contact_form_contact_category`
--
ALTER TABLE `contact_form_contact_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `course`
--
ALTER TABLE `course`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `course_category`
--
ALTER TABLE `course_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT für Tabelle `course_rel_user`
--
ALTER TABLE `course_rel_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT für Tabelle `course_rel_user_catalogue`
--
ALTER TABLE `course_rel_user_catalogue`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `course_request`
--
ALTER TABLE `course_request`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `course_type`
--
ALTER TABLE `course_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT für Tabelle `c_announcement`
--
ALTER TABLE `c_announcement`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `c_announcement_attachment`
--
ALTER TABLE `c_announcement_attachment`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_attendance`
--
ALTER TABLE `c_attendance`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_attendance_calendar`
--
ALTER TABLE `c_attendance_calendar`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_attendance_calendar_rel_group`
--
ALTER TABLE `c_attendance_calendar_rel_group`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_attendance_result`
--
ALTER TABLE `c_attendance_result`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_attendance_result_comment`
--
ALTER TABLE `c_attendance_result_comment`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_attendance_sheet`
--
ALTER TABLE `c_attendance_sheet`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_attendance_sheet_log`
--
ALTER TABLE `c_attendance_sheet_log`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_autogroup_user_invitation`
--
ALTER TABLE `c_autogroup_user_invitation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_blog`
--
ALTER TABLE `c_blog`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_blog_attachment`
--
ALTER TABLE `c_blog_attachment`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_blog_comment`
--
ALTER TABLE `c_blog_comment`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_blog_post`
--
ALTER TABLE `c_blog_post`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_blog_rating`
--
ALTER TABLE `c_blog_rating`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_blog_rel_user`
--
ALTER TABLE `c_blog_rel_user`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_blog_task`
--
ALTER TABLE `c_blog_task`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_blog_task_rel_user`
--
ALTER TABLE `c_blog_task_rel_user`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_calendar_event`
--
ALTER TABLE `c_calendar_event`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT für Tabelle `c_calendar_event_attachment`
--
ALTER TABLE `c_calendar_event_attachment`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_calendar_event_repeat`
--
ALTER TABLE `c_calendar_event_repeat`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_calendar_event_repeat_not`
--
ALTER TABLE `c_calendar_event_repeat_not`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_chat_connected`
--
ALTER TABLE `c_chat_connected`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT für Tabelle `c_chat_conversation`
--
ALTER TABLE `c_chat_conversation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT für Tabelle `c_course_description`
--
ALTER TABLE `c_course_description`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_course_setting`
--
ALTER TABLE `c_course_setting`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT für Tabelle `c_document`
--
ALTER TABLE `c_document`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT für Tabelle `c_dropbox_category`
--
ALTER TABLE `c_dropbox_category`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_dropbox_feedback`
--
ALTER TABLE `c_dropbox_feedback`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_dropbox_file`
--
ALTER TABLE `c_dropbox_file`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_dropbox_person`
--
ALTER TABLE `c_dropbox_person`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_dropbox_post`
--
ALTER TABLE `c_dropbox_post`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_forum_attachment`
--
ALTER TABLE `c_forum_attachment`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_forum_category`
--
ALTER TABLE `c_forum_category`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `c_forum_forum`
--
ALTER TABLE `c_forum_forum`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `c_forum_mailcue`
--
ALTER TABLE `c_forum_mailcue`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_forum_notification`
--
ALTER TABLE `c_forum_notification`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `c_forum_post`
--
ALTER TABLE `c_forum_post`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `c_forum_thread`
--
ALTER TABLE `c_forum_thread`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `c_forum_thread_qualify`
--
ALTER TABLE `c_forum_thread_qualify`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_forum_thread_qualify_log`
--
ALTER TABLE `c_forum_thread_qualify_log`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_glossary`
--
ALTER TABLE `c_glossary`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_group_category`
--
ALTER TABLE `c_group_category`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `c_group_info`
--
ALTER TABLE `c_group_info`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_group_rel_tutor`
--
ALTER TABLE `c_group_rel_tutor`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_group_rel_user`
--
ALTER TABLE `c_group_rel_user`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_group_rel_usergroup`
--
ALTER TABLE `c_group_rel_usergroup`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_link`
--
ALTER TABLE `c_link`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT für Tabelle `c_link_category`
--
ALTER TABLE `c_link_category`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_lp`
--
ALTER TABLE `c_lp`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_lp_category`
--
ALTER TABLE `c_lp_category`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_lp_category_rel_user`
--
ALTER TABLE `c_lp_category_rel_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_lp_item`
--
ALTER TABLE `c_lp_item`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_lp_item_view`
--
ALTER TABLE `c_lp_item_view`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_lp_iv_interaction`
--
ALTER TABLE `c_lp_iv_interaction`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_lp_iv_objective`
--
ALTER TABLE `c_lp_iv_objective`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_lp_rel_user`
--
ALTER TABLE `c_lp_rel_user`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_lp_rel_usergroup`
--
ALTER TABLE `c_lp_rel_usergroup`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_lp_user_access`
--
ALTER TABLE `c_lp_user_access`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_lp_view`
--
ALTER TABLE `c_lp_view`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_notebook`
--
ALTER TABLE `c_notebook`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_peer_assessment`
--
ALTER TABLE `c_peer_assessment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_peer_assessment_correction`
--
ALTER TABLE `c_peer_assessment_correction`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_peer_assessment_correction_criteria`
--
ALTER TABLE `c_peer_assessment_correction_criteria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_peer_assessment_criteria`
--
ALTER TABLE `c_peer_assessment_criteria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_peer_assessment_log`
--
ALTER TABLE `c_peer_assessment_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_peer_assessment_rel_student_publication`
--
ALTER TABLE `c_peer_assessment_rel_student_publication`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_peer_autogroup_rel_student_publication`
--
ALTER TABLE `c_peer_autogroup_rel_student_publication`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_plagiarism_compilatio_docs`
--
ALTER TABLE `c_plagiarism_compilatio_docs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_quiz`
--
ALTER TABLE `c_quiz`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `c_quiz_answer`
--
ALTER TABLE `c_quiz_answer`
  MODIFY `iid` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT für Tabelle `c_quiz_category`
--
ALTER TABLE `c_quiz_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_quiz_question`
--
ALTER TABLE `c_quiz_question`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `c_quiz_question_category`
--
ALTER TABLE `c_quiz_question_category`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_quiz_question_option`
--
ALTER TABLE `c_quiz_question_option`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_quiz_rel_category`
--
ALTER TABLE `c_quiz_rel_category`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_quiz_rel_question`
--
ALTER TABLE `c_quiz_rel_question`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `c_shortcut`
--
ALTER TABLE `c_shortcut`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_student_publication`
--
ALTER TABLE `c_student_publication`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_student_publication_assignment`
--
ALTER TABLE `c_student_publication_assignment`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_student_publication_comment`
--
ALTER TABLE `c_student_publication_comment`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_student_publication_correction`
--
ALTER TABLE `c_student_publication_correction`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_student_publication_rel_document`
--
ALTER TABLE `c_student_publication_rel_document`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_student_publication_rel_user`
--
ALTER TABLE `c_student_publication_rel_user`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_survey`
--
ALTER TABLE `c_survey`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_survey_answer`
--
ALTER TABLE `c_survey_answer`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_survey_invitation`
--
ALTER TABLE `c_survey_invitation`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_survey_question`
--
ALTER TABLE `c_survey_question`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_survey_question_option`
--
ALTER TABLE `c_survey_question_option`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_thematic`
--
ALTER TABLE `c_thematic`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_thematic_advance`
--
ALTER TABLE `c_thematic_advance`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_thematic_plan`
--
ALTER TABLE `c_thematic_plan`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_tool`
--
ALTER TABLE `c_tool`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT für Tabelle `c_tool_intro`
--
ALTER TABLE `c_tool_intro`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `c_wiki`
--
ALTER TABLE `c_wiki`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_wiki_category`
--
ALTER TABLE `c_wiki_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_wiki_conf`
--
ALTER TABLE `c_wiki_conf`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_wiki_discuss`
--
ALTER TABLE `c_wiki_discuss`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `c_wiki_mailcue`
--
ALTER TABLE `c_wiki_mailcue`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `extra_field`
--
ALTER TABLE `extra_field`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT für Tabelle `extra_field_options`
--
ALTER TABLE `extra_field_options`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT für Tabelle `extra_field_option_rel_field_option`
--
ALTER TABLE `extra_field_option_rel_field_option`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `extra_field_rel_tag`
--
ALTER TABLE `extra_field_rel_tag`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `extra_field_saved_search`
--
ALTER TABLE `extra_field_saved_search`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `extra_field_values`
--
ALTER TABLE `extra_field_values`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT für Tabelle `ext_log_entries`
--
ALTER TABLE `ext_log_entries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `ext_translations`
--
ALTER TABLE `ext_translations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `fos_group`
--
ALTER TABLE `fos_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT für Tabelle `gradebook_category`
--
ALTER TABLE `gradebook_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `gradebook_certificate`
--
ALTER TABLE `gradebook_certificate`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `gradebook_comment`
--
ALTER TABLE `gradebook_comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `gradebook_evaluation`
--
ALTER TABLE `gradebook_evaluation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `gradebook_link`
--
ALTER TABLE `gradebook_link`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `gradebook_linkeval_log`
--
ALTER TABLE `gradebook_linkeval_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `gradebook_result`
--
ALTER TABLE `gradebook_result`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `gradebook_result_attempt`
--
ALTER TABLE `gradebook_result_attempt`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `gradebook_result_log`
--
ALTER TABLE `gradebook_result_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `gradebook_score_display`
--
ALTER TABLE `gradebook_score_display`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `gradebook_score_log`
--
ALTER TABLE `gradebook_score_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `grade_components`
--
ALTER TABLE `grade_components`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `grade_model`
--
ALTER TABLE `grade_model`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `justification_document`
--
ALTER TABLE `justification_document`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `justification_document_rel_users`
--
ALTER TABLE `justification_document_rel_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `language`
--
ALTER TABLE `language`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT für Tabelle `legal`
--
ALTER TABLE `legal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `lti_external_tool`
--
ALTER TABLE `lti_external_tool`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `lti_lineitem`
--
ALTER TABLE `lti_lineitem`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `lti_platform`
--
ALTER TABLE `lti_platform`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `lti_token`
--
ALTER TABLE `lti_token`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `mail_template`
--
ALTER TABLE `mail_template`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `message`
--
ALTER TABLE `message`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT für Tabelle `message_attachment`
--
ALTER TABLE `message_attachment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT für Tabelle `message_rel_user`
--
ALTER TABLE `message_rel_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT für Tabelle `message_tag`
--
ALTER TABLE `message_tag`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `notification`
--
ALTER TABLE `notification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT für Tabelle `notification_event`
--
ALTER TABLE `notification_event`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `notification_event_rel_user`
--
ALTER TABLE `notification_event_rel_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `page`
--
ALTER TABLE `page`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT für Tabelle `page_category`
--
ALTER TABLE `page_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT für Tabelle `page_layout`
--
ALTER TABLE `page_layout`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `page_layout_template`
--
ALTER TABLE `page_layout_template`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `permission`
--
ALTER TABLE `permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;

--
-- AUTO_INCREMENT für Tabelle `permission_rel_role`
--
ALTER TABLE `permission_rel_role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=270;

--
-- AUTO_INCREMENT für Tabelle `personal_file`
--
ALTER TABLE `personal_file`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT für Tabelle `plugin`
--
ALTER TABLE `plugin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `portfolio`
--
ALTER TABLE `portfolio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `portfolio_category`
--
ALTER TABLE `portfolio_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `portfolio_comment`
--
ALTER TABLE `portfolio_comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `portfolio_rel_tag`
--
ALTER TABLE `portfolio_rel_tag`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `promotion`
--
ALTER TABLE `promotion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `push_subscription`
--
ALTER TABLE `push_subscription`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `reset_password_request`
--
ALTER TABLE `reset_password_request`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `resource_comment`
--
ALTER TABLE `resource_comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `resource_file`
--
ALTER TABLE `resource_file`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT für Tabelle `resource_format`
--
ALTER TABLE `resource_format`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT für Tabelle `resource_link`
--
ALTER TABLE `resource_link`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT für Tabelle `resource_node`
--
ALTER TABLE `resource_node`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;

--
-- AUTO_INCREMENT für Tabelle `resource_right`
--
ALTER TABLE `resource_right`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT für Tabelle `resource_tag`
--
ALTER TABLE `resource_tag`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `resource_type`
--
ALTER TABLE `resource_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT für Tabelle `resource_user_tag`
--
ALTER TABLE `resource_user_tag`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `role`
--
ALTER TABLE `role`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT für Tabelle `room`
--
ALTER TABLE `room`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `scheduled_announcements`
--
ALTER TABLE `scheduled_announcements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `search_engine_ref`
--
ALTER TABLE `search_engine_ref`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `sequence`
--
ALTER TABLE `sequence`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `sequence_condition`
--
ALTER TABLE `sequence_condition`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT für Tabelle `sequence_formula`
--
ALTER TABLE `sequence_formula`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT für Tabelle `sequence_method`
--
ALTER TABLE `sequence_method`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT für Tabelle `sequence_resource`
--
ALTER TABLE `sequence_resource`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `sequence_row_entity`
--
ALTER TABLE `sequence_row_entity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `sequence_rule`
--
ALTER TABLE `sequence_rule`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `sequence_rule_condition`
--
ALTER TABLE `sequence_rule_condition`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT für Tabelle `sequence_rule_method`
--
ALTER TABLE `sequence_rule_method`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT für Tabelle `sequence_type_entity`
--
ALTER TABLE `sequence_type_entity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT für Tabelle `sequence_valid`
--
ALTER TABLE `sequence_valid`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT für Tabelle `sequence_value`
--
ALTER TABLE `sequence_value`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `sequence_variable`
--
ALTER TABLE `sequence_variable`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT für Tabelle `session`
--
ALTER TABLE `session`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `session_category`
--
ALTER TABLE `session_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `session_rel_course`
--
ALTER TABLE `session_rel_course`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `session_rel_course_rel_user`
--
ALTER TABLE `session_rel_course_rel_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `session_rel_user`
--
ALTER TABLE `session_rel_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=698;

--
-- AUTO_INCREMENT für Tabelle `settings_options`
--
ALTER TABLE `settings_options`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `settings_value_template`
--
ALTER TABLE `settings_value_template`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT für Tabelle `skill`
--
ALTER TABLE `skill`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `skill_level`
--
ALTER TABLE `skill_level`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `skill_level_profile`
--
ALTER TABLE `skill_level_profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `skill_profile`
--
ALTER TABLE `skill_profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `skill_rel_course`
--
ALTER TABLE `skill_rel_course`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `skill_rel_gradebook`
--
ALTER TABLE `skill_rel_gradebook`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `skill_rel_item`
--
ALTER TABLE `skill_rel_item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `skill_rel_item_rel_user`
--
ALTER TABLE `skill_rel_item_rel_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `skill_rel_profile`
--
ALTER TABLE `skill_rel_profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `skill_rel_skill`
--
ALTER TABLE `skill_rel_skill`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `skill_rel_user`
--
ALTER TABLE `skill_rel_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `skill_rel_user_comment`
--
ALTER TABLE `skill_rel_user_comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `social_post`
--
ALTER TABLE `social_post`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT für Tabelle `social_post_attachments`
--
ALTER TABLE `social_post_attachments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `social_post_feedback`
--
ALTER TABLE `social_post_feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `specific_field`
--
ALTER TABLE `specific_field`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `specific_field_values`
--
ALTER TABLE `specific_field_values`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `system_template`
--
ALTER TABLE `system_template`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `sys_announcement`
--
ALTER TABLE `sys_announcement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `tag`
--
ALTER TABLE `tag`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `templates`
--
ALTER TABLE `templates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `third_party`
--
ALTER TABLE `third_party`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `third_party_data_exchange`
--
ALTER TABLE `third_party_data_exchange`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `third_party_data_exchange_user`
--
ALTER TABLE `third_party_data_exchange_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `ticket_assigned_log`
--
ALTER TABLE `ticket_assigned_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `ticket_category`
--
ALTER TABLE `ticket_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT für Tabelle `ticket_category_rel_user`
--
ALTER TABLE `ticket_category_rel_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `ticket_message`
--
ALTER TABLE `ticket_message`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `ticket_message_attachments`
--
ALTER TABLE `ticket_message_attachments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `ticket_priority`
--
ALTER TABLE `ticket_priority`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT für Tabelle `ticket_project`
--
ALTER TABLE `ticket_project`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `ticket_status`
--
ALTER TABLE `ticket_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT für Tabelle `ticket_ticket`
--
ALTER TABLE `ticket_ticket`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `tool`
--
ALTER TABLE `tool`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT für Tabelle `tool_resource_right`
--
ALTER TABLE `tool_resource_right`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `track_e_access`
--
ALTER TABLE `track_e_access`
  MODIFY `access_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT für Tabelle `track_e_access_complete`
--
ALTER TABLE `track_e_access_complete`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `track_e_attempt`
--
ALTER TABLE `track_e_attempt`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `track_e_attempt_coeff`
--
ALTER TABLE `track_e_attempt_coeff`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `track_e_attempt_qualify`
--
ALTER TABLE `track_e_attempt_qualify`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `track_e_course_access`
--
ALTER TABLE `track_e_course_access`
  MODIFY `course_access_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT für Tabelle `track_e_default`
--
ALTER TABLE `track_e_default`
  MODIFY `default_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT für Tabelle `track_e_downloads`
--
ALTER TABLE `track_e_downloads`
  MODIFY `down_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `track_e_exercises`
--
ALTER TABLE `track_e_exercises`
  MODIFY `exe_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `track_e_exercise_confirmation`
--
ALTER TABLE `track_e_exercise_confirmation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `track_e_hotpotatoes`
--
ALTER TABLE `track_e_hotpotatoes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `track_e_hotspot`
--
ALTER TABLE `track_e_hotspot`
  MODIFY `hotspot_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `track_e_lastaccess`
--
ALTER TABLE `track_e_lastaccess`
  MODIFY `access_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT für Tabelle `track_e_links`
--
ALTER TABLE `track_e_links`
  MODIFY `links_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `track_e_login`
--
ALTER TABLE `track_e_login`
  MODIFY `login_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT für Tabelle `track_e_login_record`
--
ALTER TABLE `track_e_login_record`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT für Tabelle `track_e_online`
--
ALTER TABLE `track_e_online`
  MODIFY `login_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT für Tabelle `track_e_uploads`
--
ALTER TABLE `track_e_uploads`
  MODIFY `upload_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT für Tabelle `usergroup`
--
ALTER TABLE `usergroup`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `usergroup_rel_course`
--
ALTER TABLE `usergroup_rel_course`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `usergroup_rel_question`
--
ALTER TABLE `usergroup_rel_question`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `usergroup_rel_session`
--
ALTER TABLE `usergroup_rel_session`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `usergroup_rel_user`
--
ALTER TABLE `usergroup_rel_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `usergroup_rel_usergroup`
--
ALTER TABLE `usergroup_rel_usergroup`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `user_api_key`
--
ALTER TABLE `user_api_key`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `user_auth_source`
--
ALTER TABLE `user_auth_source`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT für Tabelle `user_career`
--
ALTER TABLE `user_career`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `user_course_category`
--
ALTER TABLE `user_course_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `user_friend_relation_type`
--
ALTER TABLE `user_friend_relation_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT für Tabelle `user_rel_course_vote`
--
ALTER TABLE `user_rel_course_vote`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `user_rel_tag`
--
ALTER TABLE `user_rel_tag`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `user_rel_user`
--
ALTER TABLE `user_rel_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT für Tabelle `validation_token`
--
ALTER TABLE `validation_token`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `xapi_activity_profile`
--
ALTER TABLE `xapi_activity_profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `xapi_activity_state`
--
ALTER TABLE `xapi_activity_state`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `xapi_actor`
--
ALTER TABLE `xapi_actor`
  MODIFY `identifier` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `xapi_attachment`
--
ALTER TABLE `xapi_attachment`
  MODIFY `identifier` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `xapi_cmi5_item`
--
ALTER TABLE `xapi_cmi5_item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `xapi_context`
--
ALTER TABLE `xapi_context`
  MODIFY `identifier` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `xapi_extensions`
--
ALTER TABLE `xapi_extensions`
  MODIFY `identifier` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `xapi_internal_log`
--
ALTER TABLE `xapi_internal_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `xapi_lrs_auth`
--
ALTER TABLE `xapi_lrs_auth`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `xapi_object`
--
ALTER TABLE `xapi_object`
  MODIFY `identifier` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `xapi_result`
--
ALTER TABLE `xapi_result`
  MODIFY `identifier` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `xapi_shared_statement`
--
ALTER TABLE `xapi_shared_statement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `xapi_tool_launch`
--
ALTER TABLE `xapi_tool_launch`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `xapi_verb`
--
ALTER TABLE `xapi_verb`
  MODIFY `identifier` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `access_url`
--
ALTER TABLE `access_url`
  ADD CONSTRAINT `FK_9436187B1BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_9436187B727ACA70` FOREIGN KEY (`parent_id`) REFERENCES `access_url` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_9436187BA977936C` FOREIGN KEY (`tree_root`) REFERENCES `access_url` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `access_url_rel_color_theme`
--
ALTER TABLE `access_url_rel_color_theme`
  ADD CONSTRAINT `FK_D2A2E1C981CFDAE7` FOREIGN KEY (`url_id`) REFERENCES `access_url` (`id`),
  ADD CONSTRAINT `FK_D2A2E1C98587EFC5` FOREIGN KEY (`color_theme_id`) REFERENCES `color_theme` (`id`);

--
-- Constraints der Tabelle `access_url_rel_course`
--
ALTER TABLE `access_url_rel_course`
  ADD CONSTRAINT `FK_8E97FC0873444FD5` FOREIGN KEY (`access_url_id`) REFERENCES `access_url` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_8E97FC0891D79BD3` FOREIGN KEY (`c_id`) REFERENCES `course` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `access_url_rel_course_category`
--
ALTER TABLE `access_url_rel_course_category`
  ADD CONSTRAINT `FK_3545C2A66628AD36` FOREIGN KEY (`course_category_id`) REFERENCES `course_category` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_3545C2A673444FD5` FOREIGN KEY (`access_url_id`) REFERENCES `access_url` (`id`);

--
-- Constraints der Tabelle `access_url_rel_plugin`
--
ALTER TABLE `access_url_rel_plugin`
  ADD CONSTRAINT `FK_7167B42581CFDAE7` FOREIGN KEY (`url_id`) REFERENCES `access_url` (`id`),
  ADD CONSTRAINT `FK_7167B425EC942BCF` FOREIGN KEY (`plugin_id`) REFERENCES `plugin` (`id`);

--
-- Constraints der Tabelle `access_url_rel_session`
--
ALTER TABLE `access_url_rel_session`
  ADD CONSTRAINT `FK_6CBA5F5D613FECDF` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`),
  ADD CONSTRAINT `FK_6CBA5F5D73444FD5` FOREIGN KEY (`access_url_id`) REFERENCES `access_url` (`id`);

--
-- Constraints der Tabelle `access_url_rel_user`
--
ALTER TABLE `access_url_rel_user`
  ADD CONSTRAINT `FK_8557426373444FD5` FOREIGN KEY (`access_url_id`) REFERENCES `access_url` (`id`),
  ADD CONSTRAINT `FK_85574263A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `access_url_rel_usergroup`
--
ALTER TABLE `access_url_rel_usergroup`
  ADD CONSTRAINT `FK_AD488DD573444FD5` FOREIGN KEY (`access_url_id`) REFERENCES `access_url` (`id`),
  ADD CONSTRAINT `FK_AD488DD5D2112630` FOREIGN KEY (`usergroup_id`) REFERENCES `usergroup` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `FK_880E0D76A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `agenda_reminder`
--
ALTER TABLE `agenda_reminder`
  ADD CONSTRAINT `FK_416FFA2471F7E88B` FOREIGN KEY (`event_id`) REFERENCES `c_calendar_event` (`iid`);

--
-- Constraints der Tabelle `attempt_feedback`
--
ALTER TABLE `attempt_feedback`
  ADD CONSTRAINT `FK_BA30B2FE5DA1941` FOREIGN KEY (`asset_id`) REFERENCES `asset` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_BA30B2FEA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_BA30B2FEB191BE6B` FOREIGN KEY (`attempt_id`) REFERENCES `track_e_attempt` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `attempt_file`
--
ALTER TABLE `attempt_file`
  ADD CONSTRAINT `FK_4F22BDF05DA1941` FOREIGN KEY (`asset_id`) REFERENCES `asset` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_4F22BDF0B191BE6B` FOREIGN KEY (`attempt_id`) REFERENCES `track_e_attempt` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `block`
--
ALTER TABLE `block`
  ADD CONSTRAINT `FK_831B9722A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `branch_sync`
--
ALTER TABLE `branch_sync`
  ADD CONSTRAINT `FK_F62F45ED727ACA70` FOREIGN KEY (`parent_id`) REFERENCES `branch_sync` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_F62F45ED73444FD5` FOREIGN KEY (`access_url_id`) REFERENCES `access_url` (`id`);

--
-- Constraints der Tabelle `branch_transaction`
--
ALTER TABLE `branch_transaction`
  ADD CONSTRAINT `FK_FEFBA12B6BF700BD` FOREIGN KEY (`status_id`) REFERENCES `branch_transaction_status` (`id`),
  ADD CONSTRAINT `FK_FEFBA12BDCD6CC49` FOREIGN KEY (`branch_id`) REFERENCES `branch_sync` (`id`);

--
-- Constraints der Tabelle `catalogue_course_rel_access_url_rel_usergroup`
--
ALTER TABLE `catalogue_course_rel_access_url_rel_usergroup`
  ADD CONSTRAINT `FK_37CC1F8E591CC992` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_37CC1F8E73444FD5` FOREIGN KEY (`access_url_id`) REFERENCES `access_url` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_37CC1F8ED2112630` FOREIGN KEY (`usergroup_id`) REFERENCES `usergroup` (`id`) ON DELETE SET NULL;

--
-- Constraints der Tabelle `catalogue_session_rel_access_url_rel_usergroup`
--
ALTER TABLE `catalogue_session_rel_access_url_rel_usergroup`
  ADD CONSTRAINT `FK_B143E63A613FECDF` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_B143E63A73444FD5` FOREIGN KEY (`access_url_id`) REFERENCES `access_url` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_B143E63AD2112630` FOREIGN KEY (`usergroup_id`) REFERENCES `usergroup` (`id`) ON DELETE SET NULL;

--
-- Constraints der Tabelle `conference_activity`
--
ALTER TABLE `conference_activity`
  ADD CONSTRAINT `FK_6935CF7B67433D9C` FOREIGN KEY (`meeting_id`) REFERENCES `conference_meeting` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_6935CF7B9D1C3019` FOREIGN KEY (`participant_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `conference_meeting`
--
ALTER TABLE `conference_meeting`
  ADD CONSTRAINT `FK_EE87E81613FECDF` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_EE87E8173444FD5` FOREIGN KEY (`access_url_id`) REFERENCES `access_url` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_EE87E8191D79BD3` FOREIGN KEY (`c_id`) REFERENCES `course` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_EE87E81A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_EE87E81FE54D947` FOREIGN KEY (`group_id`) REFERENCES `c_group_info` (`iid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `conference_recording`
--
ALTER TABLE `conference_recording`
  ADD CONSTRAINT `FK_F7FF7ACB67433D9C` FOREIGN KEY (`meeting_id`) REFERENCES `conference_meeting` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `course`
--
ALTER TABLE `course`
  ADD CONSTRAINT `FK_169E6FB91BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_169E6FB954177093` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`);

--
-- Constraints der Tabelle `course_category`
--
ALTER TABLE `course_category`
  ADD CONSTRAINT `FK_AFF874975DA1941` FOREIGN KEY (`asset_id`) REFERENCES `asset` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_AFF87497727ACA70` FOREIGN KEY (`parent_id`) REFERENCES `course_category` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `course_rel_category`
--
ALTER TABLE `course_rel_category`
  ADD CONSTRAINT `FK_16B33772591CC992` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`),
  ADD CONSTRAINT `FK_16B337726628AD36` FOREIGN KEY (`course_category_id`) REFERENCES `course_category` (`id`);

--
-- Constraints der Tabelle `course_rel_user`
--
ALTER TABLE `course_rel_user`
  ADD CONSTRAINT `FK_92CFD9FE91D79BD3` FOREIGN KEY (`c_id`) REFERENCES `course` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_92CFD9FEA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `course_rel_user_catalogue`
--
ALTER TABLE `course_rel_user_catalogue`
  ADD CONSTRAINT `FK_79CA412E91D79BD3` FOREIGN KEY (`c_id`) REFERENCES `course` (`id`),
  ADD CONSTRAINT `FK_79CA412EA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `course_request`
--
ALTER TABLE `course_request`
  ADD CONSTRAINT `FK_33548A73A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_announcement`
--
ALTER TABLE `c_announcement`
  ADD CONSTRAINT `FK_39912E021BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_announcement_attachment`
--
ALTER TABLE `c_announcement_attachment`
  ADD CONSTRAINT `FK_5480BD4A1BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_5480BD4A913AEA17` FOREIGN KEY (`announcement_id`) REFERENCES `c_announcement` (`iid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_attendance`
--
ALTER TABLE `c_attendance`
  ADD CONSTRAINT `FK_413634921BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_attendance_calendar`
--
ALTER TABLE `c_attendance_calendar`
  ADD CONSTRAINT `FK_AA3A9AB8163DDA15` FOREIGN KEY (`attendance_id`) REFERENCES `c_attendance` (`iid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_attendance_calendar_rel_group`
--
ALTER TABLE `c_attendance_calendar_rel_group`
  ADD CONSTRAINT `FK_C2AB1FACA40A2C8` FOREIGN KEY (`calendar_id`) REFERENCES `c_attendance_calendar` (`iid`),
  ADD CONSTRAINT `FK_C2AB1FACFE54D947` FOREIGN KEY (`group_id`) REFERENCES `c_group_info` (`iid`);

--
-- Constraints der Tabelle `c_attendance_result`
--
ALTER TABLE `c_attendance_result`
  ADD CONSTRAINT `FK_2C7640163DDA15` FOREIGN KEY (`attendance_id`) REFERENCES `c_attendance` (`iid`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_2C7640A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_attendance_sheet`
--
ALTER TABLE `c_attendance_sheet`
  ADD CONSTRAINT `FK_AD1394FA19EA43C3` FOREIGN KEY (`attendance_calendar_id`) REFERENCES `c_attendance_calendar` (`iid`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_AD1394FAA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_attendance_sheet_log`
--
ALTER TABLE `c_attendance_sheet_log`
  ADD CONSTRAINT `FK_181D0917163DDA15` FOREIGN KEY (`attendance_id`) REFERENCES `c_attendance` (`iid`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_181D091731BA5DD` FOREIGN KEY (`lastedit_user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_autogroup_user_invitation`
--
ALTER TABLE `c_autogroup_user_invitation`
  ADD CONSTRAINT `FK_84AB498037FE8223` FOREIGN KEY (`group_category_id`) REFERENCES `c_group_category` (`iid`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_84AB4980A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_84AB4980FE54D947` FOREIGN KEY (`group_id`) REFERENCES `c_group_info` (`iid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_blog`
--
ALTER TABLE `c_blog`
  ADD CONSTRAINT `FK_64B00A121BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_blog_attachment`
--
ALTER TABLE `c_blog_attachment`
  ADD CONSTRAINT `FK_E769AADC4B89032C` FOREIGN KEY (`post_id`) REFERENCES `c_blog_post` (`iid`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_E769AADCDAE07E97` FOREIGN KEY (`blog_id`) REFERENCES `c_blog` (`iid`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_E769AADCF8697D13` FOREIGN KEY (`comment_id`) REFERENCES `c_blog_comment` (`iid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_blog_comment`
--
ALTER TABLE `c_blog_comment`
  ADD CONSTRAINT `FK_CAA18F14B89032C` FOREIGN KEY (`post_id`) REFERENCES `c_blog_post` (`iid`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_CAA18F1BF2AF943` FOREIGN KEY (`parent_comment_id`) REFERENCES `c_blog_comment` (`iid`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_CAA18F1DAE07E97` FOREIGN KEY (`blog_id`) REFERENCES `c_blog` (`iid`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_CAA18F1F675F31B` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_blog_post`
--
ALTER TABLE `c_blog_post`
  ADD CONSTRAINT `FK_B6FD68A3DAE07E97` FOREIGN KEY (`blog_id`) REFERENCES `c_blog` (`iid`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_B6FD68A3F675F31B` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_blog_rating`
--
ALTER TABLE `c_blog_rating`
  ADD CONSTRAINT `FK_D4E307604B89032C` FOREIGN KEY (`post_id`) REFERENCES `c_blog_post` (`iid`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_D4E30760A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_D4E30760DAE07E97` FOREIGN KEY (`blog_id`) REFERENCES `c_blog` (`iid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_blog_rel_user`
--
ALTER TABLE `c_blog_rel_user`
  ADD CONSTRAINT `FK_B55D851BA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_B55D851BDAE07E97` FOREIGN KEY (`blog_id`) REFERENCES `c_blog` (`iid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_blog_task`
--
ALTER TABLE `c_blog_task`
  ADD CONSTRAINT `FK_BE09DF0BDAE07E97` FOREIGN KEY (`blog_id`) REFERENCES `c_blog` (`iid`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_BE09DF0BF675F31B` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`) ON DELETE SET NULL;

--
-- Constraints der Tabelle `c_blog_task_rel_user`
--
ALTER TABLE `c_blog_task_rel_user`
  ADD CONSTRAINT `FK_FD8B3C738DB60186` FOREIGN KEY (`task_id`) REFERENCES `c_blog_task` (`iid`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_FD8B3C73A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_FD8B3C73DAE07E97` FOREIGN KEY (`blog_id`) REFERENCES `c_blog` (`iid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_calendar_event`
--
ALTER TABLE `c_calendar_event`
  ADD CONSTRAINT `FK_A0622581139DF194` FOREIGN KEY (`promotion_id`) REFERENCES `promotion` (`id`),
  ADD CONSTRAINT `FK_A06225811BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_A062258154177093` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`),
  ADD CONSTRAINT `FK_A0622581B58CDA09` FOREIGN KEY (`career_id`) REFERENCES `career` (`id`),
  ADD CONSTRAINT `FK_A0622581EE3A445A` FOREIGN KEY (`parent_event_id`) REFERENCES `c_calendar_event` (`iid`);

--
-- Constraints der Tabelle `c_calendar_event_attachment`
--
ALTER TABLE `c_calendar_event_attachment`
  ADD CONSTRAINT `FK_DDD745A61BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_DDD745A6EA67784A` FOREIGN KEY (`agenda_id`) REFERENCES `c_calendar_event` (`iid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_calendar_event_repeat`
--
ALTER TABLE `c_calendar_event_repeat`
  ADD CONSTRAINT `FK_86FD1CA87300D633` FOREIGN KEY (`cal_id`) REFERENCES `c_calendar_event` (`iid`);

--
-- Constraints der Tabelle `c_calendar_event_repeat_not`
--
ALTER TABLE `c_calendar_event_repeat_not`
  ADD CONSTRAINT `FK_7D4436947300D633` FOREIGN KEY (`cal_id`) REFERENCES `c_calendar_event` (`iid`);

--
-- Constraints der Tabelle `c_chat_conversation`
--
ALTER TABLE `c_chat_conversation`
  ADD CONSTRAINT `FK_CD09E33F1BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_course_description`
--
ALTER TABLE `c_course_description`
  ADD CONSTRAINT `FK_EC3CD8091BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_document`
--
ALTER TABLE `c_document`
  ADD CONSTRAINT `FK_C9FA0CBD1BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_dropbox_file`
--
ALTER TABLE `c_dropbox_file`
  ADD CONSTRAINT `FK_4D71B46C1BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_forum_attachment`
--
ALTER TABLE `c_forum_attachment`
  ADD CONSTRAINT `FK_F1113A881BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_F1113A884B89032C` FOREIGN KEY (`post_id`) REFERENCES `c_forum_post` (`iid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_forum_category`
--
ALTER TABLE `c_forum_category`
  ADD CONSTRAINT `FK_D627B86E1BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_forum_forum`
--
ALTER TABLE `c_forum_forum`
  ADD CONSTRAINT `FK_47A9C991BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_47A9C9921BF9426` FOREIGN KEY (`forum_category`) REFERENCES `c_forum_category` (`iid`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_47A9C9968DFD1EF` FOREIGN KEY (`lp_id`) REFERENCES `c_lp` (`iid`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_47A9C99F2E82C87` FOREIGN KEY (`forum_last_post`) REFERENCES `c_forum_post` (`iid`);

--
-- Constraints der Tabelle `c_forum_post`
--
ALTER TABLE `c_forum_post`
  ADD CONSTRAINT `FK_B5BEF5591BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_B5BEF55929CCBAD0` FOREIGN KEY (`forum_id`) REFERENCES `c_forum_forum` (`iid`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_B5BEF5595BB66C05` FOREIGN KEY (`poster_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_B5BEF559D314B487` FOREIGN KEY (`post_parent_id`) REFERENCES `c_forum_post` (`iid`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_B5BEF559E2904019` FOREIGN KEY (`thread_id`) REFERENCES `c_forum_thread` (`iid`) ON DELETE SET NULL;

--
-- Constraints der Tabelle `c_forum_thread`
--
ALTER TABLE `c_forum_thread`
  ADD CONSTRAINT `FK_5DA7884C1BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_5DA7884C29CCBAD0` FOREIGN KEY (`forum_id`) REFERENCES `c_forum_forum` (`iid`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_5DA7884C43CB876D` FOREIGN KEY (`thread_last_post`) REFERENCES `c_forum_post` (`iid`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_5DA7884CD4DC43B9` FOREIGN KEY (`thread_poster_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_5DA7884CDBF72317` FOREIGN KEY (`lp_item_id`) REFERENCES `c_lp_item` (`iid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_forum_thread_qualify`
--
ALTER TABLE `c_forum_thread_qualify`
  ADD CONSTRAINT `FK_715FC3A5A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_715FC3A5E2904019` FOREIGN KEY (`thread_id`) REFERENCES `c_forum_thread` (`iid`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_715FC3A5E5E1B95C` FOREIGN KEY (`qualify_user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_glossary`
--
ALTER TABLE `c_glossary`
  ADD CONSTRAINT `FK_A1168D881BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_group_category`
--
ALTER TABLE `c_group_category`
  ADD CONSTRAINT `FK_F8E479F61BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_F8E479F6FDC232CD` FOREIGN KEY (`peer_assessment`) REFERENCES `c_peer_assessment` (`id`);

--
-- Constraints der Tabelle `c_group_category_rel_user`
--
ALTER TABLE `c_group_category_rel_user`
  ADD CONSTRAINT `FK_4D66D81337FE8223` FOREIGN KEY (`group_category_id`) REFERENCES `c_group_category` (`iid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_group_info`
--
ALTER TABLE `c_group_info`
  ADD CONSTRAINT `FK_CE06532412469DE2` FOREIGN KEY (`category_id`) REFERENCES `c_group_category` (`iid`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_CE0653241BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_group_rel_tutor`
--
ALTER TABLE `c_group_rel_tutor`
  ADD CONSTRAINT `FK_F6FF71ABA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_F6FF71ABFE54D947` FOREIGN KEY (`group_id`) REFERENCES `c_group_info` (`iid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_group_rel_user`
--
ALTER TABLE `c_group_rel_user`
  ADD CONSTRAINT `FK_C5D3D49FA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_C5D3D49FFE54D947` FOREIGN KEY (`group_id`) REFERENCES `c_group_info` (`iid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_group_rel_usergroup`
--
ALTER TABLE `c_group_rel_usergroup`
  ADD CONSTRAINT `FK_AEE272A8613FECDF` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_AEE272A891D79BD3` FOREIGN KEY (`c_id`) REFERENCES `course` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_AEE272A8D2112630` FOREIGN KEY (`usergroup_id`) REFERENCES `usergroup` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_AEE272A8FE54D947` FOREIGN KEY (`group_id`) REFERENCES `c_group_info` (`iid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_link`
--
ALTER TABLE `c_link`
  ADD CONSTRAINT `FK_9209C2A012469DE2` FOREIGN KEY (`category_id`) REFERENCES `c_link_category` (`iid`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_9209C2A01BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_9209C2A0D877C209` FOREIGN KEY (`custom_image_id`) REFERENCES `asset` (`id`) ON DELETE SET NULL;

--
-- Constraints der Tabelle `c_link_category`
--
ALTER TABLE `c_link_category`
  ADD CONSTRAINT `FK_319D6C9C1BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_lp`
--
ALTER TABLE `c_lp`
  ADD CONSTRAINT `FK_F67ABBEB12469DE2` FOREIGN KEY (`category_id`) REFERENCES `c_lp_category` (`iid`),
  ADD CONSTRAINT `FK_F67ABBEB1BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_F67ABBEB5DA1941` FOREIGN KEY (`asset_id`) REFERENCES `asset` (`id`);

--
-- Constraints der Tabelle `c_lp_category`
--
ALTER TABLE `c_lp_category`
  ADD CONSTRAINT `FK_90A0FC071BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_lp_category_rel_user`
--
ALTER TABLE `c_lp_category_rel_user`
  ADD CONSTRAINT `FK_83D3582912469DE2` FOREIGN KEY (`category_id`) REFERENCES `c_lp_category` (`iid`),
  ADD CONSTRAINT `FK_83D35829A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL;

--
-- Constraints der Tabelle `c_lp_item`
--
ALTER TABLE `c_lp_item`
  ADD CONSTRAINT `FK_CCC9C1ED60272618` FOREIGN KEY (`parent_item_id`) REFERENCES `c_lp_item` (`iid`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_CCC9C1ED68DFD1EF` FOREIGN KEY (`lp_id`) REFERENCES `c_lp` (`iid`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_CCC9C1EDDEC4BDA0` FOREIGN KEY (`item_root`) REFERENCES `c_lp_item` (`iid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_lp_item_view`
--
ALTER TABLE `c_lp_item_view`
  ADD CONSTRAINT `FK_445C6415CA8D698E` FOREIGN KEY (`lp_view_id`) REFERENCES `c_lp_view` (`iid`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_445C6415DBF72317` FOREIGN KEY (`lp_item_id`) REFERENCES `c_lp_item` (`iid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_lp_rel_user`
--
ALTER TABLE `c_lp_rel_user`
  ADD CONSTRAINT `FK_AD97516E61220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_AD97516E613FECDF` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`),
  ADD CONSTRAINT `FK_AD97516E68DFD1EF` FOREIGN KEY (`lp_id`) REFERENCES `c_lp` (`iid`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_AD97516E91D79BD3` FOREIGN KEY (`c_id`) REFERENCES `course` (`id`),
  ADD CONSTRAINT `FK_AD97516EA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_AD97516EFE54D947` FOREIGN KEY (`group_id`) REFERENCES `c_group_info` (`iid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_lp_rel_usergroup`
--
ALTER TABLE `c_lp_rel_usergroup`
  ADD CONSTRAINT `FK_DB8689FF613FECDF` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`),
  ADD CONSTRAINT `FK_DB8689FF68DFD1EF` FOREIGN KEY (`lp_id`) REFERENCES `c_lp` (`iid`),
  ADD CONSTRAINT `FK_DB8689FF91D79BD3` FOREIGN KEY (`c_id`) REFERENCES `course` (`id`),
  ADD CONSTRAINT `FK_DB8689FFD2112630` FOREIGN KEY (`usergroup_id`) REFERENCES `usergroup` (`id`);

--
-- Constraints der Tabelle `c_lp_user_access`
--
ALTER TABLE `c_lp_user_access`
  ADD CONSTRAINT `FK_7CAC73F768DFD1EF` FOREIGN KEY (`lp_id`) REFERENCES `c_lp` (`iid`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_7CAC73F7A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL;

--
-- Constraints der Tabelle `c_lp_view`
--
ALTER TABLE `c_lp_view`
  ADD CONSTRAINT `FK_2D2F4F7D613FECDF` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_2D2F4F7D68DFD1EF` FOREIGN KEY (`lp_id`) REFERENCES `c_lp` (`iid`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_2D2F4F7D91D79BD3` FOREIGN KEY (`c_id`) REFERENCES `course` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_2D2F4F7DA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_notebook`
--
ALTER TABLE `c_notebook`
  ADD CONSTRAINT `FK_E7EE1CE01BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_E7EE1CE0A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_peer_assessment`
--
ALTER TABLE `c_peer_assessment`
  ADD CONSTRAINT `FK_8532634337FE8223` FOREIGN KEY (`group_category_id`) REFERENCES `c_group_category` (`iid`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_8532634391D79BD3` FOREIGN KEY (`c_id`) REFERENCES `course` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_peer_assessment_correction`
--
ALTER TABLE `c_peer_assessment_correction`
  ADD CONSTRAINT `FK_AFB0F2B74DDF95DC` FOREIGN KEY (`student_group_id`) REFERENCES `usergroup` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_AFB0F2B7672C3733` FOREIGN KEY (`peer_assessment_id`) REFERENCES `c_peer_assessment` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_peer_assessment_correction_criteria`
--
ALTER TABLE `c_peer_assessment_correction_criteria`
  ADD CONSTRAINT `FK_C1AB8C1962488999` FOREIGN KEY (`peer_assessment_criteria_id`) REFERENCES `c_peer_assessment_criteria` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_C1AB8C19D723148D` FOREIGN KEY (`peer_assessment_correction_id`) REFERENCES `c_peer_assessment_correction` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_peer_assessment_criteria`
--
ALTER TABLE `c_peer_assessment_criteria`
  ADD CONSTRAINT `FK_5025776B672C3733` FOREIGN KEY (`peer_assessment_id`) REFERENCES `c_peer_assessment` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_peer_assessment_log`
--
ALTER TABLE `c_peer_assessment_log`
  ADD CONSTRAINT `FK_71C6D04B672C3733` FOREIGN KEY (`peer_assessment_id`) REFERENCES `c_peer_assessment` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_71C6D04BA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL;

--
-- Constraints der Tabelle `c_peer_assessment_rel_student_publication`
--
ALTER TABLE `c_peer_assessment_rel_student_publication`
  ADD CONSTRAINT `FK_1B078BC72F50351C` FOREIGN KEY (`student_publication_id`) REFERENCES `c_student_publication` (`iid`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_1B078BC7672C3733` FOREIGN KEY (`peer_assessment_id`) REFERENCES `c_peer_assessment` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_1B078BC7FE54D947` FOREIGN KEY (`group_id`) REFERENCES `c_group_info` (`iid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_peer_autogroup_rel_student_publication`
--
ALTER TABLE `c_peer_autogroup_rel_student_publication`
  ADD CONSTRAINT `FK_52659CE42F50351C` FOREIGN KEY (`student_publication_id`) REFERENCES `c_student_publication` (`iid`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_52659CE4A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_52659CE4FE54D947` FOREIGN KEY (`group_id`) REFERENCES `c_group_info` (`iid`) ON DELETE SET NULL;

--
-- Constraints der Tabelle `c_quiz`
--
ALTER TABLE `c_quiz`
  ADD CONSTRAINT `FK_B7A1C31BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_B7A1C33D608E42` FOREIGN KEY (`quiz_category_id`) REFERENCES `c_quiz_category` (`id`) ON DELETE SET NULL;

--
-- Constraints der Tabelle `c_quiz_answer`
--
ALTER TABLE `c_quiz_answer`
  ADD CONSTRAINT `FK_AEBC3EFF1E27F6BF` FOREIGN KEY (`question_id`) REFERENCES `c_quiz_question` (`iid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_quiz_category`
--
ALTER TABLE `c_quiz_category`
  ADD CONSTRAINT `FK_2AF3F5101BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_2AF3F51091D79BD3` FOREIGN KEY (`c_id`) REFERENCES `course` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_quiz_question`
--
ALTER TABLE `c_quiz_question`
  ADD CONSTRAINT `FK_9A48A59F1BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_quiz_question_category`
--
ALTER TABLE `c_quiz_question_category`
  ADD CONSTRAINT `FK_1414369D1BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_quiz_question_option`
--
ALTER TABLE `c_quiz_question_option`
  ADD CONSTRAINT `FK_499A73F31E27F6BF` FOREIGN KEY (`question_id`) REFERENCES `c_quiz_question` (`iid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_quiz_question_rel_category`
--
ALTER TABLE `c_quiz_question_rel_category`
  ADD CONSTRAINT `FK_A468585C12469DE2` FOREIGN KEY (`category_id`) REFERENCES `c_quiz_question_category` (`iid`),
  ADD CONSTRAINT `FK_A468585C1E27F6BF` FOREIGN KEY (`question_id`) REFERENCES `c_quiz_question` (`iid`);

--
-- Constraints der Tabelle `c_quiz_rel_category`
--
ALTER TABLE `c_quiz_rel_category`
  ADD CONSTRAINT `FK_F8EC662312469DE2` FOREIGN KEY (`category_id`) REFERENCES `c_quiz_question_category` (`iid`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_F8EC6623E934951A` FOREIGN KEY (`exercise_id`) REFERENCES `c_quiz` (`iid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_quiz_rel_question`
--
ALTER TABLE `c_quiz_rel_question`
  ADD CONSTRAINT `FK_485736AC1E27F6BF` FOREIGN KEY (`question_id`) REFERENCES `c_quiz_question` (`iid`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_485736AC853CD175` FOREIGN KEY (`quiz_id`) REFERENCES `c_quiz` (`iid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_shortcut`
--
ALTER TABLE `c_shortcut`
  ADD CONSTRAINT `FK_3F6BB9571BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_3F6BB957937100BE` FOREIGN KEY (`shortcut_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_student_publication`
--
ALTER TABLE `c_student_publication`
  ADD CONSTRAINT `FK_5246F7461BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_5246F74637FE8223` FOREIGN KEY (`group_category_id`) REFERENCES `c_group_category` (`iid`),
  ADD CONSTRAINT `FK_5246F746727ACA70` FOREIGN KEY (`parent_id`) REFERENCES `c_student_publication` (`iid`),
  ADD CONSTRAINT `FK_5246F746A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_student_publication_assignment`
--
ALTER TABLE `c_student_publication_assignment`
  ADD CONSTRAINT `FK_25687EB838B217A7` FOREIGN KEY (`publication_id`) REFERENCES `c_student_publication` (`iid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_student_publication_comment`
--
ALTER TABLE `c_student_publication_comment`
  ADD CONSTRAINT `FK_35C509F61BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_35C509F6A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_35C509F6BB3453DB` FOREIGN KEY (`work_id`) REFERENCES `c_student_publication` (`iid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_student_publication_correction`
--
ALTER TABLE `c_student_publication_correction`
  ADD CONSTRAINT `FK_B7309BBA1BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_student_publication_rel_document`
--
ALTER TABLE `c_student_publication_rel_document`
  ADD CONSTRAINT `FK_BD6672A5BB3453DB` FOREIGN KEY (`work_id`) REFERENCES `c_student_publication` (`iid`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_BD6672A5C33F7837` FOREIGN KEY (`document_id`) REFERENCES `c_document` (`iid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_student_publication_rel_user`
--
ALTER TABLE `c_student_publication_rel_user`
  ADD CONSTRAINT `FK_2B007FA9A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_2B007FA9BB3453DB` FOREIGN KEY (`work_id`) REFERENCES `c_student_publication` (`iid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_survey`
--
ALTER TABLE `c_survey`
  ADD CONSTRAINT `FK_F246DB301BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_F246DB30727ACA70` FOREIGN KEY (`parent_id`) REFERENCES `c_survey` (`iid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_survey_answer`
--
ALTER TABLE `c_survey_answer`
  ADD CONSTRAINT `FK_8A897DD1E27F6BF` FOREIGN KEY (`question_id`) REFERENCES `c_survey_question` (`iid`),
  ADD CONSTRAINT `FK_8A897DDB3FE509D` FOREIGN KEY (`survey_id`) REFERENCES `c_survey` (`iid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_survey_invitation`
--
ALTER TABLE `c_survey_invitation`
  ADD CONSTRAINT `FK_D0BC7C2613FECDF` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_D0BC7C291D79BD3` FOREIGN KEY (`c_id`) REFERENCES `course` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_D0BC7C2A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_D0BC7C2B3FE509D` FOREIGN KEY (`survey_id`) REFERENCES `c_survey` (`iid`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_D0BC7C2FE54D947` FOREIGN KEY (`group_id`) REFERENCES `c_group_info` (`iid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_survey_question`
--
ALTER TABLE `c_survey_question`
  ADD CONSTRAINT `FK_92F05EE7568F3281` FOREIGN KEY (`parent_option_id`) REFERENCES `c_survey_question_option` (`iid`),
  ADD CONSTRAINT `FK_92F05EE7727ACA70` FOREIGN KEY (`parent_id`) REFERENCES `c_survey_question` (`iid`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_92F05EE7B3FE509D` FOREIGN KEY (`survey_id`) REFERENCES `c_survey` (`iid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_survey_question_option`
--
ALTER TABLE `c_survey_question_option`
  ADD CONSTRAINT `FK_C4B6F5F1E27F6BF` FOREIGN KEY (`question_id`) REFERENCES `c_survey_question` (`iid`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_C4B6F5FB3FE509D` FOREIGN KEY (`survey_id`) REFERENCES `c_survey` (`iid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_thematic`
--
ALTER TABLE `c_thematic`
  ADD CONSTRAINT `FK_6D8F59B91BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_thematic_advance`
--
ALTER TABLE `c_thematic_advance`
  ADD CONSTRAINT `FK_62798E97163DDA15` FOREIGN KEY (`attendance_id`) REFERENCES `c_attendance` (`iid`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_62798E972395FCED` FOREIGN KEY (`thematic_id`) REFERENCES `c_thematic` (`iid`),
  ADD CONSTRAINT `FK_62798E9754177093` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`);

--
-- Constraints der Tabelle `c_thematic_plan`
--
ALTER TABLE `c_thematic_plan`
  ADD CONSTRAINT `FK_1197487C2395FCED` FOREIGN KEY (`thematic_id`) REFERENCES `c_thematic` (`iid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_tool`
--
ALTER TABLE `c_tool`
  ADD CONSTRAINT `FK_845665801BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_84566580613FECDF` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_845665808F7B22CC` FOREIGN KEY (`tool_id`) REFERENCES `tool` (`id`),
  ADD CONSTRAINT `FK_8456658091D79BD3` FOREIGN KEY (`c_id`) REFERENCES `course` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_tool_intro`
--
ALTER TABLE `c_tool_intro`
  ADD CONSTRAINT `FK_D705267B1BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_D705267B1DF6B517` FOREIGN KEY (`c_tool_id`) REFERENCES `c_tool` (`iid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_wiki`
--
ALTER TABLE `c_wiki`
  ADD CONSTRAINT `FK_866887571BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_wiki_category`
--
ALTER TABLE `c_wiki_category`
  ADD CONSTRAINT `FK_17F1099A613FECDF` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_17F1099A727ACA70` FOREIGN KEY (`parent_id`) REFERENCES `c_wiki_category` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_17F1099A91D79BD3` FOREIGN KEY (`c_id`) REFERENCES `course` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_17F1099AA977936C` FOREIGN KEY (`tree_root`) REFERENCES `c_wiki_category` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `c_wiki_rel_category`
--
ALTER TABLE `c_wiki_rel_category`
  ADD CONSTRAINT `FK_AC88945B12469DE2` FOREIGN KEY (`category_id`) REFERENCES `c_wiki_category` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_AC88945BAA948DBE` FOREIGN KEY (`wiki_id`) REFERENCES `c_wiki` (`iid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `extra_field_options`
--
ALTER TABLE `extra_field_options`
  ADD CONSTRAINT `FK_A572E3AE443707B0` FOREIGN KEY (`field_id`) REFERENCES `extra_field` (`id`);

--
-- Constraints der Tabelle `extra_field_option_rel_field_option`
--
ALTER TABLE `extra_field_option_rel_field_option`
  ADD CONSTRAINT `FK_8E04DF6B42C79BE5` FOREIGN KEY (`field_option_id`) REFERENCES `extra_field_options` (`id`),
  ADD CONSTRAINT `FK_8E04DF6B443707B0` FOREIGN KEY (`field_id`) REFERENCES `extra_field` (`id`),
  ADD CONSTRAINT `FK_8E04DF6BCFAFCECC` FOREIGN KEY (`related_field_option_id`) REFERENCES `extra_field_options` (`id`);

--
-- Constraints der Tabelle `extra_field_rel_tag`
--
ALTER TABLE `extra_field_rel_tag`
  ADD CONSTRAINT `FK_F8817295443707B0` FOREIGN KEY (`field_id`) REFERENCES `extra_field` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_F8817295BAD26311` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `extra_field_saved_search`
--
ALTER TABLE `extra_field_saved_search`
  ADD CONSTRAINT `FK_16ABE32A443707B0` FOREIGN KEY (`field_id`) REFERENCES `extra_field` (`id`),
  ADD CONSTRAINT `FK_16ABE32AA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `extra_field_values`
--
ALTER TABLE `extra_field_values`
  ADD CONSTRAINT `FK_171DF924443707B0` FOREIGN KEY (`field_id`) REFERENCES `extra_field` (`id`),
  ADD CONSTRAINT `FK_171DF9245DA1941` FOREIGN KEY (`asset_id`) REFERENCES `asset` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `fos_user_user_group`
--
ALTER TABLE `fos_user_user_group`
  ADD CONSTRAINT `FK_B3C77447A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_B3C77447FE54D947` FOREIGN KEY (`group_id`) REFERENCES `fos_group` (`id`);

--
-- Constraints der Tabelle `gradebook_category`
--
ALTER TABLE `gradebook_category`
  ADD CONSTRAINT `FK_96A4C705378B7921` FOREIGN KEY (`grade_model_id`) REFERENCES `grade_model` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_96A4C705613FECDF` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_96A4C705727ACA70` FOREIGN KEY (`parent_id`) REFERENCES `gradebook_category` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_96A4C70591D79BD3` FOREIGN KEY (`c_id`) REFERENCES `course` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_96A4C705A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_96A4C705C33F7837` FOREIGN KEY (`document_id`) REFERENCES `c_document` (`iid`) ON DELETE SET NULL;

--
-- Constraints der Tabelle `gradebook_certificate`
--
ALTER TABLE `gradebook_certificate`
  ADD CONSTRAINT `FK_650669D1BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_650669DA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_650669DE6ADA943` FOREIGN KEY (`cat_id`) REFERENCES `gradebook_category` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `gradebook_comment`
--
ALTER TABLE `gradebook_comment`
  ADD CONSTRAINT `FK_C3B70763A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_C3B70763AD3ED51C` FOREIGN KEY (`gradebook_id`) REFERENCES `gradebook_category` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `gradebook_evaluation`
--
ALTER TABLE `gradebook_evaluation`
  ADD CONSTRAINT `FK_DDDED80412469DE2` FOREIGN KEY (`category_id`) REFERENCES `gradebook_category` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_DDDED80491D79BD3` FOREIGN KEY (`c_id`) REFERENCES `course` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `gradebook_link`
--
ALTER TABLE `gradebook_link`
  ADD CONSTRAINT `FK_4F0F595F12469DE2` FOREIGN KEY (`category_id`) REFERENCES `gradebook_category` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_4F0F595F91D79BD3` FOREIGN KEY (`c_id`) REFERENCES `course` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `gradebook_linkeval_log`
--
ALTER TABLE `gradebook_linkeval_log`
  ADD CONSTRAINT `FK_1F554C7474C99BA2` FOREIGN KEY (`user_id_log`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `gradebook_result`
--
ALTER TABLE `gradebook_result`
  ADD CONSTRAINT `FK_B88AEB67456C5646` FOREIGN KEY (`evaluation_id`) REFERENCES `gradebook_evaluation` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_B88AEB67A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `gradebook_result_attempt`
--
ALTER TABLE `gradebook_result_attempt`
  ADD CONSTRAINT `FK_28B1CC3F7A7B643` FOREIGN KEY (`result_id`) REFERENCES `gradebook_result` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `gradebook_result_log`
--
ALTER TABLE `gradebook_result_log`
  ADD CONSTRAINT `FK_C5C4CABB456C5646` FOREIGN KEY (`evaluation_id`) REFERENCES `gradebook_evaluation` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_C5C4CABB7A7B643` FOREIGN KEY (`result_id`) REFERENCES `gradebook_result` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_C5C4CABBA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `gradebook_score_display`
--
ALTER TABLE `gradebook_score_display`
  ADD CONSTRAINT `FK_61F7DC8412469DE2` FOREIGN KEY (`category_id`) REFERENCES `gradebook_category` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `gradebook_score_log`
--
ALTER TABLE `gradebook_score_log`
  ADD CONSTRAINT `FK_640C644912469DE2` FOREIGN KEY (`category_id`) REFERENCES `gradebook_category` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_640C6449A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `grade_components`
--
ALTER TABLE `grade_components`
  ADD CONSTRAINT `FK_F34247C378B7921` FOREIGN KEY (`grade_model_id`) REFERENCES `grade_model` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `illustration`
--
ALTER TABLE `illustration`
  ADD CONSTRAINT `FK_D67B9A421BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `justification_document_rel_users`
--
ALTER TABLE `justification_document_rel_users`
  ADD CONSTRAINT `FK_D1BB19421F2B6144` FOREIGN KEY (`justification_document_id`) REFERENCES `justification_document` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_D1BB1942A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `language`
--
ALTER TABLE `language`
  ADD CONSTRAINT `FK_D4DB71B5727ACA70` FOREIGN KEY (`parent_id`) REFERENCES `language` (`id`);

--
-- Constraints der Tabelle `lti_external_tool`
--
ALTER TABLE `lti_external_tool`
  ADD CONSTRAINT `FK_DB0E04E41BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_DB0E04E482F80D8B` FOREIGN KEY (`gradebook_eval_id`) REFERENCES `gradebook_evaluation` (`id`) ON DELETE SET NULL;

--
-- Constraints der Tabelle `lti_lineitem`
--
ALTER TABLE `lti_lineitem`
  ADD CONSTRAINT `FK_5C76B75D1323A575` FOREIGN KEY (`evaluation`) REFERENCES `gradebook_evaluation` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_5C76B75D8F7B22CC` FOREIGN KEY (`tool_id`) REFERENCES `lti_external_tool` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `lti_token`
--
ALTER TABLE `lti_token`
  ADD CONSTRAINT `FK_EA71C468F7B22CC` FOREIGN KEY (`tool_id`) REFERENCES `lti_external_tool` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `mail_template`
--
ALTER TABLE `mail_template`
  ADD CONSTRAINT `FK_4AB7DECB81CFDAE7` FOREIGN KEY (`url_id`) REFERENCES `access_url` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_4AB7DECBF675F31B` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`) ON DELETE SET NULL;

--
-- Constraints der Tabelle `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `FK_B6BD307F727ACA70` FOREIGN KEY (`parent_id`) REFERENCES `message` (`id`),
  ADD CONSTRAINT `FK_B6BD307FF6C43E79` FOREIGN KEY (`user_sender_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_B6BD307FFE54D947` FOREIGN KEY (`group_id`) REFERENCES `usergroup` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `message_attachment`
--
ALTER TABLE `message_attachment`
  ADD CONSTRAINT `FK_B68FF5241BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_B68FF524537A1329` FOREIGN KEY (`message_id`) REFERENCES `message` (`id`);

--
-- Constraints der Tabelle `message_rel_user`
--
ALTER TABLE `message_rel_user`
  ADD CONSTRAINT `FK_325D70B9537A1329` FOREIGN KEY (`message_id`) REFERENCES `message` (`id`),
  ADD CONSTRAINT `FK_325D70B9A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `message_rel_user_rel_tags`
--
ALTER TABLE `message_rel_user_rel_tags`
  ADD CONSTRAINT `FK_B4B37A208DF5FE1E` FOREIGN KEY (`message_tag_id`) REFERENCES `message_tag` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_B4B37A20962B5422` FOREIGN KEY (`message_rel_user_id`) REFERENCES `message_rel_user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `message_tag`
--
ALTER TABLE `message_tag`
  ADD CONSTRAINT `FK_2ABC3D6FA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `notification_event_rel_user`
--
ALTER TABLE `notification_event_rel_user`
  ADD CONSTRAINT `FK_9F7995A671F7E88B` FOREIGN KEY (`event_id`) REFERENCES `notification_event` (`id`),
  ADD CONSTRAINT `FK_9F7995A6A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints der Tabelle `page`
--
ALTER TABLE `page`
  ADD CONSTRAINT `FK_140AB62012469DE2` FOREIGN KEY (`category_id`) REFERENCES `page_category` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_140AB62061220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_140AB62073444FD5` FOREIGN KEY (`access_url_id`) REFERENCES `access_url` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `page_category`
--
ALTER TABLE `page_category`
  ADD CONSTRAINT `FK_86D31EE161220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `page_layout`
--
ALTER TABLE `page_layout`
  ADD CONSTRAINT `FK_55EC9DFC16FE72E1` FOREIGN KEY (`updated_by`) REFERENCES `user` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_55EC9DFC1D784B46` FOREIGN KEY (`page_layout_template_id`) REFERENCES `page_layout_template` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_55EC9DFCDE12AB56` FOREIGN KEY (`created_by`) REFERENCES `user` (`id`) ON DELETE SET NULL;

--
-- Constraints der Tabelle `permission_rel_role`
--
ALTER TABLE `permission_rel_role`
  ADD CONSTRAINT `FK_14B93D3DD60322AC` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`),
  ADD CONSTRAINT `FK_14B93D3DFED90CCA` FOREIGN KEY (`permission_id`) REFERENCES `permission` (`id`);

--
-- Constraints der Tabelle `personal_file`
--
ALTER TABLE `personal_file`
  ADD CONSTRAINT `FK_BD95312D1BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `portfolio`
--
ALTER TABLE `portfolio`
  ADD CONSTRAINT `FK_A9ED106212469DE2` FOREIGN KEY (`category_id`) REFERENCES `portfolio_category` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_A9ED10621BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_A9ED1062FC4CB679` FOREIGN KEY (`duplicated_from`) REFERENCES `portfolio` (`id`) ON DELETE SET NULL;

--
-- Constraints der Tabelle `portfolio_category`
--
ALTER TABLE `portfolio_category`
  ADD CONSTRAINT `FK_7AC64359727ACA70` FOREIGN KEY (`parent_id`) REFERENCES `portfolio_category` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_7AC64359A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `portfolio_comment`
--
ALTER TABLE `portfolio_comment`
  ADD CONSTRAINT `FK_C2C17DA2126F525E` FOREIGN KEY (`item_id`) REFERENCES `portfolio` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_C2C17DA21BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `portfolio_rel_tag`
--
ALTER TABLE `portfolio_rel_tag`
  ADD CONSTRAINT `FK_DB734472613FECDF` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`),
  ADD CONSTRAINT `FK_DB73447291D79BD3` FOREIGN KEY (`c_id`) REFERENCES `course` (`id`),
  ADD CONSTRAINT `FK_DB734472BAD26311` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`);

--
-- Constraints der Tabelle `promotion`
--
ALTER TABLE `promotion`
  ADD CONSTRAINT `FK_C11D7DD1B58CDA09` FOREIGN KEY (`career_id`) REFERENCES `career` (`id`);

--
-- Constraints der Tabelle `push_subscription`
--
ALTER TABLE `push_subscription`
  ADD CONSTRAINT `FK_562830F3A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `reset_password_request`
--
ALTER TABLE `reset_password_request`
  ADD CONSTRAINT `FK_7CE748AA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints der Tabelle `resource_comment`
--
ALTER TABLE `resource_comment`
  ADD CONSTRAINT `FK_C9D4B5841BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_C9D4B584727ACA70` FOREIGN KEY (`parent_id`) REFERENCES `resource_comment` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_C9D4B584F675F31B` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `resource_file`
--
ALTER TABLE `resource_file`
  ADD CONSTRAINT `FK_83BF96AA1BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`),
  ADD CONSTRAINT `FK_83BF96AA73444FD5` FOREIGN KEY (`access_url_id`) REFERENCES `access_url` (`id`) ON DELETE SET NULL;

--
-- Constraints der Tabelle `resource_link`
--
ALTER TABLE `resource_link`
  ADD CONSTRAINT `FK_398C394B1BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_398C394B613FECDF` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_398C394B91D79BD3` FOREIGN KEY (`c_id`) REFERENCES `course` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_398C394BA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_398C394BD2112630` FOREIGN KEY (`usergroup_id`) REFERENCES `usergroup` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_398C394BFE54D947` FOREIGN KEY (`group_id`) REFERENCES `c_group_info` (`iid`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `resource_node`
--
ALTER TABLE `resource_node`
  ADD CONSTRAINT `FK_8A5F48FF61220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_8A5F48FF727ACA70` FOREIGN KEY (`parent_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_8A5F48FF7EE0A59A` FOREIGN KEY (`resource_format_id`) REFERENCES `resource_format` (`id`),
  ADD CONSTRAINT `FK_8A5F48FF98EC6B7B` FOREIGN KEY (`resource_type_id`) REFERENCES `resource_type` (`id`);

--
-- Constraints der Tabelle `resource_right`
--
ALTER TABLE `resource_right`
  ADD CONSTRAINT `FK_9F710F26F004E599` FOREIGN KEY (`resource_link_id`) REFERENCES `resource_link` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `resource_tag`
--
ALTER TABLE `resource_tag`
  ADD CONSTRAINT `FK_23D039CAF675F31B` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`) ON DELETE SET NULL;

--
-- Constraints der Tabelle `resource_type`
--
ALTER TABLE `resource_type`
  ADD CONSTRAINT `FK_83FEF7938F7B22CC` FOREIGN KEY (`tool_id`) REFERENCES `tool` (`id`);

--
-- Constraints der Tabelle `resource_user_tag`
--
ALTER TABLE `resource_user_tag`
  ADD CONSTRAINT `FK_46131CA5A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_46131CA5BAD26311` FOREIGN KEY (`tag_id`) REFERENCES `resource_tag` (`id`) ON DELETE SET NULL;

--
-- Constraints der Tabelle `room`
--
ALTER TABLE `room`
  ADD CONSTRAINT `FK_729F519BDCD6CC49` FOREIGN KEY (`branch_id`) REFERENCES `branch_sync` (`id`);

--
-- Constraints der Tabelle `search_engine_ref`
--
ALTER TABLE `search_engine_ref`
  ADD CONSTRAINT `FK_473F037891D79BD3` FOREIGN KEY (`c_id`) REFERENCES `course` (`id`);

--
-- Constraints der Tabelle `sequence_formula`
--
ALTER TABLE `sequence_formula`
  ADD CONSTRAINT `FK_533B915955C65E08` FOREIGN KEY (`sequence_variable_id`) REFERENCES `sequence_variable` (`id`),
  ADD CONSTRAINT `FK_533B9159B2D1386E` FOREIGN KEY (`sequence_method_id`) REFERENCES `sequence_method` (`id`);

--
-- Constraints der Tabelle `sequence_resource`
--
ALTER TABLE `sequence_resource`
  ADD CONSTRAINT `FK_34ADA43998FB19AE` FOREIGN KEY (`sequence_id`) REFERENCES `sequence` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `sequence_row_entity`
--
ALTER TABLE `sequence_row_entity`
  ADD CONSTRAINT `FK_2779761FAED14944` FOREIGN KEY (`sequence_type_entity_id`) REFERENCES `sequence_type_entity` (`id`);

--
-- Constraints der Tabelle `sequence_rule_condition`
--
ALTER TABLE `sequence_rule_condition`
  ADD CONSTRAINT `FK_F948EE6A4044CA89` FOREIGN KEY (`sequence_rule_id`) REFERENCES `sequence_rule` (`id`),
  ADD CONSTRAINT `FK_F948EE6A8C0A7083` FOREIGN KEY (`sequence_condition_id`) REFERENCES `sequence_condition` (`id`);

--
-- Constraints der Tabelle `sequence_rule_method`
--
ALTER TABLE `sequence_rule_method`
  ADD CONSTRAINT `FK_6336EA764044CA89` FOREIGN KEY (`sequence_rule_id`) REFERENCES `sequence_rule` (`id`),
  ADD CONSTRAINT `FK_6336EA76B2D1386E` FOREIGN KEY (`sequence_method_id`) REFERENCES `sequence_method` (`id`);

--
-- Constraints der Tabelle `sequence_valid`
--
ALTER TABLE `sequence_valid`
  ADD CONSTRAINT `FK_F78B9CE655C65E08` FOREIGN KEY (`sequence_variable_id`) REFERENCES `sequence_variable` (`id`),
  ADD CONSTRAINT `FK_F78B9CE68C0A7083` FOREIGN KEY (`sequence_condition_id`) REFERENCES `sequence_condition` (`id`);

--
-- Constraints der Tabelle `sequence_value`
--
ALTER TABLE `sequence_value`
  ADD CONSTRAINT `FK_66FBF12D218736B2` FOREIGN KEY (`sequence_row_entity_id`) REFERENCES `sequence_row_entity` (`id`),
  ADD CONSTRAINT `FK_66FBF12DA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `session`
--
ALTER TABLE `session`
  ADD CONSTRAINT `FK_D044D5D4139DF194` FOREIGN KEY (`promotion_id`) REFERENCES `promotion` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_D044D5D43DA5256D` FOREIGN KEY (`image_id`) REFERENCES `asset` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_D044D5D4EE1F8395` FOREIGN KEY (`session_category_id`) REFERENCES `session_category` (`id`);

--
-- Constraints der Tabelle `session_category`
--
ALTER TABLE `session_category`
  ADD CONSTRAINT `FK_8DE079A973444FD5` FOREIGN KEY (`access_url_id`) REFERENCES `access_url` (`id`);

--
-- Constraints der Tabelle `session_rel_course`
--
ALTER TABLE `session_rel_course`
  ADD CONSTRAINT `FK_12D110D3613FECDF` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`),
  ADD CONSTRAINT `FK_12D110D391D79BD3` FOREIGN KEY (`c_id`) REFERENCES `course` (`id`);

--
-- Constraints der Tabelle `session_rel_course_rel_user`
--
ALTER TABLE `session_rel_course_rel_user`
  ADD CONSTRAINT `FK_720167E613FECDF` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_720167E91D79BD3` FOREIGN KEY (`c_id`) REFERENCES `course` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_720167EA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `session_rel_user`
--
ALTER TABLE `session_rel_user`
  ADD CONSTRAINT `FK_B0D7D4C0613FECDF` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`),
  ADD CONSTRAINT `FK_B0D7D4C0A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `settings`
--
ALTER TABLE `settings`
  ADD CONSTRAINT `FK_E545A0C59436187B` FOREIGN KEY (`access_url`) REFERENCES `access_url` (`id`),
  ADD CONSTRAINT `FK_E545A0C5C72FB79B` FOREIGN KEY (`value_template_id`) REFERENCES `settings_value_template` (`id`) ON DELETE SET NULL;

--
-- Constraints der Tabelle `skill`
--
ALTER TABLE `skill`
  ADD CONSTRAINT `FK_5E3DE4775DA1941` FOREIGN KEY (`asset_id`) REFERENCES `asset` (`id`),
  ADD CONSTRAINT `FK_5E3DE477CCFA12B8` FOREIGN KEY (`profile_id`) REFERENCES `skill_level_profile` (`id`);

--
-- Constraints der Tabelle `skill_level`
--
ALTER TABLE `skill_level`
  ADD CONSTRAINT `FK_BFC25F2FCCFA12B8` FOREIGN KEY (`profile_id`) REFERENCES `skill_level_profile` (`id`);

--
-- Constraints der Tabelle `skill_rel_course`
--
ALTER TABLE `skill_rel_course`
  ADD CONSTRAINT `FK_E7CEC7FA5585C142` FOREIGN KEY (`skill_id`) REFERENCES `skill` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_E7CEC7FA613FECDF` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_E7CEC7FA91D79BD3` FOREIGN KEY (`c_id`) REFERENCES `course` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `skill_rel_gradebook`
--
ALTER TABLE `skill_rel_gradebook`
  ADD CONSTRAINT `FK_4AC0B45E5585C142` FOREIGN KEY (`skill_id`) REFERENCES `skill` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_4AC0B45EAD3ED51C` FOREIGN KEY (`gradebook_id`) REFERENCES `gradebook_category` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `skill_rel_item`
--
ALTER TABLE `skill_rel_item`
  ADD CONSTRAINT `FK_EB5B2A0D5585C142` FOREIGN KEY (`skill_id`) REFERENCES `skill` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `skill_rel_item_rel_user`
--
ALTER TABLE `skill_rel_item_rel_user`
  ADD CONSTRAINT `FK_D1133E0DA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_D1133E0DFD4B12DC` FOREIGN KEY (`skill_rel_item_id`) REFERENCES `skill_rel_item` (`id`);

--
-- Constraints der Tabelle `skill_rel_profile`
--
ALTER TABLE `skill_rel_profile`
  ADD CONSTRAINT `FK_6E73EA8D5585C142` FOREIGN KEY (`skill_id`) REFERENCES `skill` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_6E73EA8DCCFA12B8` FOREIGN KEY (`profile_id`) REFERENCES `skill_profile` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `skill_rel_skill`
--
ALTER TABLE `skill_rel_skill`
  ADD CONSTRAINT `FK_DA77E5A65585C142` FOREIGN KEY (`skill_id`) REFERENCES `skill` (`id`),
  ADD CONSTRAINT `FK_DA77E5A6727ACA70` FOREIGN KEY (`parent_id`) REFERENCES `skill` (`id`) ON DELETE SET NULL;

--
-- Constraints der Tabelle `skill_rel_user`
--
ALTER TABLE `skill_rel_user`
  ADD CONSTRAINT `FK_79D3D95A5585C142` FOREIGN KEY (`skill_id`) REFERENCES `skill` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_79D3D95A591CC992` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_79D3D95A613FECDF` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_79D3D95AA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_79D3D95AF68F11CE` FOREIGN KEY (`acquired_level`) REFERENCES `skill_level` (`id`);

--
-- Constraints der Tabelle `skill_rel_user_comment`
--
ALTER TABLE `skill_rel_user_comment`
  ADD CONSTRAINT `FK_7AE9F6B63AF3B65B` FOREIGN KEY (`feedback_giver_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_7AE9F6B6484A9317` FOREIGN KEY (`skill_rel_user_id`) REFERENCES `skill_rel_user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `social_post`
--
ALTER TABLE `social_post`
  ADD CONSTRAINT `FK_159BBFE964482423` FOREIGN KEY (`user_receiver_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FK_159BBFE9727ACA70` FOREIGN KEY (`parent_id`) REFERENCES `social_post` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_159BBFE9E8EBF277` FOREIGN KEY (`group_receiver_id`) REFERENCES `usergroup` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_159BBFE9F624B39D` FOREIGN KEY (`sender_id`) REFERENCES `user` (`id`);

--
-- Constraints der Tabelle `social_post_attachments`
--
ALTER TABLE `social_post_attachments`
  ADD CONSTRAINT `FK_DF2A8F341BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_DF2A8F34C4F2D6B1` FOREIGN KEY (`social_post_id`) REFERENCES `social_post` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `social_post_feedback`
--
ALTER TABLE `social_post_feedback`
  ADD CONSTRAINT `FK_DB7E436DA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_DB7E436DC4F2D6B1` FOREIGN KEY (`social_post_id`) REFERENCES `social_post` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `system_template`
--
ALTER TABLE `system_template`
  ADD CONSTRAINT `FK_FE8AAE013DA5256D` FOREIGN KEY (`image_id`) REFERENCES `asset` (`id`) ON DELETE SET NULL;

--
-- Constraints der Tabelle `sys_announcement`
--
ALTER TABLE `sys_announcement`
  ADD CONSTRAINT `FK_E4A3EAD4139DF194` FOREIGN KEY (`promotion_id`) REFERENCES `promotion` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_E4A3EAD473444FD5` FOREIGN KEY (`access_url_id`) REFERENCES `access_url` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_E4A3EAD4B58CDA09` FOREIGN KEY (`career_id`) REFERENCES `career` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `tag`
--
ALTER TABLE `tag`
  ADD CONSTRAINT `FK_389B783443707B0` FOREIGN KEY (`field_id`) REFERENCES `extra_field` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `templates`
--
ALTER TABLE `templates`
  ADD CONSTRAINT `FK_6F287D8E3DA5256D` FOREIGN KEY (`image_id`) REFERENCES `asset` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_6F287D8E91D79BD3` FOREIGN KEY (`c_id`) REFERENCES `course` (`id`),
  ADD CONSTRAINT `FK_6F287D8EA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `third_party_data_exchange`
--
ALTER TABLE `third_party_data_exchange`
  ADD CONSTRAINT `FK_162BE47354C4149C` FOREIGN KEY (`third_party_id`) REFERENCES `third_party` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `third_party_data_exchange_user`
--
ALTER TABLE `third_party_data_exchange_user`
  ADD CONSTRAINT `FK_1F59F6F4A658DC87` FOREIGN KEY (`third_party_data_exchange_id`) REFERENCES `third_party_data_exchange` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_1F59F6F4A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `ticket_assigned_log`
--
ALTER TABLE `ticket_assigned_log`
  ADD CONSTRAINT `FK_54B65868700047D2` FOREIGN KEY (`ticket_id`) REFERENCES `ticket_ticket` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_54B65868A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `ticket_category`
--
ALTER TABLE `ticket_category`
  ADD CONSTRAINT `FK_8325E540166D1F9C` FOREIGN KEY (`project_id`) REFERENCES `ticket_project` (`id`);

--
-- Constraints der Tabelle `ticket_category_rel_user`
--
ALTER TABLE `ticket_category_rel_user`
  ADD CONSTRAINT `FK_5B8A98712469DE2` FOREIGN KEY (`category_id`) REFERENCES `ticket_category` (`id`),
  ADD CONSTRAINT `FK_5B8A987A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `ticket_message`
--
ALTER TABLE `ticket_message`
  ADD CONSTRAINT `FK_BA71692D700047D2` FOREIGN KEY (`ticket_id`) REFERENCES `ticket_ticket` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `ticket_message_attachments`
--
ALTER TABLE `ticket_message_attachments`
  ADD CONSTRAINT `FK_70BF9E261BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_70BF9E26537A1329` FOREIGN KEY (`message_id`) REFERENCES `ticket_message` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_70BF9E26700047D2` FOREIGN KEY (`ticket_id`) REFERENCES `ticket_ticket` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `ticket_priority`
--
ALTER TABLE `ticket_priority`
  ADD CONSTRAINT `FK_E7CF20A673444FD5` FOREIGN KEY (`access_url_id`) REFERENCES `access_url` (`id`);

--
-- Constraints der Tabelle `ticket_project`
--
ALTER TABLE `ticket_project`
  ADD CONSTRAINT `FK_237F89BC73444FD5` FOREIGN KEY (`access_url_id`) REFERENCES `access_url` (`id`);

--
-- Constraints der Tabelle `ticket_rel_user`
--
ALTER TABLE `ticket_rel_user`
  ADD CONSTRAINT `FK_BE124829700047D2` FOREIGN KEY (`ticket_id`) REFERENCES `ticket_ticket` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_BE124829A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `ticket_status`
--
ALTER TABLE `ticket_status`
  ADD CONSTRAINT `FK_1420FD773444FD5` FOREIGN KEY (`access_url_id`) REFERENCES `access_url` (`id`);

--
-- Constraints der Tabelle `ticket_ticket`
--
ALTER TABLE `ticket_ticket`
  ADD CONSTRAINT `FK_EDE2C76812469DE2` FOREIGN KEY (`category_id`) REFERENCES `ticket_category` (`id`),
  ADD CONSTRAINT `FK_EDE2C768166D1F9C` FOREIGN KEY (`project_id`) REFERENCES `ticket_project` (`id`),
  ADD CONSTRAINT `FK_EDE2C768497B19F9` FOREIGN KEY (`priority_id`) REFERENCES `ticket_priority` (`id`),
  ADD CONSTRAINT `FK_EDE2C768591CC992` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_EDE2C768613FECDF` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_EDE2C7686219A7B7` FOREIGN KEY (`assigned_last_user`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_EDE2C7686BF700BD` FOREIGN KEY (`status_id`) REFERENCES `ticket_status` (`id`),
  ADD CONSTRAINT `FK_EDE2C76873444FD5` FOREIGN KEY (`access_url_id`) REFERENCES `access_url` (`id`);

--
-- Constraints der Tabelle `tool_resource_right`
--
ALTER TABLE `tool_resource_right`
  ADD CONSTRAINT `FK_E5C562598F7B22CC` FOREIGN KEY (`tool_id`) REFERENCES `tool` (`id`);

--
-- Constraints der Tabelle `track_e_access_complete`
--
ALTER TABLE `track_e_access_complete`
  ADD CONSTRAINT `FK_57FAFDBFA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `track_e_attempt`
--
ALTER TABLE `track_e_attempt`
  ADD CONSTRAINT `FK_F8C342C3A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_F8C342C3B5A18F57` FOREIGN KEY (`exe_id`) REFERENCES `track_e_exercises` (`exe_id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `track_e_attempt_qualify`
--
ALTER TABLE `track_e_attempt_qualify`
  ADD CONSTRAINT `FK_B88BC9BCB5A18F57` FOREIGN KEY (`exe_id`) REFERENCES `track_e_exercises` (`exe_id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `track_e_course_access`
--
ALTER TABLE `track_e_course_access`
  ADD CONSTRAINT `FK_E8C05DC5A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `track_e_downloads`
--
ALTER TABLE `track_e_downloads`
  ADD CONSTRAINT `FK_EEDF4DA6F004E599` FOREIGN KEY (`resource_link_id`) REFERENCES `resource_link` (`id`) ON DELETE SET NULL;

--
-- Constraints der Tabelle `track_e_exercises`
--
ALTER TABLE `track_e_exercises`
  ADD CONSTRAINT `FK_AA0DA082613FECDF` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_AA0DA08291D79BD3` FOREIGN KEY (`c_id`) REFERENCES `course` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_AA0DA082B9773F9E` FOREIGN KEY (`exe_exo_id`) REFERENCES `c_quiz` (`iid`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_AA0DA082F6A6790` FOREIGN KEY (`exe_user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `track_e_exercise_confirmation`
--
ALTER TABLE `track_e_exercise_confirmation`
  ADD CONSTRAINT `FK_980C28C7A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `track_e_hotspot`
--
ALTER TABLE `track_e_hotspot`
  ADD CONSTRAINT `FK_A89CC3B691D79BD3` FOREIGN KEY (`c_id`) REFERENCES `course` (`id`);

--
-- Constraints der Tabelle `track_e_login`
--
ALTER TABLE `track_e_login`
  ADD CONSTRAINT `FK_C8EA20EB743CDE8` FOREIGN KEY (`login_user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `FK_8D93D6491BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `usergroup`
--
ALTER TABLE `usergroup`
  ADD CONSTRAINT `FK_4A6478171BAD783F` FOREIGN KEY (`resource_node_id`) REFERENCES `resource_node` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `usergroup_rel_course`
--
ALTER TABLE `usergroup_rel_course`
  ADD CONSTRAINT `FK_4A8DF159591CC992` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_4A8DF159D2112630` FOREIGN KEY (`usergroup_id`) REFERENCES `usergroup` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `usergroup_rel_question`
--
ALTER TABLE `usergroup_rel_question`
  ADD CONSTRAINT `FK_FF3E58F21E27F6BF` FOREIGN KEY (`question_id`) REFERENCES `c_quiz_question` (`iid`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_FF3E58F2D2112630` FOREIGN KEY (`usergroup_id`) REFERENCES `usergroup` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `usergroup_rel_session`
--
ALTER TABLE `usergroup_rel_session`
  ADD CONSTRAINT `FK_70122432613FECDF` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_70122432D2112630` FOREIGN KEY (`usergroup_id`) REFERENCES `usergroup` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `usergroup_rel_user`
--
ALTER TABLE `usergroup_rel_user`
  ADD CONSTRAINT `FK_739515A9A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_739515A9D2112630` FOREIGN KEY (`usergroup_id`) REFERENCES `usergroup` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `user_auth_source`
--
ALTER TABLE `user_auth_source`
  ADD CONSTRAINT `FK_D632110481CFDAE7` FOREIGN KEY (`url_id`) REFERENCES `access_url` (`id`),
  ADD CONSTRAINT `FK_D6321104A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `user_career`
--
ALTER TABLE `user_career`
  ADD CONSTRAINT `FK_D70977B9A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FK_D70977B9B58CDA09` FOREIGN KEY (`career_id`) REFERENCES `career` (`id`);

--
-- Constraints der Tabelle `user_course_category`
--
ALTER TABLE `user_course_category`
  ADD CONSTRAINT `FK_BD241818A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `user_rel_course_vote`
--
ALTER TABLE `user_rel_course_vote`
  ADD CONSTRAINT `FK_4038AA47613FECDF` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_4038AA4781CFDAE7` FOREIGN KEY (`url_id`) REFERENCES `access_url` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_4038AA4791D79BD3` FOREIGN KEY (`c_id`) REFERENCES `course` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_4038AA47A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `user_rel_tag`
--
ALTER TABLE `user_rel_tag`
  ADD CONSTRAINT `FK_D5CB75B6A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_D5CB75B6BAD26311` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `user_rel_user`
--
ALTER TABLE `user_rel_user`
  ADD CONSTRAINT `FK_DBF650A893D1119E` FOREIGN KEY (`friend_user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_DBF650A8A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `xapi_attachment`
--
ALTER TABLE `xapi_attachment`
  ADD CONSTRAINT `FK_7148C9A1849CB65B` FOREIGN KEY (`statement_id`) REFERENCES `xapi_statement` (`id`);

--
-- Constraints der Tabelle `xapi_cmi5_item`
--
ALTER TABLE `xapi_cmi5_item`
  ADD CONSTRAINT `FK_7CA116D8727ACA70` FOREIGN KEY (`parent_id`) REFERENCES `xapi_cmi5_item` (`id`),
  ADD CONSTRAINT `FK_7CA116D879066886` FOREIGN KEY (`root_id`) REFERENCES `xapi_cmi5_item` (`id`),
  ADD CONSTRAINT `FK_7CA116D88F7B22CC` FOREIGN KEY (`tool_id`) REFERENCES `xapi_tool_launch` (`id`);

--
-- Constraints der Tabelle `xapi_context`
--
ALTER TABLE `xapi_context`
  ADD CONSTRAINT `FK_3D777190296CD8AE` FOREIGN KEY (`team_id`) REFERENCES `xapi_object` (`identifier`),
  ADD CONSTRAINT `FK_3D7771908C4FC193` FOREIGN KEY (`instructor_id`) REFERENCES `xapi_object` (`identifier`),
  ADD CONSTRAINT `FK_3D777190D0A19400` FOREIGN KEY (`extensions_id`) REFERENCES `xapi_extensions` (`identifier`);

--
-- Constraints der Tabelle `xapi_internal_log`
--
ALTER TABLE `xapi_internal_log`
  ADD CONSTRAINT `FK_C1C667ACA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints der Tabelle `xapi_object`
--
ALTER TABLE `xapi_object`
  ADD CONSTRAINT `FK_E2B6864010DAF24A` FOREIGN KEY (`actor_id`) REFERENCES `xapi_object` (`identifier`),
  ADD CONSTRAINT `FK_E2B68640232D562B` FOREIGN KEY (`object_id`) REFERENCES `xapi_object` (`identifier`),
  ADD CONSTRAINT `FK_E2B686402C43459F` FOREIGN KEY (`parent_context_id`) REFERENCES `xapi_context` (`identifier`),
  ADD CONSTRAINT `FK_E2B686404D1E91B1` FOREIGN KEY (`category_context_id`) REFERENCES `xapi_context` (`identifier`),
  ADD CONSTRAINT `FK_E2B68640C1D03483` FOREIGN KEY (`verb_id`) REFERENCES `xapi_verb` (`identifier`),
  ADD CONSTRAINT `FK_E2B68640C89A54F0` FOREIGN KEY (`grouping_context_id`) REFERENCES `xapi_context` (`identifier`),
  ADD CONSTRAINT `FK_E2B68640D0D57945` FOREIGN KEY (`other_context_id`) REFERENCES `xapi_context` (`identifier`),
  ADD CONSTRAINT `FK_E2B68640D1735DC4` FOREIGN KEY (`activity_extensions_id`) REFERENCES `xapi_extensions` (`identifier`),
  ADD CONSTRAINT `FK_E2B68640FE54D947` FOREIGN KEY (`group_id`) REFERENCES `xapi_object` (`identifier`);

--
-- Constraints der Tabelle `xapi_result`
--
ALTER TABLE `xapi_result`
  ADD CONSTRAINT `FK_5971ECBFD0A19400` FOREIGN KEY (`extensions_id`) REFERENCES `xapi_extensions` (`identifier`);

--
-- Constraints der Tabelle `xapi_statement`
--
ALTER TABLE `xapi_statement`
  ADD CONSTRAINT `FK_BAF6663B10DAF24A` FOREIGN KEY (`actor_id`) REFERENCES `xapi_object` (`identifier`),
  ADD CONSTRAINT `FK_BAF6663B232D562B` FOREIGN KEY (`object_id`) REFERENCES `xapi_object` (`identifier`),
  ADD CONSTRAINT `FK_BAF6663B6B00C1CF` FOREIGN KEY (`context_id`) REFERENCES `xapi_context` (`identifier`),
  ADD CONSTRAINT `FK_BAF6663B7A7B643` FOREIGN KEY (`result_id`) REFERENCES `xapi_result` (`identifier`),
  ADD CONSTRAINT `FK_BAF6663B81EC865B` FOREIGN KEY (`authority_id`) REFERENCES `xapi_object` (`identifier`),
  ADD CONSTRAINT `FK_BAF6663BC1D03483` FOREIGN KEY (`verb_id`) REFERENCES `xapi_verb` (`identifier`);

--
-- Constraints der Tabelle `xapi_tool_launch`
--
ALTER TABLE `xapi_tool_launch`
  ADD CONSTRAINT `FK_E18CB583591CC992` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`),
  ADD CONSTRAINT `FK_E18CB583613FECDF` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
