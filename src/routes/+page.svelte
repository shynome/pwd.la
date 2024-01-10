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
	on:submit|preventDefault={() => {
		update();
	}}
>
	<fieldset title="密码长度">
		<legend>密码长度</legend>
		<ul class="x-ul">
			{#each ['4', '8', '12', '18', '26'] as v}
				<li>
					<label>
						<input
							type="radio"
							name="size"
							value={v}
							bind:group={hashWordSize}
							on:change={() => {
								if (pw != '') {
									update();
								}
							}}
						/>
						{v}
					</label>
				</li>
			{/each}
		</ul>
	</fieldset>
	<fieldset title="A non-secure, easy-to-remember 'name' for this password">
		<legend>必定包含</legend>
		<ul class="x-ul">
			<li>
				<label>
					<input
						type="checkbox"
						value="8"
						bind:checked={requireDigit}
						disabled={restrictDigits}
						on:change={() => {
							if (pw != '') {
								update();
							}
						}}
					/>
					数字
				</label>
			</li>
			<li>
				<label>
					<input
						type="checkbox"
						value="12"
						bind:checked={requireMixedCase}
						disabled={restrictDigits}
						on:change={() => {
							if (pw != '') {
								update();
							}
						}}
					/>
					大写字母
				</label>
			</li>
			<li>
				<label>
					<input
						type="checkbox"
						value="12"
						bind:checked={requirePunctuation}
						disabled={restrictSpecial || restrictDigits}
						on:change={() => {
							if (pw != '') {
								update();
							}
						}}
					/>
					特殊符号
				</label>
			</li>
		</ul>
	</fieldset>
	<fieldset title="A non-secure, easy-to-remember 'name' for this password">
		<legend>选项</legend>
		<ul class="x-ul">
			<li>
				<label>
					<input
						type="checkbox"
						value="8"
						bind:checked={restrictDigits}
						on:change={() => {
							if (pw != '') {
								update();
							}
						}}
					/>
					纯数字
				</label>
			</li>
			<li>
				<label>
					<input
						type="checkbox"
						value="12"
						bind:checked={restrictSpecial}
						disabled={restrictDigits}
						on:change={() => {
							if (pw != '') {
								update();
							}
						}}
					/>
					无特殊符号
				</label>
			</li>
		</ul>
	</fieldset>
	<fieldset title="A non-secure, easy-to-remember 'name' for this password">
		<legend>应用</legend>
		<input type="text" bind:value={siteTag} />
	</fieldset>
	<fieldset title="A non-secure, easy-to-remember 'name' for this password">
		<legend>主密码</legend>
		{#if showMainPassword}
			<input type="text" id="main-pass" name="main-pass" required bind:value={masterKey} />
		{:else}
			<input type="password" id="main-pass" name="main-pass" required bind:value={masterKey} />
		{/if}
		<label>
			<input type="checkbox" name="show-main-pass" bind:checked={showMainPassword} />
			显示
		</label>
	</fieldset>
	<fieldset title="A non-secure, easy-to-remember 'name' for this password">
		<legend>生成的密码</legend>
		<div>
			<input type="text" bind:value={pw} readonly />
			<button
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
			<button type="submit">生成</button>
		</div>
	</fieldset>
</form>

<style>
	.x-ul {
		padding: 0;
		margin: 0;
	}
	.x-ul li {
		display: inline-block;
	}
	.x-ul li input {
		margin-top: 3px;
	}
	button[type='submit'] {
		margin-top: 5px;
	}
	.x-ul input[type='checkbox'],
	.x-ul input[type='radio'] {
		position: relative;
		top: 1.5px;
		margin-right: 0;
	}
	.x-ul li {
		margin-right: 7px;
	}
	.x-ul label {
		padding: 5px 7px;
		cursor: pointer;
	}
	form {
		margin: 0 auto;
		max-width: 750px;
	}
	input[type='text'],
	input[type='password'] {
		width: 280px;
	}
</style>
