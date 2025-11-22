// Auto-generated from symfony_education.sql to describe education entities.
// Do not edit by hand; update symfony_education.sql and rerun server/utils/generateEducationTypes.mjs.

export interface AccessUrl {
  id: number
  resource_node_id: number | null
  parent_id: number | null
  tree_root: number | null
  lft: number
  lvl: number
  rgt: number
  url: string
  description: string
  active: number
  created_by: number
  tms: string | null
  url_type: boolean | null
  limit_courses: number | null
  limit_active_courses: number | null
  limit_sessions: number | null
  limit_users: number | null
  limit_teachers: number | null
  limit_disk_space: number | null
  email: string | null
  is_login_only: boolean
}

export interface AccessUrlRelColorTheme {
  id: number
  url_id: number
  color_theme_id: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface AccessUrlRelCourse {
  id: number
  c_id: number
  access_url_id: number
}

export interface AccessUrlRelCourseCategory {
  id: number
  access_url_id: number | null
  course_category_id: number | null
}

export interface AccessUrlRelPlugin {
  id: number
  plugin_id: number
  url_id: number
  active: boolean
  configuration: string | null
}

export interface AccessUrlRelSession {
  id: number
  session_id: number | null
  access_url_id: number | null
}

export interface AccessUrlRelUser {
  id: number
  user_id: number | null
  access_url_id: number | null
}

export interface AccessUrlRelUsergroup {
  id: number
  access_url_id: number | null
  usergroup_id: number | null
}

export interface Admin {
  id: number
  user_id: number | null
}

export interface AgendaReminder {
  id: number
  event_id: number
  date_interval: string
  sent: boolean
  created_at: string
  updated_at: string
}

export interface AiRequests {
  id: number
  user_id: number
  tool_name: string
  tool_item_id: number | null
  requested_at: string
  request_text: string
  prompt_tokens: number | null
  completion_tokens: number | null
  total_tokens: number | null
  ai_provider: string
  ai_model: string | null
  ai_endpoint: string | null
}

export interface AnnouncementRelGroup {
  group_id: number
  announcement_id: number
}

export interface Asset {
  id: unknown
  title: string
  category: string
  compressed: boolean
  mime_type: string | null
  original_name: string | null
  dimensions: string | null
  size: number
  crop: string | null
  metadata: string | null
  description: string | null
  updated_at: string
  created_at: string
}

export interface AttemptFeedback {
  id: unknown
  attempt_id: number | null
  user_id: number | null
  asset_id: unknown | null
  comment: string
  created_at: string
  updated_at: string
}

export interface AttemptFile {
  id: unknown
  attempt_id: number | null
  asset_id: unknown | null
  comment: string
  created_at: string
  updated_at: string
}

export interface AzureSyncState {
  id: number
  title: string
  value: string
  created_at: string
  updated_at: string
}

export interface Block {
  id: number
  user_id: number | null
  title: string | null
  description: string | null
  path: string
  controller: string
  active: boolean
}

export interface BranchSync {
  id: number
  access_url_id: number | null
  parent_id: number | null
  unique_id: string
  title: string
  description: string | null
  branch_ip: string | null
  latitude: number | null
  longitude: number | null
  dwn_speed: number | null
  up_speed: number | null
  delay: number | null
  admin_mail: string | null
  admin_name: string | null
  admin_phone: string | null
  last_sync_trans_id: number | null
  last_sync_trans_date: string | null
  last_sync_type: string | null
  ssl_pub_key: string | null
  branch_type: string | null
  lft: number | null
  rgt: number | null
  lvl: number | null
  root: number | null
}

export interface BranchTransaction {
  id: number
  status_id: number | null
  branch_id: number | null
  transaction_id: number
  action: string | null
  item_id: string | null
  origin: string | null
  dest_id: string | null
  external_info: string | null
  time_insert: string
  time_update: string
  failed_attempts: number
}

export interface BranchTransactionStatus {
  id: number
  title: string
}

export interface Career {
  id: number
  title: string
  description: string
  status: number
  created_at: string
  updated_at: string
}

export interface CatalogueCourseRelAccessUrlRelUsergroup {
  id: number
  course_id: number | null
  access_url_id: number | null
  usergroup_id: number | null
}

export interface CatalogueSessionRelAccessUrlRelUsergroup {
  id: number
  session_id: number | null
  access_url_id: number | null
  usergroup_id: number | null
}

export interface Chat {
  id: number
  from_user: number | null
  to_user: number | null
  message: string
  sent: string
  recd: number
}

export interface ChatVideo {
  id: number
  from_user: number
  to_user: number
  title: string
  datetime: string
}

export interface ColorTheme {
  id: number
  title: string
  variables: string
  slug: string
  created_at: string
  updated_at: string
}

export interface ConferenceActivity {
  id: number
  meeting_id: number | null
  participant_id: number | null
  in_at: string | null
  out_at: string | null
  close: boolean
  type: string
  event: string
  activity_data: string | null
  signature_file: string | null
  signed_at: string | null
  metrics: string | null
}

export interface ConferenceMeeting {
  id: number
  c_id: number | null
  session_id: number | null
  access_url_id: number | null
  group_id: number | null
  user_id: number | null
  calendar_id: number | null
  service_provider: string
  remote_id: string | null
  internal_meeting_id: string | null
  title: string
  attendee_pw: string | null
  moderator_pw: string | null
  record: boolean
  status: number
  welcome_msg: string | null
  visibility: number
  voice_bridge: number | null
  video_url: string | null
  has_video_m4v: boolean
  created_at: string
  closed_at: string | null
  meeting_list_item: string | null
  meeting_info_get: string | null
  sign_attendance: boolean
  reason_to_sign_attendance: string | null
  account_email: string | null
  webinar_schema: string | null
}

export interface ConferenceRecording {
  id: number
  meeting_id: number | null
  format_type: string
  resource_url: string
}

export interface ContactFormContactCategory {
  id: number
  title: string
  email: string
}

export interface Course {
  id: number
  resource_node_id: number | null
  room_id: number | null
  title: string | null
  code: string
  visual_code: string | null
  directory: string | null
  course_language: string
  description: string | null
  introduction: string | null
  visibility: number
  show_score: number | null
  tutor_name: string | null
  department_name: string | null
  department_url: string | null
  video_url: string
  sticky: boolean
  disk_quota: number | null
  last_visit: string | null
  last_edit: string | null
  creation_date: string
  expiration_date: string | null
  subscribe: boolean
  unsubscribe: boolean
  registration_code: string | null
  legal: string | null
  activate_legal: number | null
  add_teachers_to_sessions_courses: boolean | null
  course_type_id: number | null
  duration: number | null
  popularity: number
}

export interface CourseCategory {
  id: number
  parent_id: number | null
  asset_id: unknown | null
  title: string
  code: string
  tree_pos: number | null
  children_count: number | null
  auth_course_child: string | null
  auth_cat_child: string | null
  description: string | null
}

export interface CourseRelCategory {
  course_id: number
  course_category_id: number
}

export interface CourseRelClass {
  course_code: string
  class_id: number
}

export interface CourseRelUser {
  id: number
  user_id: number | null
  c_id: number | null
  relation_type: number
  status: number
  is_tutor: boolean | null
  sort: number | null
  user_course_cat: number | null
  legal_agreement: number | null
  progress: number
}

export interface CourseRelUserCatalogue {
  id: number
  user_id: number | null
  c_id: number | null
  visible: number
}

export interface CourseRequest {
  id: number
  user_id: number | null
  code: string
  course_language: string
  title: string
  description: string | null
  category_code: string | null
  tutor_name: string | null
  visual_code: string | null
  request_date: string
  objetives: string | null
  target_audience: string | null
  status: number
  info: number
  exemplary_content: number
}

export interface CourseType {
  id: number
  title: string
  translation_var: string | null
  description: string | null
  props: string | null
}

export interface CAnnouncement {
  iid: number
  resource_node_id: number | null
  title: string
  content: string | null
  end_date: string | null
  email_sent: boolean | null
}

export interface CAnnouncementAttachment {
  iid: number
  resource_node_id: number | null
  announcement_id: number | null
  path: string
  comment: string | null
  size: number
  filename: string
}

export interface CAttendance {
  iid: number
  resource_node_id: number | null
  title: string
  description: string | null
  active: number
  attendance_qualify_title: string | null
  attendance_qualify_max: number
  attendance_weight: number
  locked: number
}

export interface CAttendanceCalendar {
  iid: number
  attendance_id: number | null
  date_time: string
  done_attendance: boolean
  blocked: boolean
  duration: number | null
}

export interface CAttendanceCalendarRelGroup {
  iid: number
  group_id: number | null
  calendar_id: number | null
}

export interface CAttendanceResult {
  iid: number
  user_id: number | null
  attendance_id: number | null
  score: number
}

export interface CAttendanceResultComment {
  iid: number
  attendance_sheet_id: number
  user_id: number
  comment: string | null
  created_at: string
  updated_at: string
  author_user_id: number
}

export interface CAttendanceSheet {
  iid: number
  user_id: number | null
  attendance_calendar_id: number | null
  presence: number | null
  signature: string | null
}

export interface CAttendanceSheetLog {
  iid: number
  attendance_id: number | null
  lastedit_user_id: number | null
  lastedit_date: string
  lastedit_type: string
  calendar_date_value: string | null
}

export interface CAutogroupUserInvitation {
  id: number
  group_category_id: number
  group_id: number
  user_id: number
  confirm: boolean | null
}

export interface CBlog {
  iid: number
  resource_node_id: number | null
  title: string
  blog_subtitle: string | null
  date_creation: string
}

export interface CBlogAttachment {
  iid: number
  blog_id: number | null
  post_id: number | null
  comment_id: number | null
  path: string
  comment: string | null
  size: number
  filename: string
}

export interface CBlogComment {
  iid: number
  author_id: number | null
  blog_id: number | null
  post_id: number
  parent_comment_id: number | null
  comment_id: number
  title: string
  comment: string
  date_creation: string
}

export interface CBlogPost {
  iid: number
  author_id: number | null
  blog_id: number | null
  title: string
  full_text: string
  date_creation: string
}

export interface CBlogRating {
  iid: number
  blog_id: number | null
  user_id: number | null
  post_id: number
  rating_type: string
  rating: number
}

export interface CBlogRelUser {
  iid: number
  blog_id: number
  user_id: number
}

export interface CBlogTask {
  iid: number
  blog_id: number
  author_id: number | null
  task_id: number
  title: string
  description: string | null
  color: string
  system_task: boolean
}

export interface CBlogTaskRelUser {
  iid: number
  task_id: number
  blog_id: number
  user_id: number
  target_date: string
  status: number
}

export interface CCalendarEvent {
  iid: number
  resource_node_id: number | null
  parent_event_id: number | null
  room_id: number | null
  career_id: number | null
  promotion_id: number | null
  title: string
  content: string | null
  start_date: string | null
  end_date: string | null
  all_day: boolean
  comment: string | null
  color: string | null
  invitation_type: string | null
  collective: boolean
  subscription_visibility: number
  subscription_item_id: number | null
  max_attendees: number
}

export interface CCalendarEventAttachment {
  iid: number
  resource_node_id: number | null
  agenda_id: number | null
  comment: string | null
  filename: string
}

export interface CCalendarEventRepeat {
  iid: number
  cal_id: number | null
  cal_type: string | null
  cal_end: number | null
  cal_frequency: number | null
  cal_days: string | null
}

export interface CCalendarEventRepeatNot {
  iid: number
  cal_id: number | null
  cal_date: number
}

export interface CChatConnected {
  iid: number
  c_id: number
  session_id: number
  to_group_id: number
  user_id: number
  last_connection: string
}

export interface CChatConversation {
  id: number
  resource_node_id: number | null
  title: string | null
}

export interface CCourseDescription {
  iid: number
  resource_node_id: number | null
  title: string | null
  content: string | null
  description_type: number
  progress: number
}

export interface CCourseSetting {
  iid: number
  c_id: number
  variable: string
  subkey: string | null
  type: string | null
  category: string | null
  value: string | null
  title: string
  comment: string | null
  subkeytext: string | null
}

export interface CDocument {
  iid: number
  resource_node_id: number | null
  title: string
  comment: string | null
  filetype: string
  readonly: boolean
  template: boolean
}

export interface CDropboxCategory {
  iid: number
  c_id: number
  cat_id: number
  title: string
  received: boolean
  sent: boolean
  user_id: number
  session_id: number
}

export interface CDropboxFeedback {
  iid: number
  c_id: number
  feedback_id: number
  file_id: number
  author_user_id: number
  feedback: string
  feedback_date: string
}

export interface CDropboxFile {
  iid: number
  resource_node_id: number | null
  c_id: number
  uploader_id: number
  filename: string
  filesize: number
  title: string
  description: string | null
  author: string | null
  upload_date: string
  last_upload_date: string
  cat_id: number
  session_id: number
}

export interface CDropboxPerson {
  iid: number
  c_id: number
  file_id: number
  user_id: number
}

export interface CDropboxPost {
  iid: number
  feedback_date: string
  feedback: string | null
  cat_id: number
  session_id: number
  c_id: number
  file_id: number
  dest_user_id: number
}

export interface CForumAttachment {
  iid: number
  resource_node_id: number | null
  post_id: number | null
  c_id: number
  path: string
  comment: string | null
  size: number
  filename: string
}

export interface CForumCategory {
  iid: number
  resource_node_id: number | null
  title: string
  cat_comment: string | null
  locked: number
}

export interface CForumForum {
  iid: number
  resource_node_id: number | null
  forum_last_post: number | null
  forum_category: number | null
  lp_id: number | null
  title: string
  forum_comment: string | null
  forum_threads: number | null
  forum_posts: number | null
  allow_anonymous: number | null
  allow_edit: number | null
  approval_direct_post: string | null
  allow_attachments: number | null
  allow_new_threads: number | null
  default_view: string | null
  forum_of_group: string | null
  forum_group_public_private: string | null
  locked: number
  forum_image: string
  start_time: string | null
  end_time: string | null
  moderated: boolean | null
}

export interface CForumMailcue {
  iid: number
  c_id: number
  thread_id: number
  user_id: number
  post_id: number
}

export interface CForumNotification {
  iid: number
  c_id: number
  user_id: number
  forum_id: number
  thread_id: number
  post_id: number
}

export interface CForumPost {
  iid: number
  resource_node_id: number | null
  thread_id: number | null
  forum_id: number | null
  poster_id: number | null
  post_parent_id: number | null
  title: string
  post_text: string | null
  post_date: string
  post_notification: boolean | null
  visible: boolean
  status: number | null
}

export interface CForumThread {
  iid: number
  resource_node_id: number | null
  forum_id: number | null
  thread_poster_id: number | null
  thread_last_post: number | null
  lp_item_id: number | null
  title: string
  thread_date: string
  thread_replies: number
  thread_views: number
  thread_sticky: boolean
  locked: number
  thread_title_qualify: string | null
  thread_qualify_max: number
  thread_close_date: string | null
  thread_weight: number
  thread_peer_qualify: boolean
}

export interface CForumThreadQualify {
  iid: number
  user_id: number | null
  thread_id: number | null
  qualify_user_id: number | null
  c_id: number
  qualify: number
  qualify_time: string | null
}

export interface CForumThreadQualifyLog {
  iid: number
  c_id: number
  user_id: number
  thread_id: number
  qualify: number
  qualify_user_id: number | null
  qualify_time: string | null
  session_id: number | null
}

export interface CGlossary {
  iid: number
  resource_node_id: number | null
  title: string
  description: string
}

export interface CGroupCategory {
  iid: number
  resource_node_id: number | null
  peer_assessment: number | null
  title: string
  description: string
  doc_state: boolean
  calendar_state: boolean
  work_state: boolean
  announcements_state: boolean
  forum_state: boolean
  wiki_state: boolean
  chat_state: boolean
  max_student: number
  self_reg_allowed: boolean
  self_unreg_allowed: boolean
  groups_per_user: number
  document_access: number
  min_student: number | null
  begin_inscription_date: string | null
  end_inscription_date: string | null
  only_me: boolean
  allow_coach_change_options_groups: boolean
  allow_change_group_name: number | null
  allow_autogroup: boolean
}

export interface CGroupCategoryRelUser {
  id: number
  group_category_id: number
  population_type: number
  population_id: number
  status_in_category: number
}

export interface CGroupInfo {
  iid: number
  resource_node_id: number | null
  category_id: number | null
  title: string
  status: boolean
  description: string | null
  max_student: number
  doc_state: number
  calendar_state: number
  work_state: number
  announcements_state: number
  forum_state: number
  wiki_state: number
  chat_state: number
  self_registration_allowed: boolean
  self_unregistration_allowed: boolean
  document_access: number
}

export interface CGroupRelTutor {
  iid: number
  user_id: number
  group_id: number
  c_id: number
}

export interface CGroupRelUser {
  iid: number
  user_id: number
  group_id: number
  c_id: number
  status: number
  role: string
  ready_autogroup: boolean
}

export interface CGroupRelUsergroup {
  id: number
  group_id: number
  usergroup_id: number
  session_id: number | null
  c_id: number | null
  ready_autogroup: boolean
}

export interface CLink {
  iid: number
  resource_node_id: number | null
  category_id: number | null
  custom_image_id: unknown | null
  url: string
  title: string
  description: string | null
  target: string | null
}

export interface CLinkCategory {
  iid: number
  resource_node_id: number | null
  title: string
  description: string | null
}

export interface CLp {
  iid: number
  resource_node_id: number | null
  category_id: number | null
  asset_id: unknown | null
  lp_type: number
  title: string
  ref: string | null
  description: string | null
  path: string
  force_commit: boolean
  default_view_mod: string
  default_encoding: string
  content_maker: string
  content_local: string
  content_license: string
  prevent_reinit: boolean
  js_lib: string
  debug: boolean
  theme: string
  author: string
  prerequisite: number
  hide_toc_frame: boolean
  seriousgame_mode: boolean
  use_max_score: number
  autolaunch: number
  max_attempts: number
  subscribe_users: number
  created_on: string
  modified_on: string
  published_on: string | null
  expired_on: string | null
  accumulate_scorm_time: number
  accumulate_work_time: number
  next_lp_id: number
  subscribe_user_by_date: boolean
  display_not_allowed_lp: boolean | null
  duration: number | null
  auto_forward_video: boolean
}

export interface CLpCategory {
  iid: number
  resource_node_id: number | null
  title: string
}

export interface CLpCategoryRelUser {
  id: number
  category_id: number | null
  user_id: number | null
}

export interface CLpItem {
  iid: number
  lp_id: number | null
  item_root: number | null
  parent_item_id: number | null
  title: string
  item_type: string
  ref: string
  description: string | null
  path: string
  min_score: number
  max_score: number | null
  mastery_score: number | null
  display_order: number
  prerequisite: string | null
  parameters: string | null
  launch_data: string
  max_time_allowed: string | null
  terms: string | null
  search_did: number | null
  audio: string | null
  prerequisite_min_score: number | null
  prerequisite_max_score: number | null
  previous_item_id: number | null
  next_item_id: number | null
  lvl: number
  duration: number | null
  export_allowed: boolean
}

export interface CLpItemView {
  iid: number
  lp_item_id: number | null
  lp_view_id: number | null
  view_count: number
  start_time: number
  total_time: number
  score: number
  status: string
  suspend_data: string | null
  lesson_location: string | null
  core_exit: string
  max_score: string | null
}

export interface CLpIvInteraction {
  iid: number
  c_id: number
  order_id: number
  lp_iv_id: number
  interaction_id: string
  interaction_type: string
  weighting: number
  completion_time: string
  correct_responses: string
  student_response: string
  result: string
  latency: string
}

export interface CLpIvObjective {
  iid: number
  c_id: number
  lp_iv_id: number
  order_id: number
  objective_id: string
  score_raw: number
  score_max: number
  score_min: number
  status: string
}

export interface CLpRelUser {
  iid: number
  lp_id: number
  c_id: number
  session_id: number | null
  user_id: number
  creator_id: number | null
  group_id: number | null
  created_at: string
  start_date: string | null
  end_date: string | null
  is_open_without_date: boolean
}

export interface CLpRelUsergroup {
  id: number
  lp_id: number | null
  c_id: number
  session_id: number | null
  usergroup_id: number | null
  created_at: string
}

export interface CLpUserAccess {
  id: number
  user_id: number | null
  lp_id: number | null
  start_date: string | null
  end_date: string | null
  is_open_without_date: boolean | null
}

export interface CLpView {
  iid: number
  user_id: number | null
  lp_id: number | null
  c_id: number | null
  session_id: number | null
  view_count: number
  last_item: number
  progress: number | null
}

export interface CNotebook {
  iid: number
  resource_node_id: number | null
  user_id: number | null
  title: string
  description: string
  creation_date: string
  update_date: string
  status: number | null
}

export interface CPeerAssessment {
  id: number
  c_id: number | null
  group_category_id: number | null
  max_correction_per_student: number | null
  state: number | null
  start_work_repository_option: number | null
  end_work_repository_option: number | null
  start_correction_option: number | null
  end_correction_option: number | null
  distribute_correction_option: number
  end_repository_option: number | null
  examiner_role_condition: boolean | null
  student_access_to_correction: boolean | null
  comment_constraint: boolean | null
  correct_own_work: boolean | null
  correct_benchmark_work: boolean | null
  distribution_algorithm: boolean | null
  send_work_start_date: string | null
  send_work_end_date: string | null
  start_correction_date: string | null
  end_correction_date: string | null
  created_at: string
  updated_at: string
}

export interface CPeerAssessmentCorrection {
  id: number
  peer_assessment_id: number | null
  student_group_id: number | null
  examiner_id: number | null
  examiner_group_id: number | null
  total_score: number | null
  maximum_score: number | null
  delivered: boolean | null
  examiner_folder_id: number | null
  examiner_document_id: number | null
  completed: boolean | null
}

export interface CPeerAssessmentCorrectionCriteria {
  id: number
  peer_assessment_correction_id: number | null
  peer_assessment_criteria_id: number | null
  comment: string | null
  score: number | null
}

export interface CPeerAssessmentCriteria {
  id: number
  peer_assessment_id: number | null
  title: string | null
  description: string | null
  score: number | null
  position: number | null
}

export interface CPeerAssessmentLog {
  id: number
  peer_assessment_id: number | null
  user_id: number | null
  date: string | null
  description: string | null
}

export interface CPeerAssessmentRelStudentPublication {
  id: number
  peer_assessment_id: number | null
  student_publication_id: number | null
  group_id: number | null
  student_publication_folder_id: number | null
}

export interface CPeerAutogroupRelStudentPublication {
  id: number
  user_id: number
  student_publication_id: number | null
  group_id: number | null
  peer_autogroup_id: number | null
  vote: boolean | null
  date_vote: string | null
  student_publication_parent_id: number | null
  student_publication_folder_id: number | null
}

export interface CPlagiarismCompilatioDocs {
  id: number
  c_id: number
  document_id: number
  compilatio_id: string | null
}

export interface CQuiz {
  iid: number
  resource_node_id: number | null
  quiz_category_id: number | null
  title: string
  description: string | null
  sound: string | null
  type: number
  random: number
  random_answers: boolean
  results_disabled: number
  access_condition: string | null
  max_attempt: number
  start_time: string | null
  end_time: string | null
  feedback_type: number
  expired_time: number
  propagate_neg: number
  save_correct_answers: number | null
  review_answers: number
  random_by_category: number
  text_when_finished: string | null
  text_when_finished_failure: string | null
  display_category_name: number
  pass_percentage: number | null
  prevent_backwards: number
  question_selection_type: number | null
  hide_question_number: number
  hide_question_title: boolean
  show_previous_button: boolean
  notifications: string | null
  autolaunch: boolean | null
  hide_attempts_table: boolean
  page_result_configuration: string
  display_chart_degree_certainty: number
  send_email_chart_degree_certainty: number
  not_display_balance_percentage_categorie_question: number
  display_chart_degree_certainty_category: number
  gather_questions_categories: number
  duration: number | null
}

export interface CQuizAnswer {
  iid: number
  question_id: number | null
  answer: string
  correct: number | null
  comment: string | null
  ponderation: number
  position: number
  hotspot_coordinates: string | null
  hotspot_type: string | null
  answer_code: string | null
}

export interface CQuizCategory {
  id: number
  resource_node_id: number | null
  c_id: number
  title: string
  description: string | null
  position: number
  created_at: string
  updated_at: string
}

export interface CQuizQuestion {
  iid: number
  resource_node_id: number | null
  question: string
  description: string | null
  ponderation: number
  position: number
  type: number
  picture: string | null
  level: number
  feedback: string | null
  extra: string | null
  question_code: string | null
  mandatory: number
  duration: number | null
  parent_media_id: number | null
}

export interface CQuizQuestionCategory {
  iid: number
  resource_node_id: number | null
  title: string
  description: string | null
}

export interface CQuizQuestionOption {
  iid: number
  question_id: number | null
  title: string
  position: number
}

export interface CQuizQuestionRelCategory {
  question_id: number
  category_id: number
}

export interface CQuizRelCategory {
  iid: number
  category_id: number | null
  exercise_id: number | null
  count_questions: number
}

export interface CQuizRelQuestion {
  iid: number
  question_id: number | null
  quiz_id: number | null
  question_order: number
  destination: string | null
}

export interface CShortcut {
  id: number
  resource_node_id: number | null
  shortcut_node_id: number | null
  title: string
}

export interface CStudentPublication {
  iid: number
  resource_node_id: number | null
  parent_id: number | null
  user_id: number | null
  group_category_id: number | null
  title: string
  description: string | null
  author: string | null
  active: number | null
  accepted: boolean | null
  post_group_id: number
  sent_date: string | null
  filetype: string
  has_properties: number
  view_properties: boolean | null
  qualification: number
  date_of_qualification: string | null
  qualificator_id: number
  weight: number
  allow_text_assignment: number
  contains_file: number
  document_id: number
  filesize: number | null
  duration: number | null
  student_delete_own_publication: boolean | null
  default_visibility: boolean | null
  extensions: string | null
  group_category_work_id: number
}

export interface CStudentPublicationAssignment {
  iid: number
  publication_id: number | null
  expires_on: string | null
  ends_on: string | null
  add_to_calendar: number
  enable_qualification: boolean
}

export interface CStudentPublicationComment {
  iid: number
  resource_node_id: number | null
  work_id: number | null
  user_id: number | null
  comment: string | null
  file: string | null
  sent_at: string
}

export interface CStudentPublicationCorrection {
  id: number
  resource_node_id: number | null
  title: string
}

export interface CStudentPublicationRelDocument {
  iid: number
  work_id: number | null
  document_id: number | null
}

export interface CStudentPublicationRelUser {
  iid: number
  work_id: number | null
  user_id: number | null
}

export interface CSurvey {
  iid: number
  resource_node_id: number | null
  parent_id: number | null
  code: string | null
  title: string
  subtitle: string | null
  lang: string | null
  avail_from: string | null
  avail_till: string | null
  is_shared: string | null
  template: string | null
  intro: string | null
  surveythanks: string | null
  creation_date: string
  invited: number
  answered: number
  invite_mail: string
  reminder_mail: string
  mail_subject: string
  anonymous: string
  access_condition: string | null
  shuffle: boolean
  one_question_per_page: boolean
  survey_version: string
  lft: number | null
  rgt: number | null
  lvl: number | null
  survey_type: number
  show_form_profile: number
  form_fields: string
  visible_results: number | null
  is_mandatory: boolean
  display_question_number: boolean
  duration: number | null
}

export interface CSurveyAnswer {
  iid: number
  survey_id: number | null
  question_id: number | null
  option_id: string
  value: number
  user: string
  session_id: number | null
  c_lp_item_id: number
}

export interface CSurveyInvitation {
  iid: number
  c_id: number | null
  session_id: number | null
  group_id: number | null
  survey_id: number | null
  user_id: number | null
  invitation_code: string
  answered: number
  invitation_date: string
  reminder_date: string | null
  answered_at: string | null
  c_lp_item_id: number
}

export interface CSurveyQuestion {
  iid: number
  parent_id: number | null
  parent_option_id: number | null
  survey_id: number | null
  survey_question: string
  survey_question_comment: string
  type: string
  display: string
  sort: number
  shared_question_id: number | null
  max_value: number | null
  survey_group_pri: number
  survey_group_sec1: number
  survey_group_sec2: number
  is_required: boolean
}

export interface CSurveyQuestionOption {
  iid: number
  question_id: number | null
  survey_id: number | null
  option_text: string
  sort: number
  value: number
}

export interface CThematic {
  iid: number
  resource_node_id: number | null
  title: string
  content: string | null
  active: boolean
}

export interface CThematicAdvance {
  iid: number
  thematic_id: number | null
  attendance_id: number | null
  room_id: number | null
  content: string | null
  start_date: string
  duration: number
  done_advance: boolean
}

export interface CThematicPlan {
  iid: number
  thematic_id: number | null
  title: string
  description: string | null
  description_type: number
}

export interface CTool {
  iid: number
  resource_node_id: number | null
  c_id: number
  session_id: number | null
  tool_id: number
  title: string
  visibility: boolean | null
  position: number
}

export interface CToolIntro {
  iid: number
  resource_node_id: number | null
  c_tool_id: number
  intro_text: string
}

export interface CWiki {
  iid: number
  resource_node_id: number | null
  c_id: number
  page_id: number | null
  reflink: string
  title: string
  content: string
  user_id: number
  group_id: number | null
  dtime: string | null
  addlock: number
  editlock: number
  visibility: number
  addlock_disc: number
  visibility_disc: number
  ratinglock_disc: number
  assignment: number
  comment: string
  progress: string
  score: number | null
  version: number | null
  is_editing: number
  time_edit: string | null
  hits: number | null
  linksto: string
  tag: string
  user_ip: string
  session_id: number | null
}

export interface CWikiCategory {
  id: number
  c_id: number
  session_id: number | null
  tree_root: number | null
  parent_id: number | null
  title: string
  lft: number
  lvl: number
  rgt: number
}

export interface CWikiConf {
  iid: number
  c_id: number
  page_id: number
  task: string
  feedback1: string
  feedback2: string
  feedback3: string
  fprogress1: string
  fprogress2: string
  fprogress3: string
  max_size: number | null
  max_text: number | null
  max_version: number | null
  startdate_assig: string | null
  enddate_assig: string | null
  delayedsubmit: number
}

export interface CWikiDiscuss {
  iid: number
  c_id: number
  publication_id: number
  userc_id: number
  comment: string
  p_score: string | null
  dtime: string
}

export interface CWikiMailcue {
  iid: number
  c_id: number
  type: string
  group_id: number | null
  session_id: number | null
  user_id: number
}

export interface CWikiRelCategory {
  wiki_id: number
  category_id: number
}

export interface ExtraField {
  id: number
  item_type: number
  value_type: number
  variable: string
  description: string | null
  display_text: string | null
  helper_text: string | null
  default_value: string | null
  field_order: number | null
  visible_to_self: boolean
  visible_to_others: boolean
  changeable: boolean
  filter: boolean
  created_at: string
  auto_remove: boolean
}

export interface ExtraFieldOptions {
  id: number
  field_id: number | null
  option_value: string | null
  display_text: string | null
  priority: string | null
  priority_message: string | null
  option_order: number | null
}

export interface ExtraFieldOptionRelFieldOption {
  id: number
  field_option_id: number | null
  related_field_option_id: number | null
  field_id: number | null
  role_id: number | null
}

export interface ExtraFieldRelTag {
  id: number
  field_id: number | null
  tag_id: number | null
  item_id: number
}

export interface ExtraFieldSavedSearch {
  id: number
  field_id: number | null
  user_id: number | null
  value: string | null
  created_at: string
  updated_at: string
}

export interface ExtraFieldValues {
  id: number
  field_id: number | null
  asset_id: unknown | null
  field_value: string | null
  item_id: number
  comment: string | null
  created_at: string
  updated_at: string
}

export interface ExtLogEntries {
  id: number
  action: string
  logged_at: string
  object_id: string | null
  object_class: string
  version: number
  data: string | null
  username: string | null
}

export interface ExtTranslations {
  id: number
  locale: string
  object_class: string
  field: string
  foreign_key: string
  content: string | null
}

export interface FosGroup {
  id: number
  code: string
  title: string
  roles: string
}

export interface FosUserUserGroup {
  user_id: number
  group_id: number
}

export interface GradebookCategory {
  id: number
  user_id: number | null
  c_id: number | null
  parent_id: number | null
  session_id: number | null
  grade_model_id: number | null
  document_id: number | null
  title: string
  description: string | null
  weight: number
  visible: boolean
  certif_min_score: number | null
  locked: number
  default_lowest_eval_exclude: boolean | null
  generate_certificates: boolean
  certificate_validity_period: number | null
  is_requirement: boolean
  depends: string | null
  minimum_to_validate: number | null
  gradebooks_to_validate_in_dependence: number | null
  allow_skills_by_subcategory: number | null
}

export interface GradebookCertificate {
  id: number
  resource_node_id: number | null
  cat_id: number | null
  user_id: number | null
  score_certificate: number
  created_at: string
  path_certificate: string | null
  downloaded_at: string | null
  publish: boolean
}

export interface GradebookComment {
  id: number
  user_id: number | null
  gradebook_id: number | null
  comment: string
  created_at: string
  updated_at: string
}

export interface GradebookEvaluation {
  id: number
  c_id: number | null
  category_id: number | null
  title: string
  description: string | null
  created_at: string
  weight: number
  max: number
  visible: number
  type: string
  locked: number
  best_score: number | null
  average_score: number | null
  score_weight: number | null
  user_score_list: string | null
  min_score: number | null
}

export interface GradebookLink {
  id: number
  c_id: number | null
  category_id: number | null
  type: number
  ref_id: number
  created_at: string
  weight: number
  visible: number
  locked: number
  best_score: number | null
  average_score: number | null
  score_weight: number | null
  user_score_list: string | null
  min_score: number | null
}

export interface GradebookLinkevalLog {
  id: number
  user_id_log: number | null
  id_linkeval_log: number
  title: string
  description: string | null
  weight: number | null
  visible: boolean | null
  type: string
  created_at: string
}

export interface GradebookResult {
  id: number
  evaluation_id: number | null
  user_id: number | null
  score: number | null
  created_at: string
}

export interface GradebookResultAttempt {
  id: number
  result_id: number | null
  comment: string | null
  score: number | null
  created_at: string
  updated_at: string
}

export interface GradebookResultLog {
  id: number
  result_id: number | null
  evaluation_id: number | null
  user_id: number | null
  created_at: string
  score: number | null
}

export interface GradebookScoreDisplay {
  id: number
  category_id: number | null
  score: number
  display: string
  score_color_percent: number
}

export interface GradebookScoreLog {
  id: number
  category_id: number | null
  user_id: number | null
  score: number
  registered_at: string
}

export interface GradeComponents {
  id: number
  grade_model_id: number | null
  percentage: string
  title: string
  acronym: string
}

export interface GradeModel {
  id: number
  title: string
  description: string | null
  default_lowest_eval_exclude: boolean | null
  default_external_eval: boolean | null
  default_external_eval_prefix: string | null
}

export interface Illustration {
  id: unknown
  resource_node_id: number | null
  title: string
  created_at: string
  updated_at: string
}

export interface JustificationDocument {
  id: number
  code: string | null
  name: string | null
  validity_duration: number | null
  comment: string | null
  date_manual_on: number | null
}

export interface JustificationDocumentRelUsers {
  id: number
  justification_document_id: number | null
  user_id: number | null
  file_path: string | null
  date_validity: string | null
}

export interface Language {
  id: number
  parent_id: number | null
  original_name: string | null
  english_name: string
  isocode: string
  available: boolean
}

export interface Legal {
  id: number
  date: number
  content: string | null
  type: number
  changes: string
  version: number | null
  language_id: number
}

export interface LtiExternalTool {
  id: number
  resource_node_id: number | null
  gradebook_eval_id: number | null
  title: string
  description: string | null
  public_key: string | null
  launch_url: string
  consumer_key: string | null
  shared_secret: string | null
  custom_params: string | null
  active_deep_linking: boolean
  privacy: string | null
  client_id: string | null
  login_url: string | null
  redirect_url: string | null
  jwks_url: string | null
  advantage_services: string | null
  version: string
  launch_presentation: string
  replacement_params: string
}

export interface LtiLineitem {
  id: number
  tool_id: number
  evaluation: number
  resource_id: string | null
  tag: string | null
  start_date: string | null
  end_date: string | null
}

export interface LtiPlatform {
  id: number
  public_key: string
  kid: string
  private_key: string
}

export interface LtiToken {
  id: number
  tool_id: number | null
  scope: string
  hash: string
  created_at: number
  expires_at: number
}

export interface MailTemplate {
  id: number
  author_id: number | null
  url_id: number
  title: string
  template: string | null
  type: string
  default_template: boolean
  system: number
  created_at: string
  updated_at: string
}

export interface Message {
  id: number
  user_sender_id: number | null
  group_id: number | null
  parent_id: number | null
  msg_type: number
  status: number
  send_date: string
  title: string
  content: string
  update_date: string | null
  votes: number | null
}

export interface MessageAttachment {
  id: number
  resource_node_id: number | null
  message_id: number
  path: string
  comment: string | null
  size: number
  filename: string
}

export interface MessageRelUser {
  id: number
  message_id: number
  user_id: number
  msg_read: boolean
  receiver_type: number
  starred: boolean
  deleted_at: string | null
}

export interface MessageRelUserRelTags {
  message_rel_user_id: number
  message_tag_id: number
}

export interface MessageTag {
  id: number
  user_id: number
  tag: string
  color: string
  position: number
  created_at: string
  updated_at: string
}

export interface Notification {
  id: number
  dest_user_id: number
  dest_mail: string | null
  title: string | null
  content: string | null
  send_freq: number | null
  created_at: string
  sent_at: string | null
}

export interface NotificationEvent {
  id: number
  title: string
  content: string | null
  link: string | null
  persistent: number | null
  day_diff: number | null
  event_type: string
  event_id: number | null
}

export interface NotificationEventRelUser {
  id: number
  event_id: number
  user_id: number
}

export interface Page {
  id: number
  access_url_id: number | null
  creator_id: number | null
  category_id: number | null
  title: string
  content: string
  slug: string
  enabled: boolean
  position: number
  locale: string
  created_at: string
  updated_at: string
}

export interface PageCategory {
  id: number
  creator_id: number | null
  title: string
  type: string
  created_at: string
  updated_at: string
}

export interface PageLayout {
  id: number
  page_layout_template_id: number | null
  created_by: number | null
  updated_by: number | null
  url: string
  roles: string | null
  layout: string
  created_at: string | null
  updated_at: string | null
}

export interface PageLayoutTemplate {
  id: number
  name: string | null
  layout: string
}

export interface Permission {
  id: number
  title: string
  slug: string
  description: string | null
}

export interface PermissionRelRole {
  id: number
  permission_id: number
  role_id: number
  changeable: boolean
  updated_at: string
}

export interface PersonalFile {
  id: number
  resource_node_id: number | null
  title: string
  comment: string | null
  created_at: string
  updated_at: string
}

export interface Plugin {
  id: number
  title: string
  installed: boolean
  installed_version: string
  source: string
}

export interface Portfolio {
  id: number
  resource_node_id: number | null
  category_id: number | null
  duplicated_from: number | null
  title: string
  content: string
  visibility: number
  origin: number | null
  origin_type: number | null
  score: number | null
  is_highlighted: boolean
  is_template: boolean
}

export interface PortfolioCategory {
  id: number
  user_id: number
  parent_id: number | null
  title: string
  description: string | null
  is_visible: boolean
}

export interface PortfolioComment {
  id: number
  resource_node_id: number | null
  item_id: number
  visibility: number
  content: string
  date: string
  is_important: boolean
  score: number | null
  is_template: boolean
}

export interface PortfolioRelTag {
  id: number
  tag_id: number
  c_id: number
  session_id: number | null
}

export interface Promotion {
  id: number
  career_id: number | null
  title: string
  description: string
  status: number
  created_at: string
  updated_at: string
}

export interface PushSubscription {
  id: number
  user_id: number | null
  endpoint: string
  public_key: string
  auth_token: string
  content_encoding: string | null
  user_agent: string | null
  created_at: string
  updated_at: string
}

export interface ResetPasswordRequest {
  id: number
  user_id: number | null
  selector: string
  hashed_token: string
  requested_at: string
  expires_at: string
}

export interface ResourceComment {
  id: number
  resource_node_id: number | null
  author_id: number | null
  parent_id: number | null
  content: string
  created_at: string
  updated_at: string
  root: number | null
  lvl: number
  lft: number
  rgt: number
}

export interface ResourceFile {
  id: number
  access_url_id: number | null
  resource_node_id: number | null
  title: string
  mime_type: string | null
  original_name: string | null
  dimensions: string | null
  size: number
  crop: string | null
  metadata: string | null
  description: string | null
  updated_at: string
  created_at: string
}

export interface ResourceFormat {
  id: number
  title: string
  created_at: string
  updated_at: string
}

export interface ResourceLink {
  id: number
  resource_node_id: number | null
  c_id: number | null
  session_id: number | null
  usergroup_id: number | null
  group_id: number | null
  user_id: number | null
  visibility: number
  start_visibility_at: string | null
  end_visibility_at: string | null
  display_order: number
  resource_type_group: number
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface ResourceNode {
  id: number
  resource_type_id: number
  resource_format_id: number | null
  creator_id: number | null
  parent_id: number | null
  title: string
  slug: string
  level: number | null
  path: string | null
  created_at: string
  updated_at: string
  public: boolean
  uuid: unknown
}

export interface ResourceRight {
  id: number
  resource_link_id: number | null
  role: string
  mask: number
}

export interface ResourceTag {
  id: number
  author_id: number | null
  title: string
  created_at: string
  updated_at: string
}

export interface ResourceType {
  id: number
  tool_id: number | null
  title: string
  created_at: string
  updated_at: string
}

export interface ResourceUserTag {
  id: number
  user_id: number | null
  tag_id: number | null
  created_at: string
  updated_at: string
}

export interface Role {
  id: number
  code: string
  constant_value: number
  title: string
  description: string | null
  system_role: boolean
  created_at: string | null
  created_by: number | null
  updated_at: string | null
  updated_by: number | null
}

export interface Room {
  id: number
  branch_id: number | null
  title: string
  description: string | null
  geolocation: string | null
  ip: string | null
  ip_mask: string | null
}

export interface ScheduledAnnouncements {
  id: number
  subject: string
  message: string
  date: string | null
  sent: boolean
  session_id: number
  c_id: number | null
}

export interface SearchEngineRef {
  id: number
  c_id: number | null
  tool_id: string
  ref_id_high_level: number
  ref_id_second_level: number | null
  search_did: number
}

export interface Sequence {
  id: number
  title: string
  graph: string | null
  created_at: string
  updated_at: string
}

export interface SequenceCondition {
  id: number
  description: string
  mat_op: string
  param: number
  act_true: number
  act_false: string
}

export interface SequenceFormula {
  id: number
  sequence_method_id: number | null
  sequence_variable_id: number | null
}

export interface SequenceMethod {
  id: number
  description: string
  formula: string
  assign: number
  met_type: string
  act_false: string
}

export interface SequenceResource {
  id: number
  sequence_id: number | null
  type: number
  resource_id: number
}

export interface SequenceRowEntity {
  id: number
  sequence_type_entity_id: number | null
  c_id: number
  session_id: number
  row_id: number
  title: string
}

export interface SequenceRule {
  id: number
  description: string
}

export interface SequenceRuleCondition {
  id: number
  sequence_rule_id: number | null
  sequence_condition_id: number | null
}

export interface SequenceRuleMethod {
  id: number
  sequence_rule_id: number | null
  sequence_method_id: number | null
  method_order: number
}

export interface SequenceTypeEntity {
  id: number
  title: string
  description: string
  ent_table: string
}

export interface SequenceValid {
  id: number
  sequence_variable_id: number | null
  sequence_condition_id: number | null
}

export interface SequenceValue {
  id: number
  user_id: number | null
  sequence_row_entity_id: number | null
  advance: number
  complete_items: number
  total_items: number
  success: boolean
  success_date: string | null
  available: boolean
  available_start_date: string | null
  available_end_date: string | null
}

export interface SequenceVariable {
  id: number
  title: string | null
  description: string | null
  default_val: string | null
}

export interface Session {
  id: number
  promotion_id: number | null
  session_category_id: number | null
  image_id: unknown | null
  title: string
  description: string | null
  show_description: boolean | null
  duration: number | null
  nbr_courses: number
  nbr_users: number
  nbr_classes: number
  visibility: number
  display_start_date: string | null
  display_end_date: string | null
  access_start_date: string | null
  access_end_date: string | null
  coach_access_start_date: string | null
  coach_access_end_date: string | null
  position: number
  status: number
  send_subscription_notification: boolean
  parent_id: number | null
  days_to_reinscription: number | null
  last_repetition: boolean
  days_to_new_repetition: number | null
  notify_boss: boolean
  validity_in_days: number | null
}

export interface SessionCategory {
  id: number
  access_url_id: number | null
  title: string
  date_start: string | null
  date_end: string | null
}

export interface SessionRelCourse {
  id: number
  session_id: number
  c_id: number
  position: number
  nbr_users: number
}

export interface SessionRelCourseRelUser {
  id: number
  user_id: number
  session_id: number
  c_id: number
  status: number
  visibility: number
  legal_agreement: number
  progress: number
}

export interface SessionRelUser {
  id: number
  session_id: number | null
  user_id: number | null
  relation_type: number
  duration: number
  moved_to: number | null
  moved_status: number | null
  moved_at: string | null
  registered_at: string
  collapsed: boolean | null
  new_subscription_session_id: number | null
  access_start_date: string | null
  access_end_date: string | null
}

export interface Settings {
  id: number
  access_url: number | null
  value_template_id: number | null
  variable: string
  subkey: string | null
  type: string | null
  category: string | null
  selected_value: string | null
  title: string
  comment: string | null
  scope: string | null
  subkeytext: string | null
  access_url_changeable: number
  access_url_locked: number
}

export interface SettingsOptions {
  id: number
  variable: string
  value: string | null
  display_text: string
}

export interface SettingsValueTemplate {
  id: number
  variable: string
  description: string | null
  json_example: string | null
  created_at: string | null
  updated_at: string | null
}

export interface Skill {
  id: number
  profile_id: number | null
  asset_id: unknown | null
  title: string
  short_code: string
  description: string
  access_url_id: number
  icon: string
  criteria: string | null
  status: number
  updated_at: string
}

export interface SkillLevel {
  id: number
  profile_id: number | null
  title: string
  position: number
  short_title: string
}

export interface SkillLevelProfile {
  id: number
  title: string
}

export interface SkillProfile {
  id: number
  title: string
  description: string
}

export interface SkillRelCourse {
  id: number
  skill_id: number | null
  c_id: number
  session_id: number
  created_at: string
  updated_at: string
}

export interface SkillRelGradebook {
  id: number
  skill_id: number | null
  gradebook_id: number | null
  type: string
}

export interface SkillRelItem {
  id: number
  skill_id: number | null
  item_type: number
  item_id: number
  obtain_conditions: string | null
  requires_validation: boolean
  is_real: boolean
  c_id: number | null
  session_id: number | null
  created_by: number
  updated_by: number
  created_at: string
  updated_at: string
}

export interface SkillRelItemRelUser {
  id: number
  skill_rel_item_id: number
  user_id: number
  result_id: number | null
  created_by: number
  updated_by: number
  created_at: string
  updated_at: string
}

export interface SkillRelProfile {
  id: number
  skill_id: number | null
  profile_id: number | null
}

export interface SkillRelSkill {
  id: number
  skill_id: number | null
  parent_id: number | null
  relation_type: number
  level: number
}

export interface SkillRelUser {
  id: number
  user_id: number
  skill_id: number
  course_id: number | null
  session_id: number | null
  acquired_level: number | null
  acquired_skill_at: string
  validation_status: number
  argumentation: string
  argumentation_author_id: number
}

export interface SkillRelUserComment {
  id: number
  skill_rel_user_id: number | null
  feedback_giver_id: number | null
  feedback_text: string
  feedback_value: number | null
  feedback_datetime: string
}

export interface SocialPost {
  id: number
  sender_id: number
  user_receiver_id: number | null
  group_receiver_id: number | null
  parent_id: number | null
  subject: string | null
  content: string
  type: number
  status: number
  send_date: string
  updated_at: string
}

export interface SocialPostAttachments {
  id: number
  resource_node_id: number | null
  social_post_id: number | null
  path: string
  filename: string
  size: number
  sys_insert_user_id: number
  sys_insert_datetime: string
  sys_lastedit_user_id: number | null
  sys_lastedit_datetime: string | null
}

export interface SocialPostFeedback {
  id: number
  social_post_id: number
  user_id: number
  liked: boolean
  disliked: boolean
  updated_at: string
}

export interface SpecificField {
  id: number
  code: string
  title: string
}

export interface SpecificFieldValues {
  id: number
  course_code: string
  tool_id: string
  ref_id: number
  field_id: number
  value: string
}

export interface SystemTemplate {
  id: number
  image_id: unknown | null
  title: string
  comment: string
  content: string
  language: string | null
}

export interface SysAnnouncement {
  id: number
  access_url_id: number | null
  career_id: number | null
  promotion_id: number | null
  date_start: string
  date_end: string
  title: string
  content: string
  lang: string | null
  roles: string
}

export interface Tag {
  id: number
  field_id: number | null
  tag: string
  count: number
}

export interface Templates {
  id: number
  c_id: number | null
  user_id: number | null
  image_id: unknown | null
  title: string
  description: string
  ref_doc: number
}

export interface ThirdParty {
  id: number
  title: string
  description: string | null
  address: string | null
  website: string | null
  data_exchange_party: boolean
  recruiter: boolean
}

export interface ThirdPartyDataExchange {
  id: number
  third_party_id: number | null
  sent_at: string
  description: string | null
  all_users: boolean
}

export interface ThirdPartyDataExchangeUser {
  id: number
  third_party_data_exchange_id: number | null
  user_id: number | null
}

export interface TicketAssignedLog {
  id: number
  ticket_id: number | null
  user_id: number | null
  sys_insert_user_id: number
  assigned_date: string
}

export interface TicketCategory {
  id: number
  project_id: number | null
  title: string
  description: string | null
  total_tickets: number
  course_required: boolean
  sys_insert_user_id: number
  sys_insert_datetime: string
  sys_lastedit_user_id: number | null
  sys_lastedit_datetime: string | null
}

export interface TicketCategoryRelUser {
  id: number
  category_id: number | null
  user_id: number | null
}

export interface TicketMessage {
  id: number
  ticket_id: number | null
  subject: string
  message: string | null
  status: string
  ip_address: string
  sys_insert_user_id: number
  sys_lastedit_user_id: number | null
  sys_insert_datetime: string
  sys_lastedit_datetime: string | null
}

export interface TicketMessageAttachments {
  id: number
  resource_node_id: number | null
  ticket_id: number | null
  message_id: number | null
  path: string
  filename: string
  size: number
  sys_insert_user_id: number
  sys_insert_datetime: string
  sys_lastedit_user_id: number | null
  sys_lastedit_datetime: string | null
}

export interface TicketPriority {
  id: number
  access_url_id: number | null
  title: string
  code: string
  description: string | null
  color: string
  urgency: string
  sys_insert_user_id: number
  sys_insert_datetime: string
  sys_lastedit_user_id: number | null
  sys_lastedit_datetime: string | null
}

export interface TicketProject {
  id: number
  access_url_id: number | null
  title: string
  description: string | null
  email: string | null
  other_area: number | null
  sys_insert_user_id: number
  sys_insert_datetime: string
  sys_lastedit_user_id: number | null
  sys_lastedit_datetime: string | null
}

export interface TicketRelUser {
  user_id: number
  ticket_id: number
  notify: boolean
}

export interface TicketStatus {
  id: number
  access_url_id: number | null
  code: string
  title: string
  description: string | null
}

export interface TicketTicket {
  id: number
  project_id: number | null
  category_id: number | null
  priority_id: number | null
  course_id: number | null
  session_id: number | null
  assigned_last_user: number | null
  status_id: number | null
  access_url_id: number | null
  code: string
  subject: string
  message: string | null
  personal_email: string
  total_messages: number
  keyword: string | null
  source: string | null
  start_date: string | null
  end_date: string | null
  sys_insert_user_id: number
  sys_insert_datetime: string
  sys_lastedit_user_id: number | null
  sys_lastedit_datetime: string | null
  exercise_id: number | null
  lp_id: number | null
}

export interface Tool {
  id: number
  title: string
}

export interface ToolResourceRight {
  id: number
  tool_id: number | null
  role: string
  mask: number
}

export interface TrackEAccess {
  access_id: number
  access_user_id: number | null
  access_date: string
  c_id: number
  access_tool: string | null
  session_id: number
  user_ip: string
}

export interface TrackEAccessComplete {
  id: number
  user_id: number
  date_reg: string
  tool: string
  tool_id: number
  tool_id_detail: number
  action: string
  action_details: string
  current_id: number
  ip_user: string
  user_agent: string
  session_id: number
  c_id: number
  ch_sid: string
  login_as: number
  info: string
  url: string
}

export interface TrackEAttempt {
  id: number
  exe_id: number
  user_id: number | null
  question_id: number
  answer: string
  teacher_comment: string
  marks: number
  position: number | null
  tms: string
  filename: string | null
  seconds_spent: number
}

export interface TrackEAttemptCoeff {
  id: number
  attempt_id: number
  marks_coeff: number | null
}

export interface TrackEAttemptQualify {
  id: number
  exe_id: number
  question_id: number
  marks: number
  insert_date: string
  author: number
  teacher_comment: string
  session_id: number
  answer: string | null
}

export interface TrackECourseAccess {
  course_access_id: number
  user_id: number | null
  c_id: number
  login_course_date: string
  logout_course_date: string | null
  counter: number
  session_id: number
  user_ip: string
}

export interface TrackEDefault {
  default_id: number
  default_user_id: number
  c_id: number | null
  default_date: string
  default_event_type: string
  default_value_type: string
  default_value: string
  session_id: number | null
}

export interface TrackEDownloads {
  down_id: number
  resource_link_id: number | null
  down_user_id: number | null
  down_date: string
  down_doc_path: string | null
}

export interface TrackEExercises {
  exe_id: number
  exe_user_id: number
  c_id: number
  session_id: number | null
  exe_exo_id: number | null
  exe_date: string
  score: number
  max_score: number
  user_ip: string
  status: string
  data_tracking: string
  start_date: string
  steps_counter: number
  orig_lp_id: number
  orig_lp_item_id: number
  exe_duration: number
  expired_time_control: string | null
  orig_lp_item_view_id: number
  questions_to_check: string
  blocked_categories: string | null
}

export interface TrackEExerciseConfirmation {
  id: number
  user_id: number | null
  course_id: number
  attempt_id: number
  quiz_id: number
  session_id: number
  confirmed: boolean
  questions_count: number
  saved_answers_count: number
  created_at: string
  updated_at: string
}

export interface TrackEHotpotatoes {
  id: number
  title: string
  exe_user_id: number | null
  exe_date: string
  c_id: number
  score: number
  max_score: number
}

export interface TrackEHotspot {
  hotspot_id: number
  c_id: number | null
  hotspot_user_id: number
  hotspot_exe_id: number
  hotspot_question_id: number
  hotspot_answer_id: number
  hotspot_correct: boolean
  hotspot_coordinate: string
}

export interface TrackELastaccess {
  access_id: number
  access_user_id: number | null
  access_date: string
  c_id: number
  access_tool: string | null
  session_id: number | null
}

export interface TrackELinks {
  links_id: number
  links_user_id: number | null
  links_date: string
  c_id: number
  links_link_id: number
  session_id: number
}

export interface TrackELogin {
  login_id: number
  login_user_id: number | null
  login_date: string
  user_ip: string
  logout_date: string | null
}

export interface TrackELoginRecord {
  id: number
  username: string
  login_date: string
  user_ip: string
  success: boolean
}

export interface TrackEOnline {
  login_id: number
  login_user_id: number
  login_date: string
  user_ip: string
  c_id: number
  session_id: number
  access_url_id: number
}

export interface TrackEUploads {
  upload_id: number
  upload_user_id: number | null
  upload_date: string
  c_id: number | null
  upload_work_id: number
  session_id: number
}

export interface User {
  id: number
  resource_node_id: number | null
  username: string
  api_token: string | null
  firstname: string | null
  lastname: string | null
  website: string | null
  biography: string | null
  locale: string
  password: string
  username_canonical: string
  timezone: string
  email_canonical: string
  email: string
  locked: boolean
  expired: boolean
  credentials_expired: boolean
  credentials_expire_at: string | null
  date_of_birth: string | null
  expires_at: string | null
  phone: string | null
  address: string | null
  salt: string
  gender: string | null
  last_login: string | null
  confirmation_token: string | null
  password_requested_at: string | null
  roles: string
  profile_completed: boolean | null
  status: number
  official_code: string | null
  picture_uri: string | null
  creator_id: number | null
  competences: string | null
  diplomas: string | null
  openarea: string | null
  teach: string | null
  productions: string | null
  expiration_date: string | null
  active: number
  openid: string | null
  theme: string | null
  hr_dept_id: number | null
  uuid: unknown
  mfa_enabled: boolean
  mfa_service: string | null
  mfa_secret: string | null
  mfa_backup_codes: string | null
  mfa_last_used: string | null
  password_updated_at: string | null
  created_at: string
  updated_at: string
}

export interface Usergroup {
  id: number
  resource_node_id: number | null
  title: string
  description: string | null
  group_type: number
  picture: string | null
  url: string | null
  visibility: string
  author_id: number | null
  allow_members_leave_group: number
  created_at: string
  updated_at: string
}

export interface UsergroupRelCourse {
  id: number
  usergroup_id: number | null
  course_id: number | null
}

export interface UsergroupRelQuestion {
  id: number
  question_id: number | null
  usergroup_id: number | null
  coefficient: number | null
}

export interface UsergroupRelSession {
  id: number
  usergroup_id: number | null
  session_id: number | null
}

export interface UsergroupRelUser {
  id: number
  user_id: number | null
  usergroup_id: number | null
  relation_type: number
}

export interface UsergroupRelUsergroup {
  id: number
  group_id: number
  subgroup_id: number
  relation_type: number
}

export interface UserApiKey {
  id: number
  user_id: number
  api_key: string
  api_service: string
  api_end_point: string | null
  created_date: string | null
  validity_start_date: string | null
  validity_end_date: string | null
  description: string | null
}

export interface UserAuthSource {
  id: number
  url_id: number
  user_id: number
  authentication: string
}

export interface UserCareer {
  id: number
  user_id: number
  career_id: number
  extra_data: string | null
  created_at: string
  updated_at: string
}

export interface UserCourseCategory {
  id: number
  user_id: number | null
  title: string
  sort: number | null
  collapsed: boolean | null
}

export interface UserFriendRelationType {
  id: number
  title: string
}

export interface UserRelCourseVote {
  id: number
  user_id: number | null
  c_id: number | null
  session_id: number | null
  url_id: number | null
  vote: number
}

export interface UserRelTag {
  id: number
  user_id: number | null
  tag_id: number | null
}

export interface UserRelUser {
  id: number
  user_id: number
  friend_user_id: number
  relation_type: number
  created_at: string
  updated_at: string
}

export interface ValidationToken {
  id: number
  type: number
  resource_id: number
  hash: string
  created_at: string
}

export interface XapiActivityProfile {
  id: number
  profile_id: string
  activity_id: string
  document_data: string
}

export interface XapiActivityState {
  id: number
  state_id: string
  activity_id: string
  agent: string
  document_data: string
}

export interface XapiActor {
  identifier: number
  type: string | null
  mbox: string | null
  mbox_sha1_sum: string | null
  open_id: string | null
  account_name: string | null
  account_home_page: string | null
  name: string | null
}

export interface XapiAttachment {
  identifier: number
  statement_id: string | null
  usage_type: string
  content_type: number
  length: number
  sha2: string
  display: string
  has_description: boolean
  description: string | null
  file_url: string | null
  content: string | null
}

export interface XapiCmi5Item {
  id: number
  root_id: number | null
  parent_id: number | null
  tool_id: number | null
  identifier: string
  type: string
  title: string
  description: string
  url: string | null
  activity_type: string | null
  launch_method: string | null
  move_on: string | null
  mastery_score: number | null
  launch_parameters: string | null
  entitlement_key: string | null
  status: string | null
  lft: number
  lvl: number
  rgt: number
}

export interface XapiContext {
  identifier: number
  instructor_id: number | null
  team_id: number | null
  extensions_id: number | null
  registration: string | null
  has_context_activities: boolean | null
  revision: string | null
  platform: string | null
  language: string | null
  statement: string | null
}

export interface XapiExtensions {
  identifier: number
  extensions: string
}

export interface XapiInternalLog {
  id: number
  user_id: number | null
  statement_id: string
  verb: string
  object_id: string
  activity_name: string | null
  activity_description: string
  score_scaled: number | null
  score_raw: number | null
  score_min: number | null
  score_max: number | null
  created_at: string
  updated_at: string
}

export interface XapiLrsAuth {
  id: number
  username: string
  password: string
  enabled: boolean
  created_at: string
  updated_at: string
}

export interface XapiObject {
  identifier: number
  actor_id: number | null
  verb_id: number | null
  object_id: number | null
  activity_extensions_id: number | null
  group_id: number | null
  parent_context_id: number | null
  grouping_context_id: number | null
  category_context_id: number | null
  other_context_id: number | null
  type: string | null
  activity_id: string | null
  has_activity_definition: boolean | null
  has_activity_name: boolean | null
  activity_name: string | null
  has_activity_description: boolean | null
  activity_description: string | null
  activity_type: string | null
  activity_more_info: string | null
  mbox: string | null
  mbox_sha1_sum: string | null
  open_id: string | null
  account_name: string | null
  account_home_page: string | null
  name: string | null
  referenced_statement_id: string | null
}

export interface XapiResult {
  identifier: number
  extensions_id: number | null
  has_score: boolean
  scaled: number | null
  raw: number | null
  min: number | null
  max: number | null
  success: boolean | null
  completion: boolean | null
  response: string | null
  duration: string | null
}

export interface XapiSharedStatement {
  id: number
  uuid: unknown | null
  statement: string
  sent: boolean
}

export interface XapiStatement {
  id: string
  actor_id: number | null
  verb_id: number | null
  object_id: number | null
  result_id: number | null
  authority_id: number | null
  context_id: number | null
  created: number | null
  stored: number | null
  has_attachments: boolean
}

export interface XapiToolLaunch {
  id: number
  course_id: number
  session_id: number | null
  title: string
  description: string | null
  launch_url: string
  activity_id: string | null
  activity_type: string | null
  allow_multiple_attempts: boolean
  lrs_url: string | null
  lrs_auth_username: string | null
  lrs_auth_password: string | null
  created_at: string
  updated_at: string
}

export interface XapiVerb {
  identifier: number
  id: string
  display: string | null
}
