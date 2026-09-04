@echo off
setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"
set "PACKAGE_ROOT=%SCRIPT_DIR%"
for %%I in ("%PACKAGE_ROOT%..") do set "DEFAULT_PROJECT_ROOT=%%~fI"

if "%PROJECT_ROOT%"=="" (
  set "PROJECT_ROOT=%DEFAULT_PROJECT_ROOT%"
)

set "TRAE_DIR=%PROJECT_ROOT%\.trae"
set "COMMAND=%~1"

if "%COMMAND%"=="" goto :usage

if /I "%COMMAND%"=="init" goto :init
if /I "%COMMAND%"=="apply" goto :apply
if /I "%COMMAND%"=="check" goto :check
if /I "%COMMAND%"=="all" goto :all
goto :usage

:init
if not exist "%TRAE_DIR%" mkdir "%TRAE_DIR%"
if exist "%TRAE_DIR%\whoIam.md" (
  echo ℹ️ 已存在: %TRAE_DIR%\whoIam.md
  goto :eof
)
set /p USERNAME_INPUT=username: 
set /p PROJECT_INPUT=projectName: 
(
  echo # whoIam
  echo.
  echo - username: %USERNAME_INPUT%
  echo - projectName: %PROJECT_INPUT%
  echo - aiDocPackage: ai-video-skills
) > "%TRAE_DIR%\whoIam.md"
echo ✅ 已生成: %TRAE_DIR%\whoIam.md
goto :eof

:apply
if not exist "%TRAE_DIR%" mkdir "%TRAE_DIR%"
if exist "%TRAE_DIR%\skills" rmdir /s /q "%TRAE_DIR%\skills"
if exist "%TRAE_DIR%\rules" rmdir /s /q "%TRAE_DIR%\rules"
mkdir "%TRAE_DIR%\skills"
mkdir "%TRAE_DIR%\rules"
xcopy "%PACKAGE_ROOT%skills\*" "%TRAE_DIR%\skills\" /e /i /y >nul
xcopy "%PACKAGE_ROOT%rules\*" "%TRAE_DIR%\rules\" /e /i /y >nul
copy /y "%PACKAGE_ROOT%skills.manifest.yaml" "%TRAE_DIR%\skills.manifest.yaml" >nul
echo ✅ 已同步 skills / rules / manifest 到 %TRAE_DIR%
goto :eof

:check
set "MISSING=0"
if exist "%TRAE_DIR%" (
  echo ✅ .trae: %TRAE_DIR%
) else (
  echo ❌ 缺少目录: %TRAE_DIR%
  set "MISSING=1"
)
if exist "%TRAE_DIR%\whoIam.md" (
  echo ✅ whoIam.md
) else (
  echo ⚠️ 缺少: %TRAE_DIR%\whoIam.md
  set "MISSING=1"
)
if exist "%TRAE_DIR%\skills" (
  echo ✅ skills\
) else (
  echo ❌ 缺少: %TRAE_DIR%\skills
  set "MISSING=1"
)
if exist "%TRAE_DIR%\rules" (
  echo ✅ rules\
) else (
  echo ❌ 缺少: %TRAE_DIR%\rules
  set "MISSING=1"
)
if exist "%TRAE_DIR%\skills.manifest.yaml" (
  echo ✅ skills.manifest.yaml
) else (
  echo ⚠️ 缺少: %TRAE_DIR%\skills.manifest.yaml
  set "MISSING=1"
)
if "%MISSING%"=="0" (
  echo ✅ check 通过
) else (
  echo ⚠️ check 未通过，请先执行 init/apply
  exit /b 1
)
goto :eof

:all
call "%~f0" init
call "%~f0" apply
call "%~f0" check
goto :eof

:usage
echo Usage:
echo   ai-video-skills\apply-trae.bat init
echo   ai-video-skills\apply-trae.bat apply
echo   ai-video-skills\apply-trae.bat check
echo   ai-video-skills\apply-trae.bat all
exit /b 1
