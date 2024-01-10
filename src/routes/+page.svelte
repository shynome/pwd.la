<script lang="ts">
	import copy from 'copy-to-clipboard';
	import { PassHashCommon } from './pass-hash';
	import { WithPending } from '$lib/with-pending';

	let showMainPassword = false;

	let siteTag = '';
	let masterKey = '';
	let hashWordSize = '12';
	let requireDigit = false;
	let requirePunctuation = false;
	let requireMixedCase = false;
	let restrictSpecial = false;
	let restrictDigits = false;

	let pw = '';
	const copying = WithPending();
	function update() {
		pw = PassHashCommon.generateHashWord(
			siteTag.trim(),
			masterKey.trim(),
			Number(hashWordSize),
			requireDigit,
			requirePunctuation,
			requireMixedCase,
			restrictSpecial,
			restrictDigits
		);
	}
</script>

<form
	class="container"
	on:submit|preventDefault={() => {
		update();
	}}
>
	<div class="fieldset mb-3 row">
		<div class="legend col-sm-2 col-form-label">密码长度({hashWordSize})</div>
		<div class="col-sm-10">
			<div class="row align-items-center g-0">
				<div class="col col-auto">
					<button
						type="button"
						class="btn"
						on:click={() => {
							hashWordSize = Math.max(Number(hashWordSize) - 1, 4).toString();
						}}
					>
						-
					</button>
				</div>
				<div class="col fs-0">
					<input
						class="form-range"
						type="range"
						min="4"
						max="26"
						bind:value={hashWordSize}
						on:change={() => {
							if (pw != '') {
								update();
							}
						}}
					/>
				</div>
				<div class="col col-auto">
					<button
						type="button"
						class="btn"
						on:click={() => {
							hashWordSize = Math.min(Number(hashWordSize) + 1, 26).toString();
						}}
					>
						+
					</button>
				</div>
			</div>
		</div>
	</div>
	<div class="fieldset mb-3 row">
		<div class="legend col-sm-2 col-form-label">必定包含</div>
		<div class="col-sm-10">
			<ul class="x-ul">
				<li>
					<div class="form-check">
						<input
							class="form-check-input"
							type="checkbox"
							value=""
							id="require-digit"
							bind:checked={requireDigit}
							disabled={restrictDigits}
							on:change={() => {
								if (pw != '') {
									update();
								}
							}}
						/>
						<label for="require-digit" class="form-check-label">数字</label>
					</div>
				</li>
				<li>
					<div class="form-check">
						<input
							class="form-check-input"
							type="checkbox"
							value=""
							id="require-mixed-case"
							bind:checked={requireMixedCase}
							disabled={restrictDigits}
							on:change={() => {
								if (pw != '') {
									update();
								}
							}}
						/>
						<label for="require-mixed-case" class="form-check-label">大写字母</label>
					</div>
				</li>
				<li>
					<div class="form-check">
						<input
							class="form-check-input"
							type="checkbox"
							value=""
							id="require-punctuation"
							bind:checked={requirePunctuation}
							disabled={restrictSpecial || restrictDigits}
							on:change={() => {
								if (pw != '') {
									update();
								}
							}}
						/>
						<label for="require-punctuation" class="form-check-label">特殊符号</label>
					</div>
				</li>
			</ul>
		</div>
	</div>
	<div class="fieldset mb-3 row">
		<div class="legend col-sm-2 col-form-label">选项</div>
		<div class="col-sm-10">
			<ul class="x-ul">
				<li>
					<div class="form-check">
						<input
							class="form-check-input"
							type="checkbox"
							value=""
							id="restrict-digits"
							bind:checked={restrictDigits}
							on:change={() => {
								if (pw != '') {
									update();
								}
							}}
						/>
						<label for="restrict-digits" class="form-check-label">纯数字</label>
					</div>
				</li>
				<li>
					<div class="form-check">
						<input
							class="form-check-input"
							type="checkbox"
							value=""
							id="restrict-special"
							bind:checked={restrictSpecial}
							disabled={restrictDigits}
							on:change={() => {
								if (pw != '') {
									update();
								}
							}}
						/>
						<label for="restrict-special" class="form-check-label">无特殊符号</label>
					</div>
				</li>
			</ul>
		</div>
	</div>
	<div class="fieldset mb-3 row">
		<label for="app" class="legend col-sm-2 col-form-label">应用</label>
		<div class="col-sm-10">
			<input type="text" id="app" class="form-control" bind:value={siteTag} />
		</div>
	</div>
	<div class="fieldset mb-3 row">
		<label for="main-pass" class="legend col-sm-2 col-form-label">主密码</label>
		<div class="col-sm-10">
			<div class="input-group">
				{#if showMainPassword}
					<input
						class="form-control"
						type="text"
						id="main-pass"
						name="main-pass"
						required
						bind:value={masterKey}
					/>
				{:else}
					<input
						class="form-control"
						type="password"
						id="main-pass"
						name="main-pass"
						required
						bind:value={masterKey}
					/>
				{/if}
				<button
					type="button"
					class="btn"
					class:btn-primary={showMainPassword}
					class:btn-outline-secondary={!showMainPassword}
					on:click={() => {
						showMainPassword = !showMainPassword;
					}}
				>
					显示
				</button>
			</div>
		</div>
	</div>
	<div class="fieldset mb-3 row">
		<label for="pw" class="legend col-sm-2 col-form-label">生成的密码</label>
		<div class="col-sm-10">
			<div class="input-group mb-3">
				<input id="pw" type="text" class="form-control" bind:value={pw} readonly />
				<button
					class="btn btn-outline-primary"
					type="button"
					disabled={!pw}
					on:click={() => {
						copy(pw, {
							format: 'text/plain',
							onCopy: () => {
								copying.call(() => {
									return new Promise((rl) => setTimeout(rl, 1e3));
								});
							}
						});
					}}
				>
					{$copying ? '已复制' : '复制'}
				</button>
			</div>
			<div>
				<button type="submit" class="btn btn-primary">生成</button>
			</div>
		</div>
	</div>
</form>

<style>
	.x-ul {
		display: block;
		padding: 0;
		margin: 0;
	}
	.x-ul li {
		display: inline-block;
		margin-right: 1.5rem;
	}
	.fs-0 {
		font-size: 0;
	}
	.container {
		max-width: 750px;
	}
</style>
